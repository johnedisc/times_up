import { _timesUpApp } from "../main.js";
import { LoadData } from "./LoadData.js";

export const UserDataAPI = {
  url: "/programs",
  grabPrograms: async () => {
    try {
      console.log(_timesUpApp.store.user);
      const response: Response = await fetch(UserDataAPI.url, {
        method: 'POST',
        body: JSON.stringify(_timesUpApp.store.user)
      });

      let apiResponse;
      let headers: any = {};
      for (let item of response.headers) {
        headers[item[0]] = item[1];
        console.log(item);
      }
      if (headers.ok) {
        apiResponse = await response.json();
        _timesUpApp.store.user.programs = apiResponse;
      } 
      console.log(_timesUpApp.store);
    } catch (error) {
      console.log(error);
    }
  },
  post: async (pathName: string, data: any) => {
    try {
      console.log(pathName, data);
      const response: Response = await fetch(pathName, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      let apiResponse;
      let headers: any = {};
      for (let item of response.headers) {
        headers[item[0]] = item[1];
      }
      if (headers.ok) {
        apiResponse = await response.json();
        _timesUpApp.store.user.programs = apiResponse;
      } 
      console.log(_timesUpApp.store);
    } catch (error) {
      console.log(error);
    }
  }
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
      if (response.ok) {
        apiResponse = await response.json();
        _timesUpApp.store.user = apiResponse;
        return response.ok;
      }
      
      apiResponse = await response.text();
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

