import { _timesUpApp } from "../main.js";
export class MenuModal extends HTMLElement {
    constructor() {
        super();
    }
    renderMenu() {
        //    const h1: HTMLDivElement = document.createElement('h1');
        //    const h5: HTMLDivElement = document.createElement('h5');
        const div = document.createElement('div');
        const ul = document.createElement('ul');
        for (let i = 0; i < _timesUpApp.store.user.timerList.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = _timesUpApp.store.user.timerList[i].name;
            li.addEventListener('click', event => {
                _timesUpApp.router.go(`/interval/${event.target.innerText}`);
            });
            ul.appendChild(li);
        }
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
