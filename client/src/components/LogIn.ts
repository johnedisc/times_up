import { _timesUpApp } from "../main.js";
import { API } from "../services/UserDataAPI.js";
import { clearElementChildren } from "../utilities/utilities.js";

export class LogIn extends HTMLElement {
  #user: Record<string | symbol, string> = {
    email: '',
    password: ''
  }

  bad: boolean = false;

  constructor() {
    super();

  }

  connectedCallback() {
    this.logIn();
  }

  createAccount():void {
    document.getElementById('newAccount')?.removeEventListener('click', () => { this.createAccount() });
    this.innerHTML = '';
    this.innerHTML = `
      <form class='flex-down log-in'>
        <h5>create account</h5>
        <label for='register-name'>
          your name
        </label>
        <input id='register-name' name='register-name' required autocomplete='name' />
        <label for='register-email'>
          email
        </label>
        <input id='register-email' name='register-email' type='email' required autocomplete='username' />
        <label for='register-password'>
          password
        </label>
        <input id='register-password' name='register-password' type='password' required autocomplete='new-password' />
        <button type='submit'>go</button>
      </form>
      <p 
        style='margin: var(--gutter);'
        ><em><a id='sign-in'>
        have an account? go sign in.
        </a></em>
      </p>
    `;
    document.getElementById('sign-in')?.addEventListener('click', () => { this.logIn() });
  }


  logIn():void {
    document.getElementById('log-in')?.removeEventListener('click', () => { this.logIn() });
    this.innerHTML = '';
    this.innerHTML = `
      <div class='login-header'>
        <h1 class='h3'>timer app</h1>
        <p class='text-small'>this app is in development. the login does not create a real user. feel free to supply a fake email and password. this is just here to give us an idea of how the program will be laid out. thank you for checking it out.</p>
      </div>
      <form class='flex-down log-in'>
        <h5>sign in.</h5>
        <label for='email'>
          email
        </label>
        <input id='email' name='email' type='email' required autocomplete='username' />
        <label for='password'>
          password
        </label>
        <input id='password' name='password' type='password' required autocomplete='current-password' />
        <button type='submit'>go</button>
      </form>
      <p 
        style='margin: var(--gutter);'
        ><em><a id='newAccount'>
        create new account
        </a></em>
      </p>
    `;

    document.getElementById('newAccount')?.addEventListener('click', () => { this.createAccount() });

    try {
      const form: HTMLFormElement | null = this.querySelector('form');
      if (form) this.setFormBindings(form);

      // test out the 2-way binding
//      this.#user.email = 'fljsd@lkjsdfkjdf.com';
//      console.log(this.#user.email)
    } catch (error) {
      _timesUpApp.router.go('/error');
      console.error('didn\'t find the form.', error);
    }
  }

  badCredentialsModal():void {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box', 'flex-down');
    messageBox.innerHTML =  `
        <p style='color: red'>incorrect login</p>
        <button id='modal-button' type='button'>try again</button>
    `;
    _timesUpApp.store.container.appendChild(modal);
    _timesUpApp.store.container.appendChild(messageBox);
    document.getElementById('modal-button')?.addEventListener('click', () => {
      _timesUpApp.store.container.removeChild(messageBox);
      _timesUpApp.store.container.removeChild(modal);
    });
  }


  setFormBindings(form: HTMLFormElement): void {
    try {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const userInput = {
          'email': this.#user.email,
          'password': this.#user.password
        }

        const credentialsFromDB = API.login(userInput);
        credentialsFromDB
          .then((response) => {

            // todo, check login credentials
            if (this.bad) {
              this.badCredentialsModal();
              this.bad = false;
            } else {
              // todo, grab user data from DB

              _timesUpApp.router.go(`/start`);
            }
          })
          .catch((error) => {
            console.error('this is crendential error', error);
          })
      });

      this.#user = new Proxy(this.#user, {
        set(target, property, value, _) {
          try {
            
            if (typeof target[property] === typeof value) {
            target[property] = value;
            const formInputElement = form.elements.namedItem(property.toString());
            if (formInputElement) (formInputElement as HTMLInputElement).value = value;
//            console.log(target, target[property]);
            }
          } catch (error) {
            console.error(error);
          }
          return true;
        }
      });

      for (let i = 0; i < form.elements.length; i++) {
        const el = form.elements[i] as HTMLInputElement;
        el.addEventListener('change', () => {
          if (el) {
            this.#user[el.name] = el.value;
          }
        });
      };

    } catch (error) {
      _timesUpApp.router.go('/error');
      console.error(error);
    }
  }

}

