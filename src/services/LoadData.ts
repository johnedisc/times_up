import { UserDataAPI } from "./UserDataAPI.ts"

export const LoadData = async () => {
  _timesUpApp.store.user = await UserDataAPI.fetchUser();
  console.log(_timesUpApp);

}
