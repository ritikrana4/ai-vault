
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';
import { getDocument } from '../../services/document.service';
import type { Document } from '../../types/index';
import { formatFileSize, formatDate } from '../../utils';
import { LABELS, MESSAGES, TITLES, ERROR_MESSAGES } from '../../constants/app.constants';

export interface DocumentViewerProps {
  documentId: string;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId, onClose }) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'markdown' | 'original'>('summary');

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const doc = await getDocument(documentId);
        setDocument(doc);
      } catch (err) {
        setError(err instanceof Error ? err.message : ERROR_MESSAGES.DOCUMENT_LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (loading) {
    return (
      <div className="fixed top-0 right-0 w-[480px] h-screen bg-white border-l border-neutral-200 flex flex-col z-[100] shadow-2xl animate-slideInRight">
        <div className="flex flex-col items-center justify-center gap-4 h-full text-neutral-500">
          <Spinner size="lg" />
          <p>{MESSAGES.LOADING_DOCUMENT}</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="fixed top-0 right-0 w-[480px] h-screen bg-white border-l border-neutral-200 flex flex-col z-[100] shadow-2xl animate-slideInRight">
        <div className="flex flex-col items-center justify-center gap-4 h-full p-8 text-center text-neutral-500">
          <Icon name="close" size={48} />
          <p>{error || MESSAGES.DOCUMENT_NOT_FOUND}</p>
          <button 
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium bg-primary-600 text-white rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-primary-700 shadow-sm whitespace-nowrap"
          >
            {LABELS.CLOSE}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900/30 z-[99] animate-fadeIn backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed top-0 right-0 w-[480px] h-screen bg-white border-l border-neutral-200 flex flex-col z-[100] shadow-2xl animate-slideInRight" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between py-5 px-6 border-b border-neutral-200 bg-gradient-to-r from-primary-600 to-primary-700 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Icon name="file" size={24} className="text-white" />
            <div className="min-w-0 flex-1">
              <h2 className="m-0 text-base font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis" title={document.originalName}>
                {document.originalName}
              </h2>
              <p className="mt-1 mb-0 text-xs text-primary-100">
                {formatFileSize(document.size)} • {formatDate(document.uploadDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 text-white rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-primary-800"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-neutral-200 bg-white">
          <button
            className={`flex-1 py-4 px-4 border-none bg-transparent text-sm font-medium text-neutral-500 cursor-pointer transition-all duration-200 border-b-2 border-transparent hover:text-neutral-900 hover:bg-neutral-50 ${
              activeTab === 'summary' ? 'text-primary-600 border-b-primary-600 bg-primary-50' : ''
            }`}
            onClick={() => setActiveTab('summary')}
          >
            {LABELS.SUMMARY}
          </button>
          <button
            className={`flex-1 py-4 px-4 border-none bg-transparent text-sm font-medium text-neutral-500 cursor-pointer transition-all duration-200 border-b-2 border-transparent hover:text-neutral-900 hover:bg-neutral-50 ${
              activeTab === 'markdown' ? 'text-primary-600 border-b-primary-600 bg-primary-50' : ''
            }`}
            onClick={() => setActiveTab('markdown')}
          >
            {LABELS.MARKDOWN}
          </button>
          {/* <button
            className={`flex-1 py-4 px-4 border-none bg-transparent text-sm font-medium text-neutral-500 cursor-pointer transition-all duration-200 border-b-2 border-transparent hover:text-neutral-900 hover:bg-neutral-50 ${
              activeTab === 'original' ? 'text-primary-600 border-b-primary-600 bg-primary-50' : ''
            }`}
            onClick={() => setActiveTab('original')}
          >
            {LABELS.ORIGINAL}
          </button> */}
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {activeTab === 'summary' && (
            <div className="mb-8">
              <h3 className="m-0 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">{TITLES.AI_SUMMARY}</h3>
              <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                {document.summary || MESSAGES.NO_SUMMARY_AVAILABLE}
              </div>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="mb-8">
              <h3 className="m-0 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">{TITLES.MARKDOWN_VERSION}</h3>
              <div className="prose prose-gray prose-sm max-w-none">
                {document.markdown ? (
                  <ReactMarkdown>{document.markdown}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">{MESSAGES.NO_MARKDOWN_AVAILABLE}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'original' && (
            <div className="mb-8">
              <h3 className="m-0 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">{TITLES.ORIGINAL_FILE}</h3>
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="flex flex-col items-center gap-4 text-center p-8">
                  <Icon name="file" size={64} className="text-gray-400" />
                  <p className="m-0 text-[0.9375rem] font-medium text-gray-900 break-words">{document.originalName}</p>
                  <p className="m-0 text-xs text-gray-500">
                    {document.mimetype} • {formatFileSize(document.size)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

