export class LogIn extends HTMLElement {
  #user = {
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
        <input name='email' type='email' required />
        <label for='password'>
          password
        </label>
        <input name='password' type='password' required />
        <button type='submit'>go</button>
      </form>
    `;
    try {
      this.setFormBindings(this.querySelector('form'));

      // test out the 2-way binding
//      this.#user.email = 'fljsd@lkjsdfkjdf.com';
//      console.log(this.#user.email)
    } catch (error) {
      window._timesUpApp.router.go('/error');
      console.error('didn\'t find the form.', error);
    }
  }


  setFormBindings(form) {
    try {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // todo, grab user data from DB

        window._timesUpApp.router.go(`/start`);
      });

      this.#user = new Proxy(this.#user, {
        set(target, property, value, receiver) {
          try {
            console.log(target, receiver);
            if (typeof target[property] === typeof value) {
            target[property] = value;
            form.elements[property].value = value;
            console.log(property, target[property]);
            }
          } catch (error) {
            console.error(error);
          }
          return true;
        }
      });

      for (let i = 0; i < form.elements.length; i++) {
        const el = form.elements[i];
        el.addEventListener('change', (event) => {
          console.log(el.name, el.value);
          this.#user[el.name] = el.value;
        });
      };

    } catch (error) {
      window._timesUpApp.router.go('/error');
      console.error(error);
    }
  }

}

