import { LoadData } from "./LoadData.js";

export const UserDataAPI = {
  url: "../../src/data/UserData.json",
  fetchUser: async () => {
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

      return response.ok;

    } catch (error) {
      console.log('this is a fetch error\n', error);
      return undefined;
    }
  },
  register: async (userInput: any) => {
    try {
      console.log('user data: ', userInput);
      const result = await fetch(API.url + '/register', userInput);
      console.log('result',result);
      return await result.json();
    } catch (error) {
      console.error('this is a fetch error\n', error);
    }
  }
}

