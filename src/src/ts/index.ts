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


