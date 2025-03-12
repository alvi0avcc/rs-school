import './main.css';

import ElementCreator from '../element-creator/element-creator';
export default class HeaderView {
  #creator: ElementCreator;
  #main: HTMLElement;
  constructor() {
    this.#creator = new ElementCreator();
    this.#main = this.#creator.Section('main');
    this.createMain();
  }

  public getView(): Node | string {
    if (this.#main) return this.#main;
    return '';
  }

  private createMain(): HTMLElement {
    const page: HTMLElement[] = [
      this.#creator.Button('btn1', 'Click Me', () => {
        console.log('Button1 clicked!');
      }),
      this.#creator.Button('btn2', 'Click Me', () => {
        console.log('Button2 clicked!');
      }),
    ];
    this.#main.append(...page);
    return this.#main;
  }
}
