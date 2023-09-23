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
      const result = await fetch(API.url + '/login', {
        method: 'POST',
        body: JSON.stringify(userInput)
      });
      const parsedResult = await result.json();
      console.log('parsed result',result);
      return parsedResult;
    } catch (error) {
      console.error('this is a fetch error\n', error);
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
