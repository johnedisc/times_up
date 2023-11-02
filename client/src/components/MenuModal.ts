import { UserDataAPI } from "../services/UserDataAPI.js";
import { _timesUpApp } from "../main.js";
import { addLinkListener } from "../utilities/utilities.js";

export class MenuModal extends HTMLElement {
  constructor() {
    super();
  }

  renderMenu():HTMLElement {
    const h1: HTMLDivElement = document.createElement('h1');
//    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');
    const ul: HTMLUListElement = document.createElement('ul');
    const programList: HTMLLIElement = document.createElement('li');

    if (_timesUpApp.store.user.programs.length > 0) {
      h1.innerHTML = 'this is your list of programs.';
    } else {
      h1.innerHTML = 'no programs yet. create one below.';
    }

    programList.innerHTML = `<a href='/program-form'>create program</a>`;
    programList.style.backgroundColor = 'var(--link-font-color)';
    ul.appendChild(programList);

    if(_timesUpApp.store.user.programs) {
      for (let i=0; i < _timesUpApp.store.user.programs.length; i++) {
        const li: HTMLLIElement = document.createElement('li');
        const programName = _timesUpApp.store.user.programs[i].program_name;
        li.innerHTML = `<a href='/interval/${programName}'>
        ${programName}
        </a>`;
        ul.appendChild(li);
      }
    }

    addLinkListener(ul);
    ul.classList.add('flex-down');
    ul.style.paddingInlineStart = '0';
    div.appendChild(h1);
    div.appendChild(ul);
    div.classList.add('flex-down', 'menu');
    return div;
  }

  async connectedCallback() {
    if (_timesUpApp.store.user) {
      this.appendChild(this.renderMenu());
      await UserDataAPI.grabPrograms();
    } else {
      _timesUpApp.router.go('/');
    }
  }
}

