import { makeRequest } from "../managers/apiClient";
import { CreateCommentRequest } from "../models/Review/CreateCommentRequest";
import { CreateReviewRequest } from "../models/Review/CreateReviewRequest";
import { MediaMainPageReviewInfo } from "../models/Review/MediaMainPageReviewInfo";
import { Comment } from "../models/Review/Comment";
import { Review } from "../models/Review/Review";
import { ReviewDetail } from "../models/Review/ReviewDetail";

const useReviewService = () => {
  const getReviewById = async (
    reviewId: string
  ): Promise<{ data: Review }> => {
    return makeRequest(
      "Review",
      `${reviewId}/GetReviewById`,
      "GET"
    );
  };
  
  const getReviewDetail = async (
    reviewId: string
  ): Promise<{ data: ReviewDetail }> => {
    return makeRequest(
      "Review",
      `${reviewId}/GetReviewDetail`,
      "GET"
    );
  };

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

  // Add new comment-related functions
  const addComment = async (
    profileId: string,
    reviewId: string,
    request: CreateCommentRequest
  ): Promise<{ data: Comment }> => {
    return makeRequest(
      "Review",
      `${profileId}/${reviewId}/Comment`,
      "POST",
      request
    );
  };

  const updateComment = async (
    commentId: string,
    newContent: string
  ): Promise<{ data: any }> => {
    return makeRequest(
      "Review",
      `${commentId}/EditComment`,
      "PUT",
      newContent
    );
  };

  const deleteComment = async (
    commentId: string
  ): Promise<{ data: any }> => {
    return makeRequest(
      "Review",
      `${commentId}/DeleteComment`,
      "DELETE"
    );
  };

  const getTopLevelComments = async (
    reviewId: string
  ): Promise<{ data: Comment[] }> => {
    return makeRequest(
      "Review",
      `${reviewId}/TopLevelComments`,
      "GET"
    );
  };

  const getReplies = async (
    parentCommentId: string
  ): Promise<{ data: Comment[] }> => {
    return makeRequest(
      "Review",
      `${parentCommentId}/Replies`,
      "GET"
    );
  };

  const getCommentCount = async (
    reviewId: string
  ): Promise<{ data: number }> => {
    return makeRequest(
      "Review",
      `${reviewId}/CommentCount`,
      "GET"
    );
  };

  const getReplyCount = async (
    parentCommentId: string
  ): Promise<{ data: number }> => {
    return makeRequest(
      "Review",
      `${parentCommentId}/ReplyCount`,
      "GET"
    );
  };


  return {
    getReviewById,
    getReviewDetail,
    addReview,
    deleteReview,
    getMediaMainPageReviewInfo,
    addLike,
    removeLike,
    getLikeCount,
    hasUserLiked,
    addComment,
    updateComment,
    deleteComment,
    getTopLevelComments,
    getReplies,
    getCommentCount,
    getReplyCount
  };
};

export default useReviewService;