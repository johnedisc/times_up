
export interface ITimerList {
  id: number,
  sequence_number: number,
  interval_program_id: number,
  interval_name: string,
  time_seconds: number
}

export interface IUser {
  name: string,
  timerList: ITimerList[]
}

export interface IUsageData {
}

export interface IStore {
  user: any | null,
  container: HTMLElement | null,
  currentProgram: ITimerList | null,
  currentIndex: number | null,
  dataId: number | null,
  usageData: any | null,
  backgroundColors: string[] | null
}

export interface IApp {
  store: IStore | null,
  router: any,
}
