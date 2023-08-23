export class LogIn extends HTMLElement {
  constructor() {
    super();

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
  }

  connectedCallback() {
    this.logIn();
  }

}

