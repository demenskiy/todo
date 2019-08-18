export default class Layout {
  constructor() {
    this.render();
  }

  render() {
    const markup = `
      <main class='app-main'>
        <div class='container'>
          <section id='tasks' class='tasks'></section>
        </div>
      </main>
    `;

    const root = document.querySelector('#root');
    root.insertAdjacentHTML('afterbegin', markup);
  }
}
