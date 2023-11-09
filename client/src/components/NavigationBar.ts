import { addLinkListener } from "../utilities/utilities.js";

export class NavigationBar extends HTMLElement {
  constructor() {
    super(); 
  }

  connectedCallback() {
    this.innerHTML = `
    <div id='nav-bar'>
      <div id='back-btn'>
        <a href='/'>
          <div id='back-btn-inner'></div>
        </a>
      </div>
      <div id='menu-btn'>
        <a href='/menu'>
          <div id='menu-btn-inner'></div>
        </a>
      </div>
    </div>
    `;
    addLinkListener(this);
  }
}

