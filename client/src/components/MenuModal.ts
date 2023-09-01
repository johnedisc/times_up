import { _timesUpApp } from "../main.js";
import { addLinkListener } from "../utilities/utilities.js";

export class MenuModal extends HTMLElement {
  constructor() {
    super();
  }

  renderMenu():HTMLElement {
//    const h1: HTMLDivElement = document.createElement('h1');
//    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');
    const ul: HTMLUListElement = document.createElement('ul');
    const programList: HTMLLIElement = document.createElement('li');

    programList.innerText = 'new interval program';
    programList.addEventListener('click', () => _timesUpApp.router.go('/program-form'));
    ul.appendChild(programList);

    for (let i=0; i < _timesUpApp.store.user.timerList.length; i++) {
      const li: HTMLLIElement = document.createElement('li');
      const programName = _timesUpApp.store.user.timerList[i].name;
      li.innerHTML = `<a href='/interval/${programName}'>
      ${programName}
      </a>`;
      ul.appendChild(li);
    }

    addLinkListener(ul);
    ul.classList.add('flex-down');
    ul.style.paddingInlineStart = '0';
    div.appendChild(ul);
    div.classList.add('flex-down', 'menu');
    return div;
  }

  connectedCallback() {
    this.appendChild(this.renderMenu());
  }
}

