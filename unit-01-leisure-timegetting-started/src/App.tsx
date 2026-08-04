import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranscriptBox } from './components/TranscriptBox';
import { CharacterSelection } from './components/CharacterSelection';
import { RoleplayControls } from './components/RoleplayControls';
import { DialogueLine } from './types';

// Fallback transcript data in case fetch fails
const fallbackDialogue: DialogueLine[] = [
  { speaker: 'Tom', text: 'Hi, Trang. Surprised to see you. What brings you here?' },
  { speaker: 'Trang', text: "Oh, hello Tom. I'm looking for a knitting kit." },
  { speaker: 'Tom', text: "A knitting kit? I didn't know you like knitting." },
  { speaker: 'Trang', text: "Actually, I'm keen on many DIY activities. In my leisure time, I love knitting, building dollhouses, and making paper flowers." },
  { speaker: 'Tom', text: 'I see. So, you like spending time on your own.' },
  { speaker: 'Trang', text: 'Yeah. What do you do in your free time?' },
  { speaker: 'Tom', text: "I'm a bit different. I usually hang out with my friends. We go to the cinema, go cycling, or play sport in the park." },
  { speaker: 'Trang', text: "You love spending free time with other people, don't you?" },
  { speaker: 'Tom', text: "That's right. By the way, would you like to go to the cinema with me and Mark this Sunday? There's a new comedy at New World Cinema." },
  { speaker: 'Trang', text: "Yes, I'd love to. Can I ask Mai to join us?" },
  { speaker: 'Tom', text: "Sure. Let's meet outside the cinema at 9 a.m." },
];

export default function App() {
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'Trang' | 'Tom' | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(0);

  // Fetch transcript.json on mount
  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/transcript.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDialogue(data);
        } else {
          setDialogue(fallbackDialogue);
        }
      } catch (err) {
        console.warn('Fetching /transcript.json failed, loading fallback data.', err);
        setDialogue(fallbackDialogue);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscript();
  }, []);

  const handleReset = () => {
    setSelectedRole(null);
    setActiveLineIndex(0);
    window.speechSynthesis?.cancel();
  };

  const handleNextLine = () => {
    if (activeLineIndex === null) {
      setActiveLineIndex(0);
    } else if (activeLineIndex < dialogue.length - 1) {
      setActiveLineIndex(activeLineIndex + 1);
    }
  };

  const handlePrevLine = () => {
    if (activeLineIndex !== null && activeLineIndex > 0) {
      setActiveLineIndex(activeLineIndex - 1);
    }
  };

  const trangLineCount = dialogue.filter((d) => d.speaker === 'Trang').length;
  const tomLineCount = dialogue.filter((d) => d.speaker === 'Tom').length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#334155] flex flex-col font-serif">
      {/* Top Header */}
      <Header
        onReset={handleReset}
        selectedRole={selectedRole}
        onClearRole={() => setSelectedRole(null)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {/* Horizontal Split Screen (50/50 ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT HALF: TRANSCRIPT BOX */}
          <TranscriptBox
            dialogue={dialogue}
            selectedRole={selectedRole}
            activeLineIndex={activeLineIndex}
            onSelectLine={(idx) => setActiveLineIndex(idx)}
            onSelectRole={(role) => setSelectedRole(role)}
            isLoading={isLoading}
            error={error}
          />

          {/* RIGHT HALF: CHARACTER SELECTION (TRANG & TOM SIDE-BY-SIDE) */}
          <CharacterSelection
            selectedRole={selectedRole}
            onSelectRole={(role) => setSelectedRole(role)}
            trangLineCount={trangLineCount}
            tomLineCount={tomLineCount}
          />
        </div>

        {/* BOTTOM ROLEPLAY INTERACTIVE CONTROLS */}
        <RoleplayControls
          selectedRole={selectedRole}
          activeLineIndex={activeLineIndex}
          totalLines={dialogue.length}
          onNextLine={handleNextLine}
          onPrevLine={handlePrevLine}
          onSelectRole={(role) => setSelectedRole(role)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 px-6 text-center text-xs font-bold text-[#64748B] mt-8 uppercase tracking-widest">
        <p>
          UNIT 1: LEISURE TIME — TIẾNG ANH LỚP 8 | LUYỆN HỘI THOẠI ĐÓNG VAI
        </p>
      </footer>
    </div>
  );
}
