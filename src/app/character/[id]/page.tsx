'use client';
import { useEffect, useState } from 'react';
import Nav_Top from '@/app/Components/TopNavigationBar/Nav_Top';
import Image from 'next/image';
import { useGlobal } from '@/app/Context/Global_Context';
import axios from 'axios';
import "./Single_Character.css"
import Nav_Top_Loading from '@/app/Components/TopNavigationBar/Nav_Top_Loading';

interface Comic {
  id: number;
  title: string;
  year: number;
  thumbnail: {
    path: string;
    extension: string;
  } | null;
}

interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: Comic[];
}

export default function CharacterId({ params }: { params: { id: string } }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;
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

  useEffect(() => {
    async function fetchCharacterData() {
      try {
        const response = await axios.get(`/api/character/${id}`);
        console.log(response.data);
        if (response.status === 200) {
          setCharacter(response.data);
        } else {
          setError('Failed to fetch character');
        }
      } catch (error: any) {
        console.error('Error fetching character:', error);
        setError('Failed to fetch character');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchCharacterData();
    }
  }, [id]);

  const handleShowAll = () => {
    setFilterMode('all');
    setFilteredCharacters(characters);
  };

  const handleShowLiked = () => {
    setFilterMode('liked');
    setFilteredCharacters(characters.filter(character => likedCharacters.includes(character.id)));
  };

  const isLiked = likedCharacters.includes(character?.id || 0);
  const onLikeToggle = () => {
    if (character) {
      toggleLike(character.id);
    }
  };

  useEffect(() => {
    const slider = document.querySelector('.Comics_List') as HTMLElement;
    if (!slider) {
      return; // If the element does not exist, exit
    }

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = 'grabbing'; // Change cursor style on drag
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.style.cursor = 'grab'; // Reset cursor style
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.style.cursor = 'grab'; // Reset cursor style
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; // Adjust the scroll speed
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown as EventListener);
    slider.addEventListener('mouseleave', handleMouseLeave as EventListener);
    slider.addEventListener('mouseup', handleMouseUp as EventListener);
    slider.addEventListener('mousemove', handleMouseMove as EventListener);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown as EventListener);
      slider.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      slider.removeEventListener('mouseup', handleMouseUp as EventListener);
      slider.removeEventListener('mousemove', handleMouseMove as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <>
        <Nav_Top_Loading likedCount={likedCharacters.length} onShowAll={handleShowAll} onShowLiked={handleShowLiked} />
      </>
    );
  }

  return (
    <>
      <Nav_Top likedCount={likedCharacters.length} onShowAll={handleShowAll} onShowLiked={handleShowLiked} />
      {character && (
        <>
          <main className="Main_SingleCharacter">
            <Image
              height={1200}
              width={1200}
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
              className='SingleCharacter_Img'
            />
            <section className='Section_SingleCharacter'>
              <h1 className='SingleCharacter_Name'>{character.name}</h1>
              <button className="Button_Heart" onClick={(e) => {
                e.stopPropagation();
                onLikeToggle();
              }}>
                <Image
                  height={100}
                  width={100}
                  src={isLiked ? '/Header_Heart.svg' : '/Header_Heart_White.svg'}
                  alt="Heart Icon"
                  className={`Image_Heart ${isLiked ? 'animate' : ''}`}
                />
              </button>
            </section>
            <p className='SingleCharacter_Description'>{character.description}</p>
          </main>
          <section className='Section_Comics'>
            <h2 className='Comics_H2'>COMICS</h2>
            <div className='Comics_List'>
              {character.comics.slice(0, 20).map(comic => (
                <div key={comic.id} className='Comic_Card'>
                  <Image
                    height={200}
                    width={200}
                    src={`${comic?.thumbnail?.path}.${comic?.thumbnail?.extension}`}
                    alt={comic.title}
                    className='Comic_Image'
                  />
                  <p className='Comic_Title'>{comic.title}</p>
                  <p className='Comic_Year'>{comic.year}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
