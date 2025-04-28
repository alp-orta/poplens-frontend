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

  // Add new like-related functions
  const addLike = async (profileId: string, reviewId: string): Promise<{ data: any }> => {
    return makeRequest("Review", `${profileId}/${reviewId}/Like`, "POST");
  };

  const removeLike = async (profileId: string, reviewId: string): Promise<{ data: any }> => {
    return makeRequest("Review", `${profileId}/${reviewId}/Unlike`, "DELETE");
  };

  const getLikeCount = async (reviewId: string): Promise<{ data: number }> => {
    return makeRequest("Review", `${reviewId}/LikeCount`, "GET");
  };

  const hasUserLiked = async (profileId: string, reviewId: string): Promise<{ data: boolean }> => {
    return makeRequest("Review", `${profileId}/${reviewId}/HasLiked`, "GET");
  };

  return {
    addReview,
    deleteReview,
    getMediaMainPageReviewInfo,
    addLike,
    removeLike,
    getLikeCount,
    hasUserLiked
  };
};

export default useReviewService;