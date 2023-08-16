export interface ITimerList {
  name: string,
  total: number
}

export interface IUser {
  name: string,
  timerList: ITimerList[]
}

export const Store = {
  user: null
}

