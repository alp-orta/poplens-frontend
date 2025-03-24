import { makeRequest } from "../managers/apiClient";
import { PageResult } from "../models/Common/PageResult";
import { Media } from "../models/Media/Media";
import { MediaType } from "../models/MediaType";

interface FilterOptions {
  yearFilter?: string;
  genreFilter?: string;
  sortBy?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

const useMediaService = () => {
  const getMediaTypeString = (type: MediaType): string => {
    switch (type) {
      case MediaType.FILM:
        return "film";
      case MediaType.BOOK:
        return "book";
      case MediaType.GAME:
        return "game";
      default:
        return "media";
    }
  };

  const searchMedia = async (mediaType: MediaType, query: string): Promise<{ data: Media[] }> => {
    const mediaTypeString = getMediaTypeString(mediaType);
    const queryParams = `?mediaType=${mediaTypeString}&query=${encodeURIComponent(query)}`;
    
    return makeRequest("Media", `SearchMedia${queryParams}`, "GET");
  };

  const getMediaWithFilters = async (
    mediaType: MediaType, 
    options: FilterOptions
  ): Promise<{ data: PageResult<Media> }> => {
    const mediaTypeString = getMediaTypeString(mediaType);
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('mediaType', mediaTypeString);
    
    if (options.searchQuery) {
      params.append('query', options.searchQuery);
    }
    
    if (options.yearFilter) {
      // Extract decade from format like "1980s"
      const decade = options.yearFilter.substring(0, 4);
      params.append('decade', decade);
    }
    
    if (options.genreFilter) {
      params.append('genre', options.genreFilter);
    }
    
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    
    // Pagination
    params.append('page', String(options.page || 1));
    params.append('pageSize', String(options.pageSize || 30));
    
    return makeRequest("Media", `GetMediaWithFilters?${params.toString()}`, "GET");
  };

  return { searchMedia, getMediaWithFilters };
};

export default useMediaService;