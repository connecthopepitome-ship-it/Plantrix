/**
 * Plantrix Botanics — Cloudflare Edge Compatible Firestore REST Client
 * Communicates with Google Cloud Firestore via REST API v1 using standard fetch.
 * Translates between native JS data structures and Firestore FieldValue envelopes.
 */

import { getGoogleServiceAccountToken } from './server';

const getProjectId = () =>
  process.env.FIREBASE_ADMIN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  'plantrix-botanics';

const getBaseUrl = () =>
  `https://firestore.googleapis.com/v1/projects/${getProjectId()}/databases/(default)/documents`;

/**
 * Transforms a JavaScript value into a Firestore REST Document Value
 */
export function toFirestoreValue(val: any): Record<string, any> {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: val.toString() };
    }
    return { doubleValue: val };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(toFirestoreValue),
      },
    };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return {
      mapValue: { fields },
    };
  }
  return { stringValue: String(val) };
}

/**
 * Transforms a Firestore REST Document Value into a clean JavaScript value
 */
export function fromFirestoreValue(valObj: Record<string, any>): any {
  if (!valObj) return null;
  if ('nullValue' in valObj) return null;
  if ('booleanValue' in valObj) return valObj.booleanValue;
  if ('integerValue' in valObj) return parseInt(valObj.integerValue, 10);
  if ('doubleValue' in valObj) return parseFloat(valObj.doubleValue);
  if ('stringValue' in valObj) return valObj.stringValue;
  if ('timestampValue' in valObj) return valObj.timestampValue;
  if ('arrayValue' in valObj) {
    const vals = valObj.arrayValue?.values || [];
    return vals.map(fromFirestoreValue);
  }
  if ('mapValue' in valObj) {
    const fields = valObj.mapValue?.fields || {};
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = fromFirestoreValue(v as Record<string, any>);
    }
    return res;
  }
  return null;
}

/**
 * Converts a raw Firestore REST Document to a clean JavaScript object with id
 */
export function parseFirestoreDoc<T = Record<string, any>>(doc: any): T | null {
  if (!doc || !doc.fields) return null;
  const data: Record<string, any> = {};
  for (const [k, v] of Object.entries(doc.fields)) {
    data[k] = fromFirestoreValue(v as Record<string, any>);
  }
  // Extract document ID from doc.name: "projects/.../databases/(default)/documents/coll/docId"
  const parts = (doc.name || '').split('/');
  const docId = parts[parts.length - 1];
  return { id: docId, ...data } as T;
}

/**
 * Retrieves a single document by collection and ID
 */
export async function getFirestoreDoc<T = Record<string, any>>(
  collection: string,
  docId: string
): Promise<T | null> {
  const token = await getGoogleServiceAccountToken();
  const url = `${getBaseUrl()}/${collection}/${encodeURIComponent(docId)}`;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.warn(`[Firestore REST] Error fetching ${collection}/${docId}:`, res.statusText);
    return null;
  }

  const raw = await res.json();
  return parseFirestoreDoc<T>(raw);
}

/**
 * Saves or completely replaces a document in Firestore
 */
export async function setFirestoreDoc(
  collection: string,
  docId: string,
  data: Record<string, any>
): Promise<boolean> {
  const token = await getGoogleServiceAccountToken();
  const url = `${getBaseUrl()}/${collection}/${encodeURIComponent(docId)}`;

  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    console.error(`[Firestore REST] Failed to set ${collection}/${docId}:`, await res.text());
    return false;
  }
  return true;
}

/**
 * Deletes a document from Firestore
 */
export async function deleteFirestoreDoc(
  collection: string,
  docId: string
): Promise<boolean> {
  const token = await getGoogleServiceAccountToken();
  const url = `${getBaseUrl()}/${collection}/${encodeURIComponent(docId)}`;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { method: 'DELETE', headers });
  return res.ok;
}

/**
 * Lists documents from a collection with optional structured query
 */
export async function queryFirestoreCollection<T = Record<string, any>>(
  collection: string,
  options?: {
    pageSize?: number;
    pageToken?: string;
  }
): Promise<{ documents: T[]; nextPageToken?: string }> {
  const token = await getGoogleServiceAccountToken();
  const params = new URLSearchParams();
  if (options?.pageSize) params.set('pageSize', options.pageSize.toString());
  if (options?.pageToken) params.set('pageToken', options.pageToken);

  const qs = params.toString();
  const url = `${getBaseUrl()}/${collection}${qs ? `?${qs}` : ''}`;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    return { documents: [] };
  }

  const data = await res.json();
  const documents: T[] = (data.documents || [])
    .map((d: any) => parseFirestoreDoc<T>(d))
    .filter(Boolean) as T[];

  return {
    documents,
    nextPageToken: data.nextPageToken,
  };
}
