import { makeRequest } from "../managers/apiClient";
import { Media } from "../models/Media/Media";
import { User } from "../models/User";

export interface SearchResults {
  media: Media[];
  users: User[];
}

const useSearchService = () => {
  const searchMediaAndUsers = async (query: string): Promise<{data: SearchResults}> => {
    if (!query || query.trim().length < 2) {
      return { data: { media: [], users: [] } };
    }
    
    return makeRequest(
      "Search", 
      `SearchMediaAndUsers?query=${encodeURIComponent(query)}`,
      "GET"
    );
  };

  return { searchMediaAndUsers };
};

export default useSearchService;