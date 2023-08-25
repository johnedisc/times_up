export const UserDataAPI = {
  url: "/src/data/UserData.json",
  fetchUser: async () => {
    try {
      const result = await fetch(UserDataAPI.url);
      return await result.json();
    } catch (error) {
      console.error(error);
    }
  },
}
