import './style.css'
import './css/container.css';
import './css/variables.css';

document.querySelector<HTMLDivElement>('#container')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

