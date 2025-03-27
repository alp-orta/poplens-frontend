import { makeRequest } from "../managers/apiClient";
import { CreateReviewRequest } from "../models/Review/CreateReviewRequest";
import { MediaMainPageReviewInfo } from "../models/Review/MediaMainPageReviewInfo";

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

  const getMediaMainPageReviewInfo = async (
    mediaId: string
  ): Promise<{ data: MediaMainPageReviewInfo }> => {
    return makeRequest(
      "Review",
      `GetMediaMainPageReviewInfo/${mediaId}`,
      "GET"
    );
  };

  return { addReview, deleteReview, getMediaMainPageReviewInfo };
};

export default useReviewService;