import { LoadData } from "./LoadData.js";

export const UserDataAPI = {
  url: "../../src/data/UserData.json",
  fetchUser: async (userCredentials) => {
    try {
      const result = await fetch(UserDataAPI.url);
      return await result.json();
    } catch (error) {
      console.error(error);
    }
  },
}

export const API = {
  url: "/auth",
  login: async (userInput: any = {}): Promise<Boolean | undefined> => {
    try {
      const response: Response = await fetch(API.url + '/login', {
        method: 'POST',
        body: JSON.stringify(userInput)
      });

      let apiResponse;

      console.log(response.ok);
      response.ok ? apiResponse = await response.json()
        : apiResponse = await response.text() 
      console.log(apiResponse);

      // todo populate user data

      await UserDataAPI.fetchUser(apiResponse);

      return response.ok;

    } catch (error) {
      console.log('this is a fetch error\n', error);
      return undefined;
    }
  },
  register: async (userInput: any) => {
    try {
      const response = await fetch(API.url + '/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userInput)
      });
      
      const apiResponse = await response.text();

      return response.ok;

    } catch (error) {
//      console.error('this is a fetch error\n', error);
    }
  }
}

