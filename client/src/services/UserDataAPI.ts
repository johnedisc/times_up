import { _timesUpApp } from "../main.js";
import { LoadData } from "./LoadData.js";

export const UserDataAPI = {
  url: "/programs",
  grabPrograms: async () => {
    try {
      const response: Response = await fetch(UserDataAPI.url, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        //if no bearer
        console.log('didnt work', response.status);
        _timesUpApp.router.go('/login');
        return false;
      } else if (response.ok) {

        let apiResponse = await response.json();
        console.log('grabPrograms: ',apiResponse);
        sessionStorage.setItem("accessToken", apiResponse.session_id);
        _timesUpApp.store.user = apiResponse;
        return true;
      } 

    } catch (error) {
      console.log('this is UserDataAPI: ', error);
    }
  },
  post: async (pathName: string, data: any) => {
    const response: Response = await fetch(pathName, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    let apiResponse;
    let headers: any = {};
    for (let item of response.headers) {
      headers[item[0]] = item[1];
    }
    if (headers.ok && pathName === '/programName') {
      apiResponse = await response.json();
      _timesUpApp.store.user.programs.push(apiResponse);
      return apiResponse;
    } else {
      return undefined;
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
//        _timesUpApp.auth.isLoggedIn = true;
//        _timesUpApp.auth.account = apiResponse;
        sessionStorage.removeItem('accessToken');
        sessionStorage.setItem("accessToken", apiResponse);
//        console.log(_timesUpApp);
//        _timesUpApp.store.user = apiResponse;
//        _timesUpApp.store.user.programs = [];
        return response.ok;
      } else {
        apiResponse = await response.text();
//        return response.ok;
      }
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

