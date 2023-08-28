var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _LogIn_user;
import { _timesUpApp } from "../main.js";
export class LogIn extends HTMLElement {
    constructor() {
        super();
        _LogIn_user.set(this, {
            email: '',
            password: ''
        });
    }
    connectedCallback() {
        this.logIn();
    }
    logIn() {
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
            const form = this.querySelector('form');
            if (form)
                this.setFormBindings(form);
            // test out the 2-way binding
            //      this.#user.email = 'fljsd@lkjsdfkjdf.com';
            //      console.log(this.#user.email)
        }
        catch (error) {
            _timesUpApp.router.go('/error');
            console.error('didn\'t find the form.', error);
        }
    }
    setFormBindings(form) {
        try {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                // todo, grab user data from DB
                _timesUpApp.router.go(`/start`);
            });
            __classPrivateFieldSet(this, _LogIn_user, new Proxy(__classPrivateFieldGet(this, _LogIn_user, "f"), {
                set(target, property, value, _) {
                    try {
                        if (typeof target[property] === typeof value) {
                            target[property] = value;
                            const formInputElement = form.elements.namedItem(property.toString());
                            if (formInputElement)
                                formInputElement.value = value;
                            console.log(target, target[property]);
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
                    return true;
                }
            }), "f");
            for (let i = 0; i < form.elements.length; i++) {
                const el = form.elements[i];
                el.addEventListener('change', () => {
                    if (el) {
                        __classPrivateFieldGet(this, _LogIn_user, "f")[el.name] = el.value;
                    }
                });
            }
            ;
        }
        catch (error) {
            _timesUpApp.router.go('/error');
            console.error(error);
        }
    }
}
_LogIn_user = new WeakMap();
