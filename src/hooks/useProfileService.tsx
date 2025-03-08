import { makeRequest } from "../managers/apiClient";
import { LoginInfo } from "../models/auth/LoginInfo";
import { RegisterInfo } from "../models/auth/RegisterInfo";
import { Profile } from "../models/profile/Profile";

const useAuthService = () => {
  const getProfile = async (profileId: string): Promise<{data: Profile}> => {
    return makeRequest("Profile", profileId, "GET");
  };
  return { getProfile };
};

export default useAuthService;
