import { makeRequest } from "../managers/apiClient";
import { PageResult } from "../models/Common/PageResult";
import { ReviewProfileDetail } from "../models/Feed/ReviewProfileDetail";

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

  return { getFollowerFeed, getForYouFeed };
};

export default useFeedService;