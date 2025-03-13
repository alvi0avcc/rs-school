import '../app.css';

import MainView from '../main/main';
import PickerView from '../picker/picker';

export default class App {
  #main: MainView;
  #picker: PickerView | undefined;
  // router: Router;

  constructor() {
    this.#main = new MainView();
    this.#picker = new PickerView();
  }

  public start(): void {
    this.createView();
  }

  private createView(): void {
    document.body.append(this.#main.getView());
    if (this.#picker) document.body.append(this.#picker.getView());
  }

  private updateView(): void {
    document.body.replaceChildren();
    this.createView();
  }
}
