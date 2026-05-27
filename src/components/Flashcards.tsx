import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FolderOpen, ArrowLeft } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  folder: string;
  mastered: boolean;
}

export default function Flashcards() {
  // 1. Baca data dari Local Storage
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const savedCards = localStorage.getItem('study_flashcards');
    if (savedCards) return JSON.parse(savedCards);
    return []; // Ubah menjadi array kosong
  });

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 2. Simpan ke Local Storage saat ada perubahan
  useEffect(() => {
    localStorage.setItem('study_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const folders = Array.from(new Set(flashcards.map(f => f.folder)));

  if (!currentFolder) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Flashcard Folders</h2>
          <p className="text-muted-foreground">Select a folder to start studying</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.map(folder => {
            const cardCount = flashcards.filter(f => f.folder === folder).length;
            return (
              <div key={folder} onClick={() => setCurrentFolder(folder)} className="bg-card border border-border p-6 rounded-xl cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center aspect-square">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <FolderOpen className="w-8 h-8 text-primary" />
                </div>
                <span className="font-semibold">{folder}</span>
                <span className="text-xs text-muted-foreground mt-1">{cardCount} cards</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentCards = flashcards.filter(f => f.folder === currentFolder);
  const card = currentCards[currentIndex];

  const nextCard = () => { setIsFlipped(false); setCurrentIndex((prev) => (prev + 1) % currentCards.length); };
  const prevCard = () => { setIsFlipped(false); setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => { setCurrentFolder(null); setCurrentIndex(0); setIsFlipped(false); }} className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold">{currentFolder}</h2>
          <p className="text-sm text-muted-foreground">{currentIndex + 1} of {currentCards.length} cards</p>
        </div>
      </div>

      {currentCards.length > 0 ? (
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <div className="w-full h-80 perspective-[1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-2xl p-8 flex items-center justify-center text-center shadow-sm">
                <h3 className="text-2xl font-medium">{card.front}</h3>
              </div>
              <div className="absolute inset-0 backface-hidden bg-primary/5 border border-primary/20 rounded-2xl p-8 flex items-center justify-center text-center shadow-sm rotate-y-180">
                <h3 className="text-xl font-medium text-primary">{card.back}</h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={prevCard} className="p-3 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium shadow-md hover:opacity-90">Flip Card</button>
            <button onClick={nextCard} className="p-3 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">No cards in this folder.</p>
      )}
    </div>
  );
}