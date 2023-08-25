export class HelpModal extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
      <div class="menu">
        <ul>
          <li>hi</li>
        </ul>
      </div>
    `;
    }
}
