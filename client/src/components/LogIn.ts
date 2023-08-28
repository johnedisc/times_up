import { _timesUpApp } from "../main.js";

export class LogIn extends HTMLElement {
  #user: Record<string | symbol, string> = {
    email: '',
    password: ''
  }

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
        <input name='email' type='email' />
        <label for='password'>
          password
        </label>
        <input name='password' type='password' />
        <button type='submit'>go</button>
      </form>
    `;
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


  setFormBindings(form: HTMLFormElement): void {
    try {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // todo, grab user data from DB

        _timesUpApp.router.go(`/start`);
      });

      this.#user = new Proxy(this.#user, {
        set(target, property, value, _) {
          try {
            
            if (typeof target[property] === typeof value) {
            target[property] = value;
            const formInputElement = form.elements.namedItem(property.toString());
            if (formInputElement) (formInputElement as HTMLInputElement).value = value;
            console.log(target, target[property]);
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

