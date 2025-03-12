import HeaderView from '../header/header';

export default class App {
  #header: HeaderView;
  // main: MainView;
  // footer: FooterView;
  // router: Router;

  constructor() {
    this.#header = new HeaderView();
    this.createView();
  }

  public createView(): void {
    document.body.append(this.#header.getView());
  }
}
