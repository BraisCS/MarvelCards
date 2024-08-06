"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './Search.css';

  interface Character {
    id: number;
    name: string;
    description: string;
    thumbnail: {
      path: string;
      extension: string;
    };
  }

  interface SearchProps {
    characters: Character[];
    setFilteredCharacters: (characters: Character[]) => void;
    filteredCharactersCount: number;
  }

const Search: React.FC<SearchProps> = ({ characters, setFilteredCharacters, filteredCharactersCount }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const results = characters.filter(character =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCharacters(results);
  }, [searchTerm, characters, setFilteredCharacters]);

  return (
    <div className="Search">
      <div className="Search_Container">
        <Image src="/Search_Icon.svg" alt="magnifying glass" width={24} height={24} className="Search_Icon" />
        <input
          type="text"
          placeholder="SEARCH A CHARACTER..."
          className="Search_Input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <p className="Search_Results">{`${filteredCharactersCount} RESULTS`}</p>
    </div>
  );
};

export default Search;
