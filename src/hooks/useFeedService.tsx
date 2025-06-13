import { makeRequest } from "../managers/apiClient";
import { PageResult } from "../models/Common/PageResult";
import { ReviewProfileDetail } from "../models/Feed/ReviewProfileDetail";
import Media from "../models/Media/Media";

const useFeedService = () => {
  const getFollowerFeed = async (
    profileId: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<{ data: PageResult<ReviewProfileDetail> }> => {
    return makeRequest(
      "Feed", 
      `GetFollowerFeed/${profileId}?page=${page}&pageSize=${pageSize}`, 
      "GET"
    );
  };

  const getForYouFeed = async (
    profileId: string,
    pageSize: number = 10
  ): Promise<{ data: PageResult<ReviewProfileDetail> }> => {
    return makeRequest(
      "Feed",
      `GetForYouFeed/${profileId}?pageSize=${pageSize}`,
      "GET"
    );
  };

  const getMediaRecommendations = async (
    profileId: string,
    mediaType?: string,
    pageSize: number = 3
  ): Promise<{ data: Media[] }> => {
    return makeRequest(
      "Feed",
      `GetMediaRecommendations/${profileId}?pageSize=${pageSize}${mediaType ? `&mediaType=${mediaType}` : ''}`,
      "GET"
    );
  };

  return { getFollowerFeed, getForYouFeed, getMediaRecommendations };
};

export default useFeedService;