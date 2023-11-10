
export class AddRemoveButton extends HTMLElement {
  constructor() {
    super(); 
  }

  connectedCallback() {
    this.innerHTML = `
    <div class='add-remove-button'>
      <a href='/' id='remove-button'>
        <p style='color: var(--warning-text)'>remove</p>
      </a>
      <a href='/menu' id='add-button'>
        <p style='color: var(--bg-main)'>add</p>
      </a>
    </div>
    `;
    console.log(this.style);
  }
}

