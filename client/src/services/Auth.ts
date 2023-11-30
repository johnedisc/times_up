import { API } from "./UserDataAPI.js";

export const Auth = {
  isLoggedIn: false,
  account: null,
  login: async (credentials: any = {}) => {
    const result = await API.auth(credentials);
    if (result) return true;
    return false;
  }
}
