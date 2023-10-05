import { _timesUpApp } from "../main.js";
import { LoadData } from "./LoadData.js";

export const UserDataAPI = {
  url: "/",
  grabPrograms: async () => {
      const response: Response = await fetch(UserDataAPI.url, {
        method: 'POST',
        body: JSON.stringify(_timesUpApp.user)
      });
      console.log(response);

//    try {
//      const result = await fetch(UserDataAPI.url);
//      return await result.json();
//    } catch (error) {
//      console.error(error);
//    }
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

      if (response.ok) {
        apiResponse = await response.json();
        _timesUpApp.store.user = apiResponse;
        return response.ok;
      }
      
      apiResponse = await response.text();
      console.log(apiResponse);
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

