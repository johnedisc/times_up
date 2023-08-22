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

    const programForm = this.querySelector('form');
    programForm.classList.add('flex-down', 'start-screen');
    console.log(programForm?.elements);

    this.setFormBindings(programForm);
//    window.addEventListener('inputchanged', (event) => {
//      console.log('hi');
//      console.log(this.#newProgram);
//    });
  }

  setFormBindings(form: HTMLFormElement) {
    //set dbl data binding
    console.log('set bindings');
    this.#newProgram = new Proxy(this.#newProgram, {
      set(target, property, value) {
        try {
          form.elements[property].value = value;
//          console.log('hi');
//          window.dispatchEvent(new Event('inputchanged'));
        } catch(error) {
          console.log(error);
        }
      },
    })
    for (let i = 0; i < form.elements.length; i++) {
      let el = form.elements[i];
      console.log(el);
      el.addEventListener('change', (event) => {
        this.#newProgram[el.name] = el.value;
        console.log(event.target);
        console.log(el.value);
      });
    };
  }
}

