import './css/container.css';
import './css/variables.css';
import { startScreen } from './ts/start-screen';

export const clearScreen = ():void => {
  document.querySelector<HTMLElement>('#container')!.innerHTML = ``;
}

window.addEventListener('load', (event) => {
  startScreen();
});


