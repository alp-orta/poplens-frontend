import { makeRequest } from "../managers/apiClient";
import { PageResult } from "../models/Common/PageResult";
import { ReviewDetail } from "../models/profile/ReviewDetail";

const useFeedService = () => {
  const getFollowerFeed = async (
    profileId: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<{ data: PageResult<ReviewDetail> }> => {
    return makeRequest(
      "Feed", 
      `GetFollowerFeed/${profileId}?page=${page}&pageSize=${pageSize}`, 
      "GET"
    );
  };

  return { getFollowerFeed };
};

export default useFeedService;