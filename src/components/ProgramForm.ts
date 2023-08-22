export class ProgramForm extends HTMLElement {

  #newProgram = {
    name: ""
  }
  #newListItem = {
    name: "",
    total: 0
  }

  constructor() {
    super();

  }

  connectedCallback() {
    this.innerHTML = `
      <form>
        <label name='intervalProgramName'>
          name your interval program
        </label>
        <input name='inputHere' id='thisOlInput' type='text' />
        <button type='button'>go</button>
      </form>
    `;
    this.querySelector('form').classList.add('flex-down', 'start-screen');
  }

  setFormBindings(form) {
    //set dbl data binding
    this.#newProgram = new Proxy(this.#newProgram, {
      set(target, property, value) {
        try {
          Boolean(target[property]) ? target[property] = value : new Error('property doesn\'t exist');
          form.elements[property].value = value;
        } catch(error) {
          console.log(error);
        }
      },
    })
  }
}

