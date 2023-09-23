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
  login: async (userInput: any = {}) => {
    try {
      console.log('hello?', userInput);
      const response = await fetch(API.url + '/login', {
        method: 'POST',
        body: JSON.stringify(userInput)
      });
      return response.text();
    } catch (error) {
      console.error('this is a fetch error\n', error);
      return error;
    }
  },
  register: async (userInput: any) => {
    try {
      const result = await fetch(API.url + '/register', userInput);
      console.log('result',result);
      return await result.json();
    } catch (error) {
      console.error('this is a fetch error\n', error);
    }
  }
}
