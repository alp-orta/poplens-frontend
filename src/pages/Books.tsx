import React from 'react';
import { MediaType } from '../models/MediaType';
import Medias from './Medias';

const BooksPage: React.FC = () => {
    const bookGenres = [
        "Fiction", "Biography & Autobiography", "Drama", "Juvenile Fiction", "Science",
        "Self-Help", "Comedy", "Business & Economics", "History", "Large type books",
        "Juvenile Nonfiction", "Biography", "Detective and mystery stories",
        "Literary Criticism", "Religion", "Horror", "Autobiography", "Medical", "Psychology"
    ];
    return <Medias mediaType={MediaType.BOOK} title="Books" genreOptions={bookGenres} />;
};

export default BooksPage;