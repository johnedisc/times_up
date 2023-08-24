declare global {

  interface ITimerList {
    name: string,
    total: number
  }

  interface IUser {
    name: string,
    timerList: ITimerList[]
  }

  interface IUsageData {
  }

  interface IStore {
    user: IUser | null,
    container: HTMLElement | null,
    currentProgram: ITimerList | null,
    currentIndex: number | null,
    usageData: any | null,
    backgroundColors: [] | null
  }

  interface IApp {
    store: IStore | null,
    router: any,
  }

  interface Window {
    _timesUpApp: IApp;
  }

}

const _timesUpApp = window._timesUpApp;
