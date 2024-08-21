import React from 'react';
import Image from 'next/image';
import './Character_Card.css';

interface Character {
  id: number;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
}

interface CharacterCardProps {
  isLiked: boolean;
  onLikeToggle: () => void;
  character: Character;
}

const Character_Card: React.FC<CharacterCardProps> = ({ character, isLiked, onLikeToggle }) => {
  const handleCharacterClick = () => {
    window.location.href = `/character/${character.id}`;
  };

  return (
    <article className="Card" onClick={handleCharacterClick}>
      {character ? (
        <>
          <Image
            height={100}
            width={100}
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="Card_Image"
            priority
          />
          <div className="Line"></div>
          <div className="Content_Card">
            <p className="Card_Name">{character.name}</p>
            <button
              className="Button_Heart"
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle();
              }}
            >
              <Image
                height={100}
                width={100}
                src={isLiked ? '/Header_Heart.svg' : '/Header_Heart_White.svg'}
                alt="Heart Icon"
                className={`Image_Heart ${isLiked ? 'animate' : ''}`}
              />
            </button>
          </div>
        </>
      ) : (
        <p className="Card_Name">Character not available</p>
      )}
    </article>
  );
};

export default Character_Card;
