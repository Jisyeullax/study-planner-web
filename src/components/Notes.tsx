import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search, BookOpen } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  subject: string;
  lastEdited: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('study_notes');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Simpan setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('study_notes', JSON.stringify(notes));
  }, [notes]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      subject: 'General',
      lastEdited: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditSubject(newNote.subject);
  };

  const saveNote = () => {
    if (selectedNote) {
      setNotes(notes.map(note =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: editTitle,
              content: editContent,
              subject: editSubject,
              lastEdited: new Date().toISOString().split('T')[0],
            }
          : note
      ));
      setSelectedNote({
        ...selectedNote,
        title: editTitle,
        content: editContent,
        subject: editSubject,
        lastEdited: new Date().toISOString().split('T')[0],
      });
      setIsEditing(false);
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const startEditing = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubject(note.subject);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'All' || note.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Notes</h2>
          <p className="text-muted-foreground">Organize your study materials and notes</p>
        </div>
        <button
          onClick={createNewNote}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Notes List */}
          <div className="bg-card border border-border rounded-xl p-4 max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              {filteredNotes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notes found</p>
              ) : (
                filteredNotes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsEditing(false);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedNote?.id === note.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-sm truncate">{note.title}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{note.subject}</span>
                      <span className="text-xs text-muted-foreground">{note.lastEdited}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Note Editor/Viewer */}
        <div className="lg:col-span-2">
          {!selectedNote ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Select a note to view or edit</p>
              <button
                onClick={createNewNote}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Create New Note
              </button>
            </div>
          ) : isEditing ? (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveNote}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Note
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="mb-2">{selectedNote.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 bg-secondary rounded-full">{selectedNote.subject}</span>
                    <span className="text-sm text-muted-foreground">Last edited: {selectedNote.lastEdited}</span>
                  </div>
                </div>
                <button
                  onClick={() => startEditing(selectedNote)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                  {selectedNote.content || 'No content yet. Click edit to add content.'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
