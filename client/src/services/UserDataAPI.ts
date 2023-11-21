import { _timesUpApp } from "../main.js";
import { LoadData } from "./LoadData.js";

export const UserDataAPI = {
  url: "/programs",
  grabPrograms: async () => {
    try {
      console.log('before: ',sessionStorage.getItem('accessToken'));
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
        sessionStorage.clear();
        sessionStorage.setItem("accessToken", apiResponse.accessToken);
        _timesUpApp.store.user = apiResponse;
      console.log('after: ',sessionStorage.getItem('accessToken'));
        return true;
      } 

    } catch (error) {
      console.log('this is UserDataAPI: ', error);
    }
  },
  post: async (pathName: string, data: any) => {
    console.log('data: ', data);
    const response: Response = await fetch(pathName, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    });

    let apiResponse;

    if (response.ok && pathName === '/programName') {
      apiResponse = await response.json();
      sessionStorage.clear();
      sessionStorage.setItem("accessToken", apiResponse.accessToken);
      _timesUpApp.store.user = apiResponse;
      //      _timesUpApp.store.user.programs.push(apiResponse);
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
        console.log(apiResponse);
        sessionStorage.setItem("accessToken", apiResponse);
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

