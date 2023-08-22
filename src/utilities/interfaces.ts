export interface ITimerList {
  name: string,
  total: number
}

export interface IUser {
  name: string,
  timerList: ITimerList[]
}

export interface IUsageData {
}

export interface IStore {
  user: IUser | null,
  container: HTMLElement | null,
  currentProgram: ITimerList | null,
  currentIndex: number | null,
  usageData: any | null,
  backgroundColors: [] | null
}

export interface IApp {
  store: IStore | null,
  router: any
}
