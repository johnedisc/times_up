export class ErrorPage extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var _a;
        this.innerHTML = `
      <div class='flex-down start-screen'>
        <h3>i have erred</h1>
        <h5 id='back'>back</h4>
      </div>
    `;
        (_a = document.getElementById('back')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            //      .timesUpApp.router.go('/start');
            history.back();
        });
    }
}
