export const UserDataAPI = {
  url: "localhost:5432",
  fetchUser: async () => {
    try {
      const result = await fetch(UserDataAPI.url);
      console.log('this is the fetch\n', result);
      return await result.json();
    } catch (error) {
      console.error(error);
    }
  },
}
