'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "./page.css";
import Nav_Top from "@/app/Components/TopNavigationBar/Nav_Top";
import Character_Card from "@/app/Components/CharacterCard/Character_Card";
import Search from '@/app/Components/Search/Search';
import Nav_Top_Loading from '@/app/Components/TopNavigationBar/Nav_Top_Loading';
import { useGlobal } from './Context/Global_Context';

export default function Home() {
  const {
    likedCharacters,
    toggleLike,
    characters,
    setCharacters,
    filterMode,
    setFilterMode,
    filteredCharacters,
    setFilteredCharacters,
  } = useGlobal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/marvel');
        if (res.status === 200) {
          setCharacters(res.data.characters);
          setFilteredCharacters(res.data.characters);
        } else {
          setError('Failed to fetch characters');
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        setError('Failed to fetch characters');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [setCharacters, setFilteredCharacters]);

  const handleShowAll = () => {
    setFilterMode('all');
    setFilteredCharacters(characters);
  };

  const handleShowLiked = () => {
    setFilterMode('liked');
    setFilteredCharacters(characters.filter(character => likedCharacters.includes(character.id)));
  };

  if (loading) {
    return (
      <>
        <Nav_Top_Loading likedCount={likedCharacters.length}/>
      </>
    );
  }

  return (
        <>
          <Nav_Top likedCount={likedCharacters.length} onShowAll={handleShowAll} onShowLiked={handleShowLiked} />
          <main className="Main_Home">
            <Search characters={characters} setFilteredCharacters={setFilteredCharacters} filteredCharactersCount={filteredCharacters.length} />
            <section className='Section_Home'>
              {filteredCharacters.map((character) => (
                <Character_Card key={character.id} character={character} isLiked={likedCharacters.includes(character.id)} onLikeToggle={() => toggleLike(character.id)} />
              ))}
            </section>
          </main>
        </>
  );
}
