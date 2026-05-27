import { useState } from 'react';
import { Plus, Trash2, ExternalLink, Search, File, Link as LinkIcon, FolderOpen } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  url: string;
  type: 'file' | 'link';
  subject: string;
  description: string;
  addedDate: string;
}

export default function FileVault() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      title: 'Calculus Study Guide',
      url: 'https://example.com/calculus-guide.pdf',
      type: 'file',
      subject: 'Mathematics',
      description: 'Comprehensive guide for derivatives and integrals',
      addedDate: '2026-05-01',
    },
    {
      id: 2,
      title: 'Khan Academy - Physics',
      url: 'https://khanacademy.org/physics',
      type: 'link',
      subject: 'Physics',
      description: 'Video lectures and practice problems',
      addedDate: '2026-05-02',
    },
    {
      id: 3,
      title: 'Biology Lab Notes',
      url: 'https://example.com/bio-lab-notes.pdf',
      type: 'file',
      subject: 'Biology',
      description: 'Notes from all lab sessions',
      addedDate: '2026-04-28',
    },
    {
      id: 4,
      title: 'English Literature Resources',
      url: 'https://literature.org/shakespeare',
      type: 'link',
      subject: 'Literature',
      description: 'Shakespeare analysis and summaries',
      addedDate: '2026-04-30',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'file' | 'link'>('all');

  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    type: 'link' as 'file' | 'link',
    subject: 'General',
    description: '',
  });

  const subjects = ['All', ...Array.from(new Set(resources.map(r => r.subject)))];

  const addResource = () => {
    if (newResource.title && newResource.url) {
      const resource: Resource = {
        id: Date.now(),
        ...newResource,
        addedDate: new Date().toISOString().split('T')[0],
      };
      setResources([resource, ...resources]);
      setNewResource({
        title: '',
        url: '',
        type: 'link',
        subject: 'General',
        description: '',
      });
      setShowAddForm(false);
    }
  };

  const deleteResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'All' || resource.subject === filterSubject;
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const fileCount = resources.filter(r => r.type === 'file').length;
  const linkCount = resources.filter(r => r.type === 'link').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">File Vault</h2>
          <p className="text-muted-foreground">Store and organize your study materials and resources</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </button>
      </div>

      {/* Add Resource Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-4">Add New Resource</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Title</label>
              <input
                type="text"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="e.g., Calculus Study Guide"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">URL</label>
              <input
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://example.com/resource"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                placeholder="Brief description of the resource..."
                rows={3}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={newResource.subject}
                  onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value as 'file' | 'link' })}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="link">Link</option>
                  <option value="file">File</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addResource}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Resource
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{resources.length}</p>
          <p className="text-sm text-muted-foreground">Total Resources</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{fileCount}</p>
          <p className="text-sm text-muted-foreground">Files</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{linkCount}</p>
          <p className="text-sm text-muted-foreground">Links</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{subjects.length - 1}</p>
          <p className="text-sm text-muted-foreground">Subjects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('file')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                filterType === 'file'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              Files
            </button>
            <button
              onClick={() => setFilterType('link')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                filterType === 'link'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              Links
            </button>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-4">Resources ({filteredResources.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-8">
              No resources found
            </div>
          ) : (
            filteredResources.map(resource => (
              <div
                key={resource.id}
                className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    resource.type === 'file' ? 'bg-primary/10' : 'bg-chart-2/20'
                  }`}>
                    {resource.type === 'file' ? (
                      <File className="w-5 h-5 text-primary" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-chart-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 truncate">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        {resource.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {resource.addedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                  <button
                    onClick={() => deleteResource(resource.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 border border-border rounded-xl p-6">
        <div className="flex items-start gap-3">
          <FolderOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="mb-2">Organization Tips</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use clear, descriptive titles for easy searching</li>
              <li>• Add detailed descriptions to help remember context</li>
              <li>• Group resources by subject for better organization</li>
              <li>• Regularly review and remove outdated materials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
