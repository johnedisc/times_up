import { _timesUpApp } from "../main.js";

export function checkModal(type: string):void {
  let warningText = '';
  let buttonText = '';

  switch (type) {
    case 'delete':
      warningText = 'are you sure you want to permanently delete this?';
    buttonText = 'delete';
    break;
    case 'stop':
      warningText = 'are you sure you want to end this program early?';
    buttonText = 'end';
    break;
    default:
      break;
  }

  const modal = document.createElement('div');
  modal.classList.add('modal');
  const messageBox = document.createElement('div');
  messageBox.classList.add('message-box', 'flex-down');
  messageBox.innerHTML =  `
  <p style='color: red'>${warningText}</p>
  <button id='modal-button' type='button'>${buttonText}</button>
  `;
  _timesUpApp.store.container.appendChild(modal);
  _timesUpApp.store.container.appendChild(messageBox);
  document.getElementById('modal-button')?.addEventListener('click', () => {
    _timesUpApp.store.container.removeChild(messageBox);
    _timesUpApp.store.container.removeChild(modal);
  });
}
