import { API } from "./UserDataAPI.js";

export const Auth = {
  isLoggedIn: false,
  account: null,
  login: async (credentials: any = {}) => {
    const result = await API.login(credentials);
    if (result) return true;
    return false;
  }
}
