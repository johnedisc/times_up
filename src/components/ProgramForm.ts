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
        <label for='name'>
          program name
        </label>
        <input name='name' type='text' required />
        <button type='submit'>go</button>
      </form>
    `;

    const programForm = document.querySelector('form');
    programForm.classList.add('flex-down', 'start-screen');

    this.setFormBindings(programForm);
  }

  setFormBindings(form: HTMLFormElement) {

    form.addEventListener('submit', (event) => {
      event.preventDefault();
//      console.log(`${this.#newProgram.name} submitted`);
      this.#newProgram.name = '';

    });

    //set dbl data binding
    this.#newProgram = new Proxy(this.#newProgram, {
      set(target, property, value) {
//          console.log('target', target, 'property', property, 'value', value);
          target[property] = value;
          form.elements[property].value = value;
//          console.log(form.elements[property].value);
          return true;
      },
    })
    for (let i = 0; i < form.elements.length; i++) {
      let el = form.elements[i];
//      console.log(el.name);
      el.addEventListener('change', (event) => {
//        console.log(el, el.value);
        let tempVal = el.value;
        this.#newProgram[el.name] = tempVal;
      });
    };
  }
}

