import { makeRequest } from "../managers/apiClient";
import { LoginInfo } from "../models/auth/LoginInfo";
import { RegisterInfo } from "../models/auth/RegisterInfo";

const useAuthService = () => {
  const login = async (user: LoginInfo): Promise<any> => {
    return makeRequest("UserAuthentication", "Login", "POST", user);
  };

  const register = async (user: RegisterInfo): Promise<any> => {
    return makeRequest("UserAuthentication", "Register", "POST", user);
  };

  const getToken = () => {
    return JSON.parse(sessionStorage.getItem("jwt") || "{}").token;
  };

  return { login, register, getToken };
};

export default useAuthService;
