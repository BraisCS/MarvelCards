"use client";
import { createContext, useContext, useState, useEffect } from 'react';

interface GlobalContextProps {
  likedCharacters: number[];
  toggleLike: (id: number) => void;
  characters: any[];
  setCharacters: (characters: any[]) => void;
  filterMode: string;
  setFilterMode: (mode: string) => void;
  filteredCharacters: any[];
  setFilteredCharacters: (characters: any[]) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedCharacters, setLikedCharacters] = useState<number[]>(() => {
    // Initialize from local storage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likedCharacters');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [characters, setCharacters] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState('all');
  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([]);

  useEffect(() => {
    // Save liked characters to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedCharacters', JSON.stringify(likedCharacters));
    }
  }, [likedCharacters]);

  const toggleLike = (id: number) => {
    setLikedCharacters(prev => {
      const newLikedCharacters = prev.includes(id) ? prev.filter(charId => charId !== id) : [...prev, id];
      
      // Update filteredCharacters if filterMode is 'liked'
      if (filterMode === 'liked') {
        setFilteredCharacters(characters.filter(character => newLikedCharacters.includes(character.id)));
      }

      return newLikedCharacters;
    });
  };

  useEffect(() => {
    if (filterMode === 'all') {
      setFilteredCharacters(characters);
    } else if (filterMode === 'liked') {
      setFilteredCharacters(characters.filter(character => likedCharacters.includes(character.id)));
    }
  }, [characters, likedCharacters, filterMode]);

  return (
    <GlobalContext.Provider value={{
      likedCharacters,
      toggleLike,
      characters,
      setCharacters,
      filterMode,
      setFilterMode,
      filteredCharacters,
      setFilteredCharacters
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
