import { _timesUpApp } from "../main.js";

export class ProgramForm extends HTMLElement {

  #newProgram: Record<string | symbol, string> = {
    name: ""
  }
//  #newListItem = {
//    name: "",
//    total: 0
//  }

  constructor() {
    super();

  }


  importGroupNames():void {
    console.log('import groups');
    console.log(_timesUpApp.store);
  }

  formName():void {
    const groups = this.importGroupNames();
    this.innerHTML = `
      <form>
        <label for='name'>
          program name
        </label>
        <input name='name' type='text' required />

        <label for='group-select'>
          group name
        </label>
        <select name='groups' id='group-select'>
        </select>

        <button type='submit'>go</button>
      </form>
    `;

    const programForm = document.querySelector('form');
    programForm?.classList.add('flex-down', 'start-screen');

    if (programForm) this.setFormBindings(programForm);
  }

  connectedCallback() {
    this.formName();
  }

  setFormBindings(form: HTMLFormElement) {

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log(`${this.#newProgram.name} submitted`);
//      this.#newProgram.name = '';

    });

    //set dbl data binding
    this.#newProgram = new Proxy(this.#newProgram, {
      set(target, property, value) {
//          console.log('target', target, 'property', property, 'value', value);
          target[property] = value;
          const formInputElement = form.elements.namedItem(property.toString());
          if (formInputElement) (formInputElement as HTMLInputElement).value = value;
//          console.log(form.elements[property].value);
          return true;
      },
    })
    for (let i = 0; i < form.elements.length; i++) {
      let el = form.elements[i] as HTMLInputElement;
//      console.log(el.name);
      el.addEventListener('change', () => {
//        console.log(el, el.value);
        let tempVal = el.value;
        this.#newProgram[el.name] = tempVal;
      });
    };
  }
}

