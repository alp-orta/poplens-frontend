import { makeRequest } from "../managers/apiClient";
import { CreateReviewRequest } from "../models/Review/CreateReviewRequest";

interface CreateReviewResponse {
  mediaId: string;
  content: string;
  rating: number;
}

const useReviewService = () => {
  const addReview = async (
    profileId: string, 
    request: CreateReviewRequest
  ): Promise<{ data: any }> => {
    return makeRequest(
      "Review", 
      `${profileId}/addReview`, 
      "POST", 
      request
    );
  };

  return { addReview };
};

export default useReviewService;