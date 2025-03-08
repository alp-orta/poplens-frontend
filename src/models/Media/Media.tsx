import { MediaType } from '../MediaType';

export interface Media {
    /** Our unique identifier */
    id: string;
    
    /** Title */
    title: string;
    
    /** Publish Date */
    publishDate: Date;
    
    /** Genre in the format Action, Adventure, Comedy, etc. */
    genre: string;
    
    /** External ID from the source API (check for duplicates with this) */
    cachedExternalId: string;
    
    /** Cached Image Path like /asd9121adssad (films) */
    cachedImagePath: string;
    
    /** Avg Rating from PopLens */
    avgRating: number;
    
    /** Total Reviews from PopLens */
    totalReviews: number;
    
    /** Description */
    description: string;
    
    /** Determines if it's a film, book, or game */
    type: MediaType;

    // Specific to media types
    /** Director for films */
    director?: string;
    
    /** Writer for books */
    writer?: string;
    
    /** Publisher for games */
    publisher?: string;

    // Audit Fields
    /** Created Date for the db record */
    createdDate: Date;
    
    /** Last Updated Date for the db record */
    lastUpdatedDate: Date;
}

export default Media;