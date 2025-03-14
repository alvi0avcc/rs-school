import '../app.css';

import Router from '../router/router';

import MainView from '../main/main';
import PickerView from '../picker/picker';
import ErrorView from '../404/404';

export default class App {
  #main: MainView;
  #picker: PickerView;
  #error404: ErrorView;
  #page: HTMLElement;
  #pageMain: HTMLElement | undefined;
  #pagePicker: HTMLElement | undefined;
  #page404: HTMLElement | undefined;
  #router: Router;
  #hash: string;

  constructor() {
    this.#hash = '/';
    this.#page = document.body;
    this.#main = new MainView((hash: string) => this.onHashChange(hash));
    this.#picker = new PickerView((hash: string) => this.onHashChange(hash));
    this.#error404 = new ErrorView((hash: string) => this.onHashChange(hash));
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
      if (this.#page404) this.#page404.remove();
    }

    if (this.#hash === '/picker') {
      this.#pagePicker = this.#picker.getView();
      if (this.#pagePicker) this.#page.append(this.#pagePicker);
      if (this.#pageMain) this.#pageMain.remove();
      if (this.#page404) this.#page404.remove();
    }

    if (this.#hash === '/404') {
      this.#page404 = this.#error404.getView();
      if (this.#page404) this.#page.append(this.#page404);
      if (this.#pageMain) this.#pageMain.remove();
      if (this.#pagePicker) this.#pagePicker.remove();
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
