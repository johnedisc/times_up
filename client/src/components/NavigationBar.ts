import { addLinkListener } from "../utilities/utilities.js";

export class NavigationBar extends HTMLElement {
  constructor() {
    super(); 
  }

  connectedCallback() {
    this.innerHTML = `
    <div id='nav-bar'>
      <a href='/' id='back-btn'>
            <div id='back-btn-inner'></div>
      </a>
      <a href='/menu' id='menu-btn'>
            <div id='menu-btn-inner'></div>
      </a>
    </div>
    `;
    addLinkListener(this);
  }
}

