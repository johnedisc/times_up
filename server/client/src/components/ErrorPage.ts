export class ErrorPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class='flex-down start-screen'>
        <h3>i have erred</h1>
        <h5 id='back'>back</h4>
      </div>
    `;
    document.getElementById('back')?.addEventListener('click', () => {

//      .timesUpApp.router.go('/start');
      history.back();
    });
  }
}

