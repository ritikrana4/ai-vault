import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { UploadZone } from '../../components/UploadZone/UploadZone';
import { DocumentCard } from '../../components/DocumentCard/DocumentCard';
import { FolderCard } from '../../components/FolderCard/FolderCard';
import { CreateFolderModal } from '../../components/CreateFolderModal/CreateFolderModal';
import { UploadProgress } from '../../components/UploadProgress/UploadProgress';
import { DocumentViewer } from '../../components/DocumentViewer/DocumentViewer';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { Icon } from '../../components/Icon/Icon';
import { useDocuments, useFolders, useFileUpload } from '../../hooks';
import { useApp, setSelectedFolder } from '../../context';
import type { Folder } from '../../types/index';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { FOLDER_NAMES, LABELS, PLACEHOLDERS, MESSAGES } from '../../constants/app.constants';

export const Dashboard: React.FC = () => {
  const { selectedFolder, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  const { folders: allFolders, createFolder, refetch: refetchFolders } = useFolders();
  const { 
    documents, 
    folders: currentFolderSubfolders,
    uploadDocument, 
    refetch: refetchDocuments 
  } = useDocuments({
    folderId: selectedFolder ?? null,
  });

  const { uploads, uploadFiles, clearUploads } = useFileUpload();

  const filteredDocuments = searchQuery
    ? documents.filter((doc) =>
        doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  const filteredFolders = searchQuery
    ? currentFolderSubfolders.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentFolderSubfolders;

  const handleFolderSelect = (folderId: string | null) => {
    dispatch(setSelectedFolder(folderId));
    setShowUploadZone(false);
  };

  const handleFolderCreate = async (name: string) => {
    const parentId: string | null = selectedFolder ?? null;
    
    const newFolder = await createFolder(name, parentId);
    if (newFolder) {
      await refetchFolders();
      dispatch(setSelectedFolder(newFolder.id));
    }
  };

  const handleFolderClick = (folder: Folder) => {
    dispatch(setSelectedFolder(folder.id));
  };

  const handleFilesSelected = async (files: FileList) => {
    setShowUploadZone(false);
    
    await uploadFiles(Array.from(files), async (file) => {
      await uploadDocument(file);
    });
    
    await refetchDocuments();
    await refetchFolders();
    
    setTimeout(() => clearUploads(), 3000);
  };

  const handleDocumentClick = (document: { id: string }) => {
    setSelectedDocumentId(document.id);
  };

  const currentFolderName = React.useMemo(() => {
    if (!selectedFolder) return FOLDER_NAMES.ALL_FILES;
    const folder = allFolders.find(f => f.id === selectedFolder);
    return folder?.name || FOLDER_NAMES.ALL_FILES;
  }, [selectedFolder, allFolders]);

  const hasItems = filteredFolders.length > 0 || filteredDocuments.length > 0;
  const showTopUploadZone = showUploadZone && hasItems;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar
        folders={allFolders}
        selectedFolder={selectedFolder}
        onSelectFolder={handleFolderSelect}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-8 py-6 px-8 border-b border-neutral-200 bg-white shadow-sm">
          <div className="flex-1 min-w-0">
            {selectedFolder && (
              <Breadcrumb 
                selectedFolder={selectedFolder} 
                folders={allFolders} 
                onNavigate={handleFolderSelect} 
              />
            )}
            <div className="flex items-center gap-3">
              <h1 className="m-0 text-2xl font-semibold text-neutral-900">{currentFolderName}</h1>

              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={PLACEHOLDERS.SEARCH_DOCUMENTS}
                />
                <button
                  onClick={() => setShowUploadZone(!showUploadZone)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium bg-primary-600 text-white rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-primary-700 shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                >
                  <Icon name="upload" size={20} />
                  {LABELS.UPLOAD}
                </button>
                <button
                  onClick={() => setShowCreateFolderModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium bg-accent-500 text-white rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-accent-600 shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                >
                  <Icon name="plus" size={20} />
                  {LABELS.NEW_FOLDER}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {showTopUploadZone && (
            <div className="p-6">
              <UploadZone onFilesSelected={handleFilesSelected} />
            </div>
          )}

          {hasItems ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-6">
              {filteredFolders.map((folder) => (
                <FolderCard 
                  key={folder.id} 
                  folder={folder} 
                  onClick={handleFolderClick}
                />
              ))}
              {filteredDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc}
                  onClick={() => handleDocumentClick(doc)}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <EmptyState
              icon="file"
              title={MESSAGES.NO_DOCUMENTS}
              description={MESSAGES.NO_DOCUMENTS_FOUND}
            />
          ) : (
            <div className="p-6">
              <UploadZone onFilesSelected={handleFilesSelected} />
            </div>
          )}
        </div>
      </main>

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreateFolder={handleFolderCreate}
        existingFolders={allFolders}
        currentFolder={selectedFolder || null}
      />

      <UploadProgress uploads={uploads} onClose={clearUploads} />

      {selectedDocumentId && (
        <DocumentViewer 
          documentId={selectedDocumentId} 
          onClose={() => setSelectedDocumentId(null)} 
        />
      )}
    </div>
  );
};

