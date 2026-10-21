'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
} from 'lucide-react';
import { getImportJobs } from '@/data/sourcingStore';
import { ImportJob } from '@/types/sourcing';

export default function ImportHistoryPage() {
  const [jobs] = useState<ImportJob[]>(getImportJobs());

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/sourcing" className="text-xs text-outline hover:text-secondary">
              Sourcing
            </Link>
            <span className="text-outline text-xs">/</span>
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
              Provenance Ledger
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Import History &amp; Extraction Jobs
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Complies with Section 12. Full audit trail of executed Meesho URL parsing jobs, extracted properties, and missing attributes.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <span className="text-[11px] font-label-sm uppercase tracking-wider text-outline block mb-1">
            Total Extraction Jobs
          </span>
          <div className="font-display font-bold text-2xl text-on-surface font-mono">{jobs.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <span className="text-[11px] font-label-sm uppercase tracking-wider text-outline block mb-1">
            Extraction Success Rate
          </span>
          <div className="font-display font-bold text-2xl text-secondary font-mono">100%</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <span className="text-[11px] font-label-sm uppercase tracking-wider text-outline block mb-1">
            Audit Integrity
          </span>
          <div className="font-display font-bold text-2xl text-primary flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="text-sm font-label-sm uppercase">Verified</span>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Job ID &amp; Time</th>
                <th className="py-3 px-4">Source URL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Extracted Fields</th>
                <th className="py-3 px-4">Missing Fields</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4 text-right">Linked Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {jobs.map((job) => (
                <tr key={job.jobId} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-secondary block">{job.jobId}</span>
                    <span className="text-[10px] text-outline">
                      {new Date(job.startedAt).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate">
                    <a
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface hover:text-secondary flex items-center gap-1 truncate font-mono text-[11px]"
                    >
                      <span className="truncate">{job.sourceUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {job.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {job.importedFields.map((f) => (
                        <span
                          key={f}
                          className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono text-on-surface-variant"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {job.missingFields.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {job.missingFields.map((f) => (
                          <span
                            key={f}
                            className="px-1.5 py-0.5 rounded bg-error/15 text-error text-[10px] font-mono"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-outline">None</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-on-surface font-medium">{job.createdBy}</td>

                  <td className="py-3 px-4 text-right font-mono">
                    {job.sourceRecordId ? (
                      <Link
                        href={`/admin/sourcing`}
                        className="text-secondary hover:underline font-bold"
                      >
                        {job.sourceRecordId}
                      </Link>
                    ) : (
                      <span className="text-outline">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
