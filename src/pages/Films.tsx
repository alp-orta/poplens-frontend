import React from 'react';
import { MediaType } from '../models/MediaType';
import Medias from './Medias';

const FilmsPage: React.FC = () => {
    const filmGenres = [
        "Drama", "Comedy", "Romance", "Horror", "Western", "Documentary",
        "Thriller", "Crime", "Action", "Animation", "Family", "Music",
        "Science Fiction", "War", "TV Movie", "Adventure", "Mystery"
    ];
    return <Medias mediaType={MediaType.FILM} title="Films" genreOptions={filmGenres} />;
};

export default FilmsPage;