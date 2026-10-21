'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileSpreadsheet,
  Archive,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Play,
  FileText,
  Filter,
  Search,
  ChevronDown,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import * as fflate from 'fflate';
import {
  DuplicatePolicy,
  ImportJobRecord,
  ImportValidationSummary,
  ValidatedImportRow,
} from '@/types/import';

export default function BulkImportPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'history'>('upload');

  // File Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [unzippedFiles, setUnzippedFiles] = useState<Record<string, Uint8Array>>({});
  const [archiveFileNames, setArchiveFileNames] = useState<string[]>([]);
  const [isParsingZip, setIsParsingZip] = useState(false);

  // Import Options
  const [duplicatePolicy, setDuplicatePolicy] = useState<DuplicatePolicy>('UPDATE_EXISTING');
  const [importAsDraft, setImportAsDraft] = useState<boolean>(true);
  const [isDryRun, setIsDryRun] = useState<boolean>(false);

  // Validation State
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationSummary, setValidationSummary] = useState<ImportValidationSummary | null>(null);
  const [validationFilter, setValidationFilter] = useState<'ALL' | 'CREATE' | 'UPDATE' | 'SKIP' | 'ERROR'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Execution State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeJob, setActiveJob] = useState<ImportJobRecord | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // History State
  const [historyJobs, setHistoryJobs] = useState<ImportJobRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  const csvInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/admin/imports');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHistoryJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch import history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle CSV file selection
  const handleCsvSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a valid .csv spreadsheet file.');
      return;
    }
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  // Handle ZIP file selection & client-side extraction
  const handleZipSelect = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      alert('Please select a valid .zip image archive.');
      return;
    }
    setZipFile(file);
    setIsParsingZip(true);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      fflate.unzip(bytes, (err, unzipped) => {
        setIsParsingZip(false);
        if (err) {
          alert('Failed to read ZIP archive: ' + err.message);
          return;
        }

        const safeMap: Record<string, Uint8Array> = {};
        const safeNames: string[] = [];

        for (const [path, data] of Object.entries(unzipped)) {
          // Reject path traversal and hidden system files
          if (
            path.includes('..') ||
            path.startsWith('/') ||
            path.startsWith('\\') ||
            path.includes('__MACOSX') ||
            path.includes('.DS_Store') ||
            data.length === 0
          ) {
            continue;
          }
          safeMap[path] = data;
          safeNames.push(path);
        }

        setUnzippedFiles(safeMap);
        setArchiveFileNames(safeNames);
      });
    } catch (err: any) {
      setIsParsingZip(false);
      alert('Failed to process ZIP file: ' + err.message);
    }
  };

  // Trigger Validation (Stage 1)
  const handleValidate = async () => {
    if (!csvContent) {
      alert('Please upload a CSV file first.');
      return;
    }

    setIsValidating(true);
    setExecutionError(null);

    try {
      const res = await fetch('/api/admin/imports/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvContent,
          duplicatePolicy,
          importAsDraftDefault: importAsDraft,
          archiveFileNames,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to validate CSV');
      }

      setValidationSummary(data.data);
      setActiveTab('preview');
    } catch (err: any) {
      setExecutionError(err.message || 'Validation error');
    } finally {
      setIsValidating(false);
    }
  };

  // Trigger Execution (Stage 2)
  const handleExecuteImport = async () => {
    if (!validationSummary || validationSummary.rows.length === 0) return;

    setIsExecuting(true);
    setExecutionError(null);

    try {
      // Build base64 payload for matched images if ZIP was provided
      const imagePayloads: Record<string, { base64: string; contentType: string }> = {};

      if (Object.keys(unzippedFiles).length > 0) {
        for (const row of validationSummary.rows) {
          for (const fn of row.imageFilenames) {
            const bytes = unzippedFiles[fn];
            if (bytes && !imagePayloads[fn]) {
              let binary = '';
              for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);
              const ext = fn.split('.').pop()?.toLowerCase();
              const contentType =
                ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
              imagePayloads[fn] = { base64, contentType };
            }
          }
        }
      }

      const res = await fetch('/api/admin/imports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: validationSummary.rows,
          duplicatePolicy,
          isDryRun,
          importAsDraftDefault: importAsDraft,
          fileName: csvFile?.name || 'import.csv',
          fileSizeBytes: csvFile?.size || 0,
          imagePayloads: Object.keys(imagePayloads).length > 0 ? imagePayloads : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute import');
      }

      setActiveJob(data.data);
      fetchHistory();
      setActiveTab('history');
    } catch (err: any) {
      setExecutionError(err.message || 'Import execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  // Export validation report as CSV
  const handleExportValidationReport = () => {
    if (!validationSummary) return;
    const headers = [
      'Row',
      'SKU',
      'Name',
      'Department',
      'Category',
      'SellingPriceINR',
      'Stock',
      'Action',
      'ValidationStatus',
      'MatchedImagesCount',
      'Errors',
      'Warnings',
    ];

    const lines = validationSummary.rows.map((r) =>
      [
        r.rowNumber,
        `"${r.sku}"`,
        `"${r.name.replace(/"/g, '""')}"`,
        r.department,
        r.categoryId,
        r.sellingPriceINR,
        r.stock,
        r.action,
        r.validationStatus,
        r.imageFilenames.length,
        `"${r.errors.join('; ').replace(/"/g, '""')}"`,
        `"${r.warnings.join('; ').replace(/"/g, '""')}"`,
      ].join(',')
    );

    const csvStr = `${headers.join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `validation-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered rows for preview table
  const filteredRows = (validationSummary?.rows || []).filter((r) => {
    if (validationFilter === 'CREATE' && r.action !== 'CREATE') return false;
    if (validationFilter === 'UPDATE' && r.action !== 'UPDATE') return false;
    if (validationFilter === 'SKIP' && r.action !== 'SKIP') return false;
    if (validationFilter === 'ERROR' && r.action !== 'ERROR') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.sku.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 text-neutral-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 uppercase">
              Catalogue Operations
            </span>
            <span className="text-xs font-mono text-neutral-400">Batch Processing</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-white tracking-tight">
            Bulk Product Import
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Import 100–500+ products securely using structured CSV data and matched image ZIP archives.
            Includes automatic price conversion, category validation, duplicate conflict resolution, and dry-run preview.
          </p>
        </div>

        {/* Download Template Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/imports/template?type=template"
            download
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#142319] hover:bg-[#1a2f22] text-neutral-200 hover:text-white rounded-lg border border-emerald-900/40 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Download Blank Template
          </a>
          <a
            href="/api/admin/imports/template?type=sample"
            download
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#142319] hover:bg-[#1a2f22] text-emerald-300 hover:text-emerald-200 rounded-lg border border-emerald-800/50 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-lime-400" />
            Download Sample CSV
          </a>
        </div>
      </div>

      {/* Metric Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Total Imported</p>
          <p className="text-2xl font-bold font-display text-white mt-1">
            {historyJobs.reduce((acc, j) => acc + (j.successCount || 0), 0)}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Live Firestore Records</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Updated</p>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-1">
            {historyJobs.reduce((acc, j) => acc + (j.updatedCount || 0), 0)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">By SKU Matching</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Skipped</p>
          <p className="text-2xl font-bold font-display text-amber-300 mt-1">
            {historyJobs.reduce((acc, j) => acc + (j.skippedCount || 0), 0)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Existing Duplicates</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Failed Rows</p>
          <p className="text-2xl font-bold font-display text-rose-400 mt-1">
            {historyJobs.reduce((acc, j) => acc + (j.failedCount || 0), 0)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Validation/DB Errors</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">R2 Images</p>
          <p className="text-2xl font-bold font-display text-lime-400 mt-1">
            {historyJobs.reduce((acc, j) => acc + (j.imageUploadCount || 0), 0)}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Cloudflare R2 Objects</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Import Jobs</p>
          <p className="text-2xl font-bold font-display text-white mt-1">{historyJobs.length}</p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Completed Batches</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-950/60">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          1. Upload & Options
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          disabled={!validationSummary}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-lime-400 text-lime-400'
              : !validationSummary
              ? 'border-transparent text-neutral-600 cursor-not-allowed'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          2. Validation Preview
          {validationSummary && (
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono">
              {validationSummary.totalRows}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          3. Import History ({historyJobs.length})
        </button>
      </div>

      {/* Error Banner */}
      {executionError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300">Operation Alert</p>
            <p className="mt-0.5 text-rose-200/90">{executionError}</p>
          </div>
        </div>
      )}

      {/* TAB 1: UPLOAD & OPTIONS */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSV Upload Dropzone */}
            <div className="p-6 rounded-2xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-white text-base">Product Data (CSV)</h3>
                    <p className="text-xs text-neutral-400">Required: Product attributes, SKUs, and INR pricing</p>
                  </div>
                </div>
                {csvFile && (
                  <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                    Ready
                  </span>
                )}
              </div>

              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleCsvSelect(e.target.files[0])}
                className="hidden"
              />

              <div
                onClick={() => csvInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleCsvSelect(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  csvFile
                    ? 'border-emerald-600/60 bg-emerald-950/20'
                    : 'border-emerald-950 hover:border-emerald-700/60 bg-[#0B150F]/60'
                }`}
              >
                <UploadCloud className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
                {csvFile ? (
                  <div>
                    <p className="font-medium text-white text-sm">{csvFile.name}</p>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      {(csvFile.size / 1024).toFixed(1)} KB • Click to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      Drag and drop your product CSV file here
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">or click to browse from your computer</p>
                  </div>
                )}
              </div>
            </div>

            {/* ZIP Images Dropzone */}
            <div className="p-6 rounded-2xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-lime-400">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-white text-base">Product Images (ZIP)</h3>
                    <p className="text-xs text-neutral-400">Optional: Folder structure or SKU-matched photos</p>
                  </div>
                </div>
                {archiveFileNames.length > 0 && (
                  <span className="text-xs text-lime-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-lime-800/60 font-mono">
                    {archiveFileNames.length} Images
                  </span>
                )}
              </div>

              <input
                ref={zipInputRef}
                type="file"
                accept=".zip"
                onChange={(e) => e.target.files?.[0] && handleZipSelect(e.target.files[0])}
                className="hidden"
              />

              <div
                onClick={() => zipInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleZipSelect(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  archiveFileNames.length > 0
                    ? 'border-lime-600/60 bg-emerald-950/20'
                    : 'border-emerald-950 hover:border-emerald-700/60 bg-[#0B150F]/60'
                }`}
              >
                <Archive className="w-10 h-10 mx-auto text-lime-400 mb-2 opacity-80" />
                {isParsingZip ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-lime-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Extracting archive in browser...
                  </div>
                ) : zipFile ? (
                  <div>
                    <p className="font-medium text-white text-sm">{zipFile.name}</p>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      {(zipFile.size / (1024 * 1024)).toFixed(1)} MB • {archiveFileNames.length} image files ready
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      Drag and drop image archive (.zip)
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Folders named by SKU or files starting with SKU- (WebP, JPG, PNG)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Import Configuration Options */}
          <div className="p-6 rounded-2xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg space-y-6">
            <h3 className="font-display font-medium text-white text-base border-b border-emerald-950/60 pb-3">
              Import Configuration & Duplicate Policy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  duplicatePolicy === 'UPDATE_EXISTING'
                    ? 'border-lime-500/80 bg-emerald-950/40 text-white'
                    : 'border-emerald-950 bg-[#0B150F]/40 text-neutral-400 hover:border-emerald-800'
                }`}
              >
                <input
                  type="radio"
                  name="duplicatePolicy"
                  value="UPDATE_EXISTING"
                  checked={duplicatePolicy === 'UPDATE_EXISTING'}
                  onChange={() => setDuplicatePolicy('UPDATE_EXISTING')}
                  className="sr-only"
                />
                <div className="font-medium text-sm text-white flex items-center justify-between">
                  Update Existing
                  {duplicatePolicy === 'UPDATE_EXISTING' && (
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Updates price, stock, and descriptions for existing SKUs; creates new ones.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  duplicatePolicy === 'SKIP_EXISTING'
                    ? 'border-lime-500/80 bg-emerald-950/40 text-white'
                    : 'border-emerald-950 bg-[#0B150F]/40 text-neutral-400 hover:border-emerald-800'
                }`}
              >
                <input
                  type="radio"
                  name="duplicatePolicy"
                  value="SKIP_EXISTING"
                  checked={duplicatePolicy === 'SKIP_EXISTING'}
                  onChange={() => setDuplicatePolicy('SKIP_EXISTING')}
                  className="sr-only"
                />
                <div className="font-medium text-sm text-white flex items-center justify-between">
                  Skip Existing
                  {duplicatePolicy === 'SKIP_EXISTING' && (
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Only imports new SKUs; preserves existing catalogue products unchanged.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  duplicatePolicy === 'CREATE_NEW'
                    ? 'border-lime-500/80 bg-emerald-950/40 text-white'
                    : 'border-emerald-950 bg-[#0B150F]/40 text-neutral-400 hover:border-emerald-800'
                }`}
              >
                <input
                  type="radio"
                  name="duplicatePolicy"
                  value="CREATE_NEW"
                  checked={duplicatePolicy === 'CREATE_NEW'}
                  onChange={() => setDuplicatePolicy('CREATE_NEW')}
                  className="sr-only"
                />
                <div className="font-medium text-sm text-white flex items-center justify-between">
                  Fail on Conflict
                  {duplicatePolicy === 'CREATE_NEW' && (
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Flags any existing SKU as a conflict error requiring correction.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  duplicatePolicy === 'FLAG_REVIEW'
                    ? 'border-lime-500/80 bg-emerald-950/40 text-white'
                    : 'border-emerald-950 bg-[#0B150F]/40 text-neutral-400 hover:border-emerald-800'
                }`}
              >
                <input
                  type="radio"
                  name="duplicatePolicy"
                  value="FLAG_REVIEW"
                  checked={duplicatePolicy === 'FLAG_REVIEW'}
                  onChange={() => setDuplicatePolicy('FLAG_REVIEW')}
                  className="sr-only"
                />
                <div className="font-medium text-sm text-white flex items-center justify-between">
                  Flag for Review
                  {duplicatePolicy === 'FLAG_REVIEW' && (
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Imports new products and exports conflicting SKUs for manual review.
                </p>
              </label>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-emerald-950/40">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={importAsDraft}
                  onChange={(e) => setImportAsDraft(e.target.checked)}
                  className="rounded border-emerald-800 bg-emerald-950 text-lime-500 focus:ring-lime-400 w-4 h-4"
                />
                <span>Import new products as <strong>DRAFT</strong> (recommended for review before live publishing)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={isDryRun}
                  onChange={(e) => setIsDryRun(e.target.checked)}
                  className="rounded border-emerald-800 bg-emerald-950 text-lime-500 focus:ring-lime-400 w-4 h-4"
                />
                <span className="text-amber-300">
                  <strong>Dry Run Mode</strong> (Simulate validation without writing to Firestore or R2)
                </span>
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-950/60">
              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Private supplier fields (sourceCost, supplierSku) are never exposed to public storefront DTOs.
              </div>

              <button
                onClick={handleValidate}
                disabled={!csvContent || isValidating}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-lg shadow-lime-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating CSV & SKUs...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Validate & Preview Import
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VALIDATION PREVIEW */}
      {activeTab === 'preview' && validationSummary && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
              <div>
                <h3 className="font-display font-medium text-white text-lg flex items-center gap-2">
                  Validation Summary
                  {isDryRun && (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                      Dry-Run Simulation
                    </span>
                  )}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Policy: <strong className="text-white">{validationSummary.duplicatePolicy}</strong> •{' '}
                  {validationSummary.totalRows} rows parsed •{' '}
                  {validationSummary.detectedDepartments.length} departments •{' '}
                  {validationSummary.detectedCategories.length} categories
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportValidationReport}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#142319] hover:bg-[#1a2f22] text-neutral-200 rounded-lg border border-emerald-900/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Export Validation Report (CSV)
                </button>

                <button
                  onClick={handleExecuteImport}
                  disabled={isExecuting || validationSummary.createCount + validationSummary.updateCount === 0}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 transition-all shadow-lg shadow-lime-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Importing Products...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {isDryRun ? 'Run Dry-Run Test' : `Commit Import (${validationSummary.createCount + validationSummary.updateCount} Products)`}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#0B150F]/60 border border-emerald-950">
                <span className="text-xs text-neutral-400">Ready to Create</span>
                <p className="text-xl font-bold text-emerald-400 font-display mt-0.5">
                  {validationSummary.createCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B150F]/60 border border-emerald-950">
                <span className="text-xs text-neutral-400">Ready to Update</span>
                <p className="text-xl font-bold text-lime-400 font-display mt-0.5">
                  {validationSummary.updateCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B150F]/60 border border-emerald-950">
                <span className="text-xs text-neutral-400">Will be Skipped</span>
                <p className="text-xl font-bold text-amber-300 font-display mt-0.5">
                  {validationSummary.skipCount + validationSummary.flagReviewCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B150F]/60 border border-emerald-950">
                <span className="text-xs text-neutral-400">Rows with Errors</span>
                <p className="text-xl font-bold text-rose-400 font-display mt-0.5">
                  {validationSummary.errorRows}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0B150F]/60 border border-emerald-950">
                <span className="text-xs text-neutral-400">Warnings</span>
                <p className="text-xl font-bold text-neutral-300 font-display mt-0.5">
                  {validationSummary.warningRows}
                </p>
              </div>
            </div>
          </div>

          {/* Table Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setValidationFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  validationFilter === 'ALL'
                    ? 'bg-lime-400 text-neutral-950 border-lime-400 font-semibold'
                    : 'bg-[#0F1C14] text-neutral-300 border-emerald-950 hover:border-emerald-800'
                }`}
              >
                All ({validationSummary.totalRows})
              </button>
              <button
                onClick={() => setValidationFilter('CREATE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  validationFilter === 'CREATE'
                    ? 'bg-emerald-500 text-neutral-950 border-emerald-500 font-semibold'
                    : 'bg-[#0F1C14] text-emerald-400 border-emerald-950 hover:border-emerald-800'
                }`}
              >
                Create ({validationSummary.createCount})
              </button>
              <button
                onClick={() => setValidationFilter('UPDATE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  validationFilter === 'UPDATE'
                    ? 'bg-lime-400 text-neutral-950 border-lime-400 font-semibold'
                    : 'bg-[#0F1C14] text-lime-400 border-emerald-950 hover:border-emerald-800'
                }`}
              >
                Update ({validationSummary.updateCount})
              </button>
              <button
                onClick={() => setValidationFilter('SKIP')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  validationFilter === 'SKIP'
                    ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold'
                    : 'bg-[#0F1C14] text-amber-300 border-emerald-950 hover:border-emerald-800'
                }`}
              >
                Skip ({validationSummary.skipCount + validationSummary.flagReviewCount})
              </button>
              <button
                onClick={() => setValidationFilter('ERROR')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  validationFilter === 'ERROR'
                    ? 'bg-rose-500 text-white border-rose-500 font-semibold'
                    : 'bg-[#0F1C14] text-rose-400 border-emerald-950 hover:border-emerald-800'
                }`}
              >
                Errors ({validationSummary.errorRows})
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search SKU or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#0F1C14] border border-emerald-950 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B150F] text-neutral-400 font-mono uppercase tracking-wider border-b border-emerald-950">
                  <tr>
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Department / Category</th>
                    <th className="py-3 px-4 text-right">Selling Price</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-center">Images</th>
                    <th className="py-3 px-4">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/40">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.rowNumber}
                      className={`hover:bg-[#142319]/40 transition-colors ${
                        row.action === 'ERROR' ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-neutral-500">{row.rowNumber}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            row.action === 'CREATE'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              : row.action === 'UPDATE'
                              ? 'bg-lime-950/80 text-lime-400 border border-lime-800/60'
                              : row.action === 'SKIP'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                          }`}
                        >
                          {row.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-white">{row.sku}</td>
                      <td className="py-3 px-4 text-neutral-200 max-w-xs truncate" title={row.name}>
                        {row.name}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">
                        <span className="block text-[11px] text-emerald-400">{row.department}</span>
                        <span className="text-[10px] text-neutral-500">{row.categoryId}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-white">
                        ₹{row.sellingPriceINR.toLocaleString('en-IN')}
                        <span className="block text-[10px] text-neutral-500">
                          ({row.sellingPricePaise} p)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-neutral-300">{row.stock}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-900 text-lime-400">
                          {row.imageFilenames.length} / 4
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {row.errors.length > 0 ? (
                          <div className="text-rose-400 flex items-center gap-1.5" title={row.errors.join('; ')}>
                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{row.errors[0]}</span>
                          </div>
                        ) : row.warnings.length > 0 ? (
                          <div className="text-amber-300 flex items-center gap-1.5" title={row.warnings.join('; ')}>
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{row.warnings[0]}</span>
                          </div>
                        ) : (
                          <div className="text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Valid</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-neutral-500 font-mono">
                        No rows matching filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IMPORT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-white text-lg">Batch Import Job History</h3>
            <button
              onClick={fetchHistory}
              disabled={isLoadingHistory}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#142319] hover:bg-[#1a2f22] text-neutral-300 border border-emerald-900/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="rounded-2xl bg-[#0F1C14] border border-emerald-950/60 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B150F] text-neutral-400 font-mono uppercase tracking-wider border-b border-emerald-950">
                  <tr>
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Policy</th>
                    <th className="py-3 px-4 text-center">Total</th>
                    <th className="py-3 px-4 text-center text-emerald-400">Created</th>
                    <th className="py-3 px-4 text-center text-lime-400">Updated</th>
                    <th className="py-3 px-4 text-center text-amber-300">Skipped</th>
                    <th className="py-3 px-4 text-center text-rose-400">Failed</th>
                    <th className="py-3 px-4 text-center">Images</th>
                    <th className="py-3 px-4">Started At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/40">
                  {historyJobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-[#142319]/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        {job.jobId}
                        {job.isDryRun && (
                          <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            Dry-Run
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">{job.fileName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            job.status === 'COMPLETED'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : job.status === 'PROCESSING'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">{job.duplicatePolicy}</td>
                      <td className="py-3 px-4 text-center font-mono text-neutral-300">{job.totalRows}</td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-emerald-400">
                        {job.successCount}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-lime-400">
                        {job.updatedCount}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-amber-300">{job.skippedCount}</td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-rose-400">
                        {job.failedCount}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-lime-400">
                        {job.imageUploadCount}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500">
                        {new Date(job.startedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {historyJobs.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-neutral-500 font-mono">
                        No bulk import jobs executed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
