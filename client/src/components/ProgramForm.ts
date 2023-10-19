import { _timesUpApp } from "../main.js";
import { clearSelf } from "../utilities/utilities.js";

export class ProgramForm extends HTMLElement {

  #newProgram: Record<string | symbol, string | any[]> = {
    name: "",
    groups: "",
    intervals: []
  }
  #newListItem: Record<string | symbol, string | number> = {
    name: "",
    total: 0
  }

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

  addIntervalElements():void {
    const label1 = document.createElement('label');
    const label2 = document.createElement('label');
    const input1 = document.createElement('input');
    const input2 = document.createElement('input');
    label1.setAttribute('for','name');
    label1.innerHTML = 'intervalName';
    label2.setAttribute('for','total');
    label2.innerHTML = 'length in seconds';
    input1.setAttribute('name','name');
    input1.setAttribute('type','text');
    input1.required;
    input2.setAttribute('name','total');
    input2.setAttribute('type','number');
    input2.required;

    const button = document.querySelector('button');
    button?.before(label1);
    button?.before(input1);
    button?.before(label2);
    button?.before(input2);
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
    this.innerHTML = `
      <h1 class='h4'>${this.#newProgram.name}</h1>
      <form id='intervals'>
        <label for='name'>
          interval name
        </label>
        <input name='name' type='text' required />

        <label for='total'>
          length in seconds
        </label>
        <input name='total' type='number' required />

        <button type='submit'>send</button>
      </form>
      <p id='add-interval'>add another interval</p>
    `;

    const programForm = document.querySelector('form');
    programForm?.classList.add('flex-down', 'start-screen');

    document.getElementById('add-interval')?.addEventListener('click', () => {
      if (programForm) this.setIntervalBindings(programForm);
      this.addIntervalElements();
    });

    programForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log(event);
//      this.#newProgram.intervals.push();

    });


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

  setIntervalBindings(form: HTMLFormElement) {


//    //set dbl data binding
//    this.#newListItem = new Proxy(this.#newListItem, {
//      set(target, property, value) {
////          console.log('target', target, 'property', property, 'value', value);
//          target[property] = value;
//          const formInputElement = form.elements.namedItem(property.toString());
//          if (formInputElement) (formInputElement as HTMLInputElement).value = value;
////          console.log(form.elements[property].value);
//          return true;
//      },
//    })
    for (let i = 0; i < form.elements.length; i++) {
      let el = form.elements[i] as HTMLInputElement;
      console.log('for loop element' + i, el, el.value);
      el.addEventListener('change', () => {
        console.log('here is ' + el + ':\n', el.value);
        let tempVal = el.value;
        this.#newListItem[el.name] = tempVal;
      });
    };
  }
}

