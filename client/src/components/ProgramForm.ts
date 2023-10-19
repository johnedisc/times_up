import { _timesUpApp } from "../main.js";
import { clearSelf } from "../utilities/utilities.js";

export class ProgramForm extends HTMLElement {

  #newProgram: Record<string | symbol, string | string[]> = {
    name: "",
    groups: "",
    intervals: []
  }
//  #newListItem = {
//    name: "",
//    total: 0
//  }

  constructor() {
    super();

  }


  importGroupNames():string {
    console.log('import groups');
    console.log(_timesUpApp.store.user.groups.group_name);
    let html: string = '';
    for (let i = 0; i < _timesUpApp.store.user.groups.length; i++) {
      const name: string = _timesUpApp.store.user.groups[i].group_name;
      html += `<option value='${name}'>${name}</option>`;
    }
    return html;
  }

  formName():void {
    const groups: string = this.importGroupNames();
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
          <option value=''>/*select a group*/</option>
          ${groups}
        </select>

        <button type='submit'>send</button>
      </form>
    `;

    const programForm = document.querySelector('form');
    programForm?.classList.add('flex-down', 'start-screen');

    if (programForm) this.setFormBindings(programForm);
  }

  intervals():void {
//    clearSelf(this);
    const intervalElements = `
        <label for='name'>
          program name
        </label>
        <input name='name' type='text' required />

        <label for='length'>
          length in seconds
        </label>
        <input name='length' type='number' required />
        `;
    this.innerHTML = `
      <h1 class='h4'>${this.#newProgram.name}</h1>
      <form id='intervals'>
        <label for='name'>
          program name
        </label>
        <input name='name' type='text' required />

        <label for='length'>
          length in seconds
        </label>
        <input name='length' type='number' required />

        <button type='submit'>send</button>
      </form>
      <p id='add-interval'>add another interval</p>
    `;

    document.getElementById('add-interval')?.addEventListener('click', () => {
      document.querySelector('button')?.before(intervalElements);
    });
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
      this.intervals();

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
      console.log(el.name);
      el.addEventListener('change', () => {
        console.log(el, el.value);
        let tempVal = el.value;
        this.#newProgram[el.name] = tempVal;
      });
    };
  }
}

