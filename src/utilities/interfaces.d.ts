export interface ITimerList {
  name: string,
  total: number
}

export interface IUser {
  name: string,
  timerList: ITimerList[]
}

declare global {
  interface Window {
    _timesUpApp: any,
  }
}
