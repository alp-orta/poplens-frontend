import React from 'react';
import { MediaType } from '../models/MediaType';
import Medias from './Medias';

const GamesPage: React.FC = () => {
    const gameGenres = [
        "Indie", "Adventure", "Shooter", "Simulator", "Puzzle", "Sport", "Arcade", 
        "Role-playing (RPG)", "Platform", "Visual Novel", "Strategy", "Racing",
        "Fighting", "Music"
      ];
  return <Medias mediaType={MediaType.GAME} title="Games" genreOptions={gameGenres}/>;
};

export default GamesPage;