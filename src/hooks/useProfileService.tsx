import { makeRequest } from "../managers/apiClient";
import { Profile } from "../models/profile/Profile";

const 
useAuthService = () => {
  const getProfile = async (profileId: string): Promise<{data: Profile}> => {
    return makeRequest("Profile", `GetProfile/${profileId}`, "GET");
  };

  const followUser = async (followerId: string, followingId: string): Promise<{data: any}> => {
    return makeRequest("Profile", `${followerId}/follow/${followingId}`, "POST");
  };

  const unfollowUser = async (followerId: string, followingId: string): Promise<{data: any}> => {
    return makeRequest("Profile", `${followerId}/unfollow/${followingId}`, "DELETE");
  };
  
  return { getProfile, followUser, unfollowUser };
};

export default useAuthService;
