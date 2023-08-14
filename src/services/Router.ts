
export const Router = {
  init: () => {
    const links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', (event) => {
        event.preventDefault();
        const url = links[i];
        Router.go(url);
      });
    };
  },
  go: (path, addToHistory=true) => {
    console.log(`router go method\ngoing to ${path}`);
  }
};
