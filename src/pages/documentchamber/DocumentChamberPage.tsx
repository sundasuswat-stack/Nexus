import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Upload, FileText, PenTool, Trash2, Download, Eye, X
} from 'lucide-react';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface DealDocument {
  id: string;
  name: string;
  size: string;
  status: DocStatus;
  uploadedOn: string;
  signature?: string;
}

export const DocumentChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<DealDocument[]>([
    {
      id: '1',
      name: 'Term Sheet - TechWave AI.pdf',
      size: '245 KB',
      status: 'In Review',
      uploadedOn: 'July 2, 2026',
    },
    {
      id: '2',
      name: 'NDA - Michael Rodriguez.pdf',
      size: '120 KB',
      status: 'Signed',
      uploadedOn: 'June 28, 2026',
      signature: 'Michael Rodriguez',
    },
    {
      id: '3',
      name: 'Investment Agreement Draft.docx',
      size: '340 KB',
      status: 'Draft',
      uploadedOn: 'July 4, 2026',
    },
  ]);

  const [previewDoc, setPreviewDoc] = useState<DealDocument | null>(null);
  const [signModalDoc, setSignModalDoc] = useState<DealDocument | null>(null);
  const [signatureInput, setSignatureInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusColor: Record<DocStatus, 'accent' | 'primary' | 'success'> = {
    Draft: 'accent',
    'In Review': 'primary',
    Signed: 'success',
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newDocs: DealDocument[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      status: 'Draft',
      uploadedOn: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const deleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const moveToReview = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'In Review' } : d))
    );
  };

  const openSignModal = (doc: DealDocument) => {
    setSignModalDoc(doc);
    setSignatureInput('');
  };

  const confirmSignature = () => {
    if (!signModalDoc || !signatureInput.trim()) return;
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === signModalDoc.id
          ? { ...d, status: 'Signed', signature: signatureInput.trim() }
          : d
      )
    );
    setSignModalDoc(null);
    setSignatureInput('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
        <p className="text-gray-500 mt-1">
          Upload, review, and sign deal documents and contracts.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className="bg-white rounded-lg shadow-sm p-8 mb-6 border-2 border-dashed border-gray-300 text-center cursor-pointer hover:border-primary-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e: React.DragEvent) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={36} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-700 font-medium">
          Drag & drop files here, or click to browse
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Supports PDF, DOC, DOCX (mock upload — for demo purposes)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No documents uploaded yet.
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-primary-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">
                    {doc.size} • Uploaded {doc.uploadedOn}
                    {doc.signature && ` • Signed by ${doc.signature}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={statusColor[doc.status]}>{doc.status}</Badge>

                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  title="Preview"
                >
                  <Eye size={18} />
                </button>

                {doc.status === 'Draft' && (
                  <Button size="sm" variant="outline" onClick={() => moveToReview(doc.id)}>
                    Send for Review
                  </Button>
                )}

                {doc.status === 'In Review' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<PenTool size={14} />}
                    onClick={() => openSignModal(doc)}
                  >
                    Sign
                  </Button>
                )}

                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-md"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-md p-10 text-center border border-gray-200">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-700">{previewDoc.name}</p>
              <p className="text-sm text-gray-400 mt-1">{previewDoc.size}</p>
              <p className="text-xs text-gray-400 mt-4">
                (Preview mockup — actual file rendering not implemented)
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" leftIcon={<Download size={16} />}>
                Download
              </Button>
              <Button variant="primary" onClick={() => setPreviewDoc(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* E-Signature Modal */}
      {signModalDoc && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Sign Document
            </h3>
            <p className="text-sm text-gray-500 mb-4">{signModalDoc.name}</p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type your full name to sign
            </label>
            <input
              type="text"
              value={signatureInput}
              onChange={(e) => setSignatureInput(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ fontFamily: 'cursive', fontSize: '1.1rem' }}
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setSignModalDoc(null)}>
                Cancel
              </Button>
              <Button
                variant="success"
                disabled={!signatureInput.trim()}
                onClick={confirmSignature}
              >
                Confirm Signature
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};