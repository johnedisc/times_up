import { UserDataAPI } from "../services/UserDataAPI.js";
import { _timesUpApp } from "../main.js";
import { addLinkListener } from "../utilities/utilities.js";
import { Auth } from "../services/Auth.js";

export class Menu extends HTMLElement {
  constructor() {
    super(); 
  }

  renderMenu():HTMLElement {
    const h1: HTMLDivElement = document.createElement('h1');
//    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');
    const ul: HTMLUListElement = document.createElement('ul');
    const createProgram: HTMLLIElement = document.createElement('li');
    const editProgram: HTMLLIElement = document.createElement('li');

    if (_timesUpApp.store.user.programs.length > 0) {
      h1.innerHTML = 'this is your list of programs.';
//      editProgram.innerHTML = `<a href='/'>edit program</a>`;
//      editProgram.style.backgroundColor = 'var(--link-font-color)';
//      ul.appendChild(editProgram);
    } else {
      h1.innerHTML = 'no programs yet. create one below.';
    }

    createProgram.innerHTML = `<a href='/program-form'>create program</a>`;
    createProgram.style.backgroundColor = 'var(--link-font-color)';
    ul.appendChild(createProgram);

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
      const userPrograms = await UserDataAPI.grabPrograms();
      if (userPrograms) {
        document.body.style.backgroundColor = 'var(--bg-start-screen)';
        this.appendChild(this.renderMenu());
      }
//    if (_timesUpApp.auth.isLoggedIn) {
//      document.body.style.backgroundColor = 'var(--bg-start-screen)';
//      await UserDataAPI.grabPrograms();
//      this.appendChild(this.renderMenu());
//    } else {
//      document.body.style.backgroundColor = 'var(--bg-start-screen)';
//      await UserDataAPI.grabPrograms();
//      this.appendChild(this.renderMenu());
//      _timesUpApp.auth.login();
//      _timesUpApp.router.go('/login');
//    }
//    if (_timesUpApp.store.user) {
//      document.body.style.backgroundColor = 'var(--bg-start-screen)';
//      await UserDataAPI.grabPrograms();
//      this.appendChild(this.renderMenu());
//    } else {
//      _timesUpApp.router.go('/login');
//    }
  }
}

