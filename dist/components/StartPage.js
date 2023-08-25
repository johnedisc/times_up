import { _timesUpApp } from "../main.js";
export class StartPage extends HTMLElement {
    constructor() {
        super();
        this.h1 = document.createElement('h1');
        this.div = document.createElement('div');
        this.h5 = document.createElement('h5');
        this.div.appendChild(this.h1);
        this.div.appendChild(this.h5);
    }
    startScreen(user) {
        this.h1.innerHTML = `hi, ${user}`;
        this.h5.innerHTML = 'select your interval sequence';
        this.div.classList.add('flex-down', 'start-screen');
        this.h1.classList.add('h2');
        this.h5.addEventListener('click', () => {
            _timesUpApp.router.go('/menu');
        });
    }
    connectedCallback() {
        this.appendChild(this.div);
        this.startScreen(_timesUpApp.store.user.name);
    }
}
