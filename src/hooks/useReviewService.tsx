import { makeRequest } from "../managers/apiClient";
import { CreateReviewRequest } from "../models/Review/CreateReviewRequest";

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

  const deleteReview = async (
    profileId: string,
    mediaId: string
  ): Promise<{ data: any }> => {
    return makeRequest(
      "Review",
      `${profileId}/DeleteReview/${mediaId}`,
      "DELETE"
    );
  };

  return { addReview, deleteReview };
};

export default useReviewService;