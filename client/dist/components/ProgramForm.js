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
var _ProgramForm_newProgram;
export class ProgramForm extends HTMLElement {
    //  #newListItem = {
    //    name: "",
    //    total: 0
    //  }
    constructor() {
        super();
        _ProgramForm_newProgram.set(this, {
            name: ""
        }
        //  #newListItem = {
        //    name: "",
        //    total: 0
        //  }
        );
    }
    connectedCallback() {
        this.innerHTML = `
      <form>
        <label for='name'>
          program name
        </label>
        <input name='name' type='text' required />
        <button type='submit'>go</button>
      </form>
    `;
        const programForm = document.querySelector('form');
        programForm?.classList.add('flex-down', 'start-screen');
        if (programForm)
            this.setFormBindings(programForm);
    }
    setFormBindings(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            //      console.log(`${this.#newProgram.name} submitted`);
            __classPrivateFieldGet(this, _ProgramForm_newProgram, "f").name = '';
        });
        //set dbl data binding
        __classPrivateFieldSet(this, _ProgramForm_newProgram, new Proxy(__classPrivateFieldGet(this, _ProgramForm_newProgram, "f"), {
            set(target, property, value) {
                //          console.log('target', target, 'property', property, 'value', value);
                target[property] = value;
                const formInputElement = form.elements.namedItem(property.toString());
                if (formInputElement)
                    formInputElement.value = value;
                //          console.log(form.elements[property].value);
                return true;
            },
        }), "f");
        for (let i = 0; i < form.elements.length; i++) {
            let el = form.elements[i];
            //      console.log(el.name);
            el.addEventListener('change', () => {
                //        console.log(el, el.value);
                let tempVal = el.value;
                __classPrivateFieldGet(this, _ProgramForm_newProgram, "f")[el.name] = tempVal;
            });
        }
        ;
    }
}
_ProgramForm_newProgram = new WeakMap();
