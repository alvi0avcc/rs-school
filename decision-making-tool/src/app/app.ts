import '../app.css';

import MainView from '../main/main';

export default class App {
  #main: MainView;
  // router: Router;

  constructor() {
    this.#main = new MainView();
    this.createView();
  }

  public createView(): void {
    document.body.append(this.#main.getView());
  }

  private updateView(): void {
    document.body.replaceChildren();
    this.createView();
  }
}
