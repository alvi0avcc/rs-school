import '../app.css';

import MainView from '../main/main';

export default class App {
  #main: MainView;
  // router: Router;

  constructor() {
    this.#main = new MainView();
  }

  public start(): void {
    this.createView();
  }

  private createView(): void {
    document.body.append(this.#main.getView());
  }

  private updateView(): void {
    document.body.replaceChildren();
    this.createView();
  }
}
