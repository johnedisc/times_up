export class LogIn extends HTMLElement {
  constructor() {
    super();

  }

  connectedCallback() {
    this.logIn();
  }

  logIn():void {
    this.innerHTML = `
      <form class='flex-down log-in'>
        <h5>sign in.</h5>
        <label for='email'>
          email
        </label>
        <input name='email' type='email' required />
        <label for='password'>
          password
        </label>
        <input name='password' type='password' required />
        <button type='submit'>go</button>
      </form>
    `;
    try {
      this.setFormBindings(this.querySelector('frm'));
    } catch (error) {
      window._timesUpApp.router.go('/error');
      console.error('didn\'t find the form');
    }
  }


  setFormBindings(form) {
    try {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        window._timesUpApp.router.go('/start');
      });
    } catch (error) {
      window._timesUpApp.router.go('/error');
      console.error(error);
    }
  }

}

