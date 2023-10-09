import { _timesUpApp } from "../main.js";

export class IntervalProgramList extends HTMLElement {
  
  constructor() {
    super();
  }

  renderList():void {
    for (let i=0; i < _timesUpApp.store.user.timerList.length; i++) {
      const li: HTMLLIElement = document.createElement('li');
      li.innerHTML = _timesUpApp.store.user.timerList[i].name;
      li.addEventListener('click', event => {
        _timesUpApp.router.go(`/interval/${(event.target as HTMLLIElement).innerText}`)
      });
      this.appendChild(li);
    }
  }

  connectedCallback() {
    console.log('IntervalProgramList');
    this.renderList();
  }

}

