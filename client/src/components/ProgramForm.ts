import { _timesUpApp } from "../main.js";
import { UserDataAPI } from "../services/UserDataAPI.js";
import { clearSelf } from "../utilities/utilities.js";

export class ProgramForm extends HTMLElement {

  #newProgram: Record<string | symbol, string | any[]> = {
    name: "",
    groups: ""
  }

  constructor() {
    super();

  }

  connectedCallback() {
    this.formName();
  }


  importGroupNames():string {
    let html: string = '';
    for (let i = 0; i < _timesUpApp.store.user.groups.length; i++) {
      const name: string = _timesUpApp.store.user.groups[i].group_name;
      const id: string = _timesUpApp.store.user.groups[i].group_id;
      html += `<option value='${id}'>${name}</option>`;
    }
    return html;
  }

  addIntervalElements(programId: number):void {
    _timesUpApp.store.dataId++;
    const intervalForm = document.createElement('interval-form');
    intervalForm.dataset.id = _timesUpApp.store.dataId;
    if (programId) {
      intervalForm.dataset.interval_program_id = programId.toString();
    }
//    intervalForm.dataset.interval_program_id = _timesUpApp.store.dataId;
    document.querySelector('button')?.before(intervalForm);
  }

  formName():void {
    let header: string;
    if (_timesUpApp.store.user.programs.length > 0) {
      header = `<h5>name your new program.</h5>`;
    } else {
      header = `
        <h5>name your program</h5>
        <p class='body-text'>a program contains a set of tasks. for example: <span style='color: var(--bg-main)'>"clean the kitchen"</span> is a program that with tasks like: <span style='color: var(--bg-main)'>"wash dishes", "sweep floor", "organize fridge"</span>. if the program is for personal use, select your name under group name. if the program is to be shared with others, select the name of the group it is for</p>
      `;
    }
    const groups: string = this.importGroupNames();
    this.innerHTML = `
      ${header}
      <form id='program-name'>
        <label for='name'>
          program name
        </label>
        <input name='name' id='name' type='text' required />

        <label for='groups'>
          group name
        </label>
        <select name='groups' id='groups'>
          <option value=''>select a group</option>
          ${groups}
        </select>

        <button type='submit'>send</button>
      </form>
    `;

    const programForm = document.querySelector('form');
    programForm?.classList.add('flex-down', 'start-screen');
    this.classList.add('flex-down', 'start-screen');

    if (programForm) this.setFormBindings(programForm);
  }

  intervals(programId: number):void {
//    clearSelf(this);
    this.innerHTML = `
      <h1 class='h4'>${this.#newProgram.name}</h1>
      <form id='intervals' class='flex-down start-screen'>

        <button type='submit'>send</button>
      </form>
      <p id='add-interval'>add another interval</p>
    `;

    this.addIntervalElements(programId);
    document.getElementById('add-interval')?.addEventListener('click', () => {
//      if (programForm) this.setIntervalBindings(programForm);
      this.addIntervalElements(programId);
    });

  }

  setFormBindings(form: HTMLFormElement) {

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (this.#newProgram.name && this.#newProgram.groups && typeof this.#newProgram.groups === 'string') {
        const programName = {
          'program_name': this.#newProgram.name,
          'group_id': parseInt(this.#newProgram.groups),
          'user_id': _timesUpApp.store.user.id,
          'token': _timesUpApp.store.user.token
        }

        const programObject = await UserDataAPI.post('/programName', programName);

//        console.log('submit event listener ', programObject);
        if (document.getElementById('program-name')) {

          this.intervals(programObject.id);
        }

      }

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
      el.addEventListener('change', () => {
        let tempVal = el.value;
        this.#newProgram[el.name] = tempVal;
      });
    };
  }
}

