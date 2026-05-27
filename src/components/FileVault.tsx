import { useState, useEffect } from 'react';
import { FileText, Trash2, Plus, X, Image as ImageIcon, File, Link as LinkIcon } from 'lucide-react';

interface SavedFile {
  id: number;
  name: string;
  type: 'document' | 'image' | 'link' | 'other';
  url: string;
  dateAdded: string;
}

export default function Files() {
  // 1. Data dikosongkan secara default (mulai dari array kosong [])
  const [files, setFiles] = useState<SavedFile[]>(() => {
    const savedFiles = localStorage.getItem('study_files');
    if (savedFiles) return JSON.parse(savedFiles);
    return []; 
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFile, setNewFile] = useState({ name: '', type: 'document', url: '' });

  // 2. Simpan ke Local Storage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('study_files', JSON.stringify(files));
  }, [files]);

  const handleAddFile = () => {
    if (newFile.name.trim() && newFile.url.trim()) {
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      setFiles([...files, { 
        id: Date.now(), 
        name: newFile.name, 
        type: newFile.type as SavedFile['type'], 
        url: newFile.url,
        dateAdded: date
      }]);
      setNewFile({ name: '', type: 'document', url: '' }); // Reset form
      setShowAddForm(false); // Tutup form
    }
  };

  const handleDeleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-green-500" />;
      case 'link': return <LinkIcon className="w-8 h-8 text-purple-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">File Vault</h2>
          <p className="text-muted-foreground">Store your important study materials and links here.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? 'Cancel' : 'Add File / Link'}
        </button>
      </div>

      {/* Form Tambah File/Link */}
      {showAddForm && (
        <div className="bg-card border border-border p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold border-b border-border pb-2">Add New Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">File Name / Title</label>
              <input 
                type="text" 
                placeholder="e.g., Math Formula PDF, Biology Video..." 
                value={newFile.name}
                onChange={(e) => setNewFile({...newFile, name: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Resource Type</label>
              <select 
                value={newFile.type}
                onChange={(e) => setNewFile({...newFile, type: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary appearance-none"
              >
                <option value="document">Document (PDF, Word)</option>
                <option value="image">Image / Photo</option>
                <option value="link">Web Link / URL</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Link / URL (Google Drive, Dropbox, Website)</label>
              <input 
                type="text" 
                placeholder="https://..." 
                value={newFile.url}
                onChange={(e) => setNewFile({...newFile, url: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                *Since this is a web app, it's best to store your files in Google Drive and paste the link here.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleAddFile}
              disabled={!newFile.name || !newFile.url}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-opacity"
            >
              Save Resource
            </button>
          </div>
        </div>
      )}
      
      {/* Daftar File */}
      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map(file => (
            <div key={file.id} className="bg-card border border-border p-5 rounded-xl hover:border-primary hover:shadow-md transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary rounded-lg">
                  {getFileIcon(file.type)}
                </div>
                <button 
                  onClick={() => handleDeleteFile(file.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-semibold text-foreground line-clamp-1 mb-1">{file.name}</h4>
              <p className="text-xs text-muted-foreground mb-4">Added on {file.dateAdded}</p>
              
              <div className="mt-auto pt-4 border-t border-border">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" /> Open Resource
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <File className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-1">Your vault is empty</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              You haven't saved any files or links yet. Click the "Add File / Link" button to start organizing your study materials.
            </p>
          </div>
        )
      )}
    </div>
  );
}