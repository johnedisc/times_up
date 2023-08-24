import { UserDataAPI } from "./UserDataAPI.ts"

export const LoadData = async () => {
  window._timesUpApp.store.user = await UserDataAPI.fetchUser();

}
