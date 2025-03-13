import '../app.css';

import Router from '../router/router';

import MainView from '../main/main';
import PickerView from '../picker/picker';

export default class App {
  #main: MainView;
  #picker: PickerView;
  #page: HTMLElement;
  #pageMain: HTMLElement | undefined;
  #pagePicker: HTMLElement | undefined;
  #router: Router;
  #hash: string;

  constructor() {
    this.#hash = '/';
    this.#page = document.body;
    this.#main = new MainView((hash: string) => this.onHashChange(hash));
    this.#picker = new PickerView((hash: string) => this.onHashChange(hash));
    this.#router = new Router((hash: string) => this.onHashChange(hash));
  }

  public start(): void {
    this.createView();
  }

  private createView(): void {
    if (this.#hash === '/') {
      this.#pageMain = this.#main.getView();
      if (this.#pageMain) this.#page.append(this.#pageMain);
      if (this.#pagePicker) this.#pagePicker.remove();
    }

    if (this.#hash === '/picker') {
      this.#pagePicker = this.#picker.getView();
      if (this.#pagePicker) this.#page.append(this.#pagePicker);
      if (this.#pageMain) this.#pageMain.remove();
    }
  }

  private onHashChange(hash: string): void {
    this.#hash = hash;
    console.log('Hash changed to:', hash);
    switch (hash) {
      case '/': {
        history.pushState({ page: '#/' }, '', '#/');
        break;
      }

      case '/picker': {
        history.pushState({ page: '#/picker' }, '', '#/picker');
        break;
      }

      default: {
        history.pushState({ page: '#/404' }, '', '#/404');
        console.log('error 404');
        this.#hash = '/404';
        break;
      }
    }

    this.createView();
  }
}
