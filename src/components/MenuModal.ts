export class MenuModal extends HTMLElement {
  constructor() {
    super();
  }

  renderMenu():HTMLElement {
    const h1: HTMLDivElement = document.createElement('h1');
    const h5: HTMLDivElement = document.createElement('h5');
    const div: HTMLDivElement = document.createElement('div');
    const ul: HTMLUListElement = document.createElement('ul');

    for (let i=0; i < _timesUpApp.store.user.timerList.length; i++) {
      const li: HTMLLIElement = document.createElement('li');
      li.innerHTML = _timesUpApp.store.user.timerList[i].name;
      li.addEventListener('click', event => {
        _timesUpApp.router.go('/interval')
      });
      ul.appendChild(li);

    }

    div.appendChild(ul);
    div.classList.add('flex-down', 'menu');
    return div;
  }

  connectedCallback() {
    this.appendChild(this.renderMenu());
  }
}

customElements.define('menu-modal', MenuModal);
