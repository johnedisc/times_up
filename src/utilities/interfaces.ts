export interface ITimerList {
  name: string,
  total: number
}

export interface IUser {
  name: string,
  timerList: ITimerList[]
}

export interface IStore {
  user: IUser | null,
  container: HTMLElement | null,
  currentProgram: ITimerList | null,
  currentIndex: number | null
}

export interface IApp {
  store: IStore | null,
  router: any
}
