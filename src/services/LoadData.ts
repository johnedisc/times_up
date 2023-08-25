import { _timesUpApp } from "../main.ts";
import { UserDataAPI } from "./UserDataAPI.ts"

export const LoadData = async () => {
  _timesUpApp.store.user = await UserDataAPI.fetchUser();

}
