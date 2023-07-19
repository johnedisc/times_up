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


const entry = ():void => {
  const buildStartScreen = ():void => {
    const h1: HTMLElement = document.createElement('h1');
    h1.innerHTML = 'OPEN';
    h1.classList.add('start-screen');
    document.querySelector('#container')?.appendChild(h1);
  };

  window.addEventListener('load', (event) => {
    //  screen.orientation.lock("landscape");
    buildStartScreen();
  });
};

