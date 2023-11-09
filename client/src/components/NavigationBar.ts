export class NavigationBar extends HTMLElement {
  constructor() {
    super(); 
  }

  connectedCallback() {
    this.innerHTML = `
    <div id='nav-bar'>
      <div id='back-btn'><a href=''>back</a></div>
      <div id='menu-btn'><a href='/menu'>menu</a></div>
    </div>
    `;
  }
}

