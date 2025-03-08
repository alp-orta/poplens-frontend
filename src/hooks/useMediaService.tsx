import { makeRequest } from "../managers/apiClient";
import { Media } from "../models/Media/Media";
import { MediaType } from "../models/MediaType";

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

  return { searchMedia };
};

export default useMediaService;