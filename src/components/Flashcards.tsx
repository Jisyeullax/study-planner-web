import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FolderOpen, ArrowLeft, Plus, Trash2, X, Layers } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  folder: string;
  mastered: boolean;
}

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const savedCards = localStorage.getItem('study_flashcards');
    if (savedCards) return JSON.parse(savedCards);
    return []; 
  });

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', folder: '' });

  useEffect(() => {
    localStorage.setItem('study_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const handleAddCard = () => {
    if (newCard.front.trim() && newCard.back.trim() && newCard.folder.trim()) {
      setFlashcards([...flashcards, { 
        id: Date.now(), 
        front: newCard.front, 
        back: newCard.back, 
        folder: newCard.folder, 
        mastered: false 
      }]);
      setNewCard({ front: '', back: '', folder: '' }); 
      setShowAddForm(false); 
    }
  };

  const handleDeleteCard = (id: number) => {
    const updatedCards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedCards);
    
    const remainingInFolder = updatedCards.filter(f => f.folder === currentFolder);
    if (remainingInFolder.length === 0) {
      setCurrentFolder(null);
    } else if (currentIndex >= remainingInFolder.length) {
      setCurrentIndex(remainingInFolder.length - 1);
    }
    setIsFlipped(false);
  };

  const folders = Array.from(new Set(flashcards.map(f => f.folder)));

  // --- VIEW 1: MAIN MENU (DAFTAR FOLDER) ---
  if (!currentFolder) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Flashcard Folders</h2>
            <p className="text-muted-foreground">Choose a folder to start studying</p>
          </div>
          <button 
            onClick={() => { setShowAddForm(!showAddForm); setNewCard({ front: '', back: '', folder: '' }); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showAddForm ? 'Cancel' : 'New Folder & Card'}
          </button>
        </div>

        {/* Form Tambah Kartu (Menu Utama) */}
        {showAddForm && (
          <div className="bg-card border border-border p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-semibold border-b border-border pb-2">Create New Flashcard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Folder Name (Category)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Math, Biology, History..." 
                  value={newCard.folder}
                  onChange={(e) => setNewCard({...newCard, folder: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Front Side (Question)</label>
                <textarea 
                  rows={3}
                  placeholder="Write the question here..." 
                  value={newCard.front}
                  onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Back Side (Answer)</label>
                <textarea 
                  rows={3}
                  placeholder="Write the answer here..." 
                  value={newCard.back}
                  onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={handleAddCard}
                disabled={!newCard.front || !newCard.back || !newCard.folder}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-opacity"
              >
                Save Card
              </button>
            </div>
          </div>
        )}
        
        {/* Grid Folder */}
        {folders.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map(folder => {
              const cardCount = flashcards.filter(f => f.folder === folder).length;
              return (
                <div 
                  key={folder} 
                  onClick={() => { setCurrentFolder(folder); setCurrentIndex(0); setIsFlipped(false); setShowAddForm(false); }} 
                  className="bg-card border border-border p-6 rounded-xl cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center aspect-square"
                >
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <FolderOpen className="w-8 h-8 text-primary" />
                  </div>
                  <span className="font-semibold line-clamp-1">{folder}</span>
                  <span className="text-xs text-muted-foreground mt-1">{cardCount} {cardCount === 1 ? 'Card' : 'Cards'}</span>
                </div>
              );
            })}
          </div>
        ) : (
          !showAddForm && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No flashcards yet. Click "New Folder & Card" to get started!</p>
            </div>
          )
        )}
      </div>
    );
  }

  // --- VIEW 2: INSIDE FOLDER (MODE BELAJAR) ---
  const currentCards = flashcards.filter(f => f.folder === currentFolder);
  const card = currentCards[currentIndex];

  const nextCard = () => { setIsFlipped(false); setCurrentIndex((prev) => (prev + 1) % currentCards.length); };
  const prevCard = () => { setIsFlipped(false); setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length); };

  return (
    <div className="space-y-6">
      
      {/* Header Dalam Folder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => { setCurrentFolder(null); setIsFlipped(false); setShowAddForm(false); }} className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{currentFolder}</h2>
            <p className="text-sm text-muted-foreground">
              {currentCards.length > 0 ? `Card ${currentIndex + 1} of ${currentCards.length}` : 'Empty Folder'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tombol Tambah Kartu ke Folder Ini */}
          <button 
            onClick={() => { 
              setShowAddForm(!showAddForm); 
              setNewCard({ front: '', back: '', folder: currentFolder }); // Auto-isi nama folder
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors text-sm font-medium"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Cancel' : 'Add Card Here'}
          </button>
          
          {/* Tombol Hapus Kartu (Hanya muncul jika ada kartu) */}
          {currentCards.length > 0 && (
            <button 
              onClick={() => handleDeleteCard(card.id)} 
              className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete this card"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form Tambah Kartu (Dalam Folder) */}
      {showAddForm && (
        <div className="bg-card border border-border p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold border-b border-border pb-2">Add New Card to "{currentFolder}"</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Front Side (Question)</label>
              <textarea 
                rows={3}
                placeholder="Write the question here..." 
                value={newCard.front}
                onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Back Side (Answer)</label>
              <textarea 
                rows={3}
                placeholder="Write the answer here..." 
                value={newCard.back}
                onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleAddCard}
              disabled={!newCard.front || !newCard.back}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-opacity"
            >
              Save Card
            </button>
          </div>
        </div>
      )}

      {/* 3D Card Engine (Solusi Inline CSS agar tidak mirror/terbalik) */}
      {!showAddForm && currentCards.length > 0 && (
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 mt-8">
          <div className="w-full h-80 perspective-[1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            
            {/* Pembungkus Kartu Animasi */}
            <div 
              className="relative w-full h-full transition-transform duration-500"
              style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              
              {/* Sisi Depan */}
              <div 
                className="absolute inset-0 bg-card border border-border rounded-3xl p-8 flex items-center justify-center text-center shadow-sm"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <h3 className="text-2xl font-medium text-foreground">{card.front}</h3>
              </div>
              
              {/* Sisi Belakang */}
              <div 
                className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-3xl p-8 flex items-center justify-center text-center shadow-sm"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <h3 className="text-xl font-medium text-primary leading-relaxed">{card.back}</h3>
              </div>
              
            </div>
          </div>

          {/* Kontrol Navigasi */}
          <div className="flex items-center gap-6">
            <button onClick={prevCard} className="p-4 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-md hover:opacity-90 transition-opacity">
              Flip Card
            </button>
            <button onClick={nextCard} className="p-4 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      )}
    </div>
  );
}