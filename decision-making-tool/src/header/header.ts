import ElementCreator from '../element-creator/element-creator';
export default class HeaderView {
  #creator: ElementCreator;
  #header: HTMLElement;
  constructor() {
    this.#creator = new ElementCreator();
    this.#header = this.#creator.Section('header');
    this.createHeader();
  }

  public getView(): Node | string {
    if (this.#header) return this.#header;
    return '';
  }

  private createHeader(): HTMLElement {
    const page: HTMLElement[] = [
      this.#creator.Button('btn1', 'Click Me', () => {
        console.log('Button1 clicked!');
      }),
      this.#creator.Button('btn2', 'Click Me', () => {
        console.log('Button2 clicked!');
      }),
    ];
    this.#header.append(...page);
    return this.#header;
  }
}
