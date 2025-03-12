export default class HeaderView {
  private defaultTag = 'div';

  #header: HTMLElement | null;
  constructor() {
    this.#header = document.createElement('div');
    this.createHeader();
  }

  public getView(): Node | string {
    if (this.#header) return this.#header;
    return '';
  }

  public createHeader(): HTMLElement | null {
    const page: HTMLElement[] = [
      this.createButton('btn1', 'btn1', 'Click Me', () => {
        console.log('Button1 clicked!');
      }),
      this.createButton('btn2', 'btn2', 'Click Me', () => {
        console.log('Button2 clicked!');
      }),
    ];
    // this.#header = document.createElement('div');
    this.#header?.append(...page);
    return this.#header;
  }

  public createElement(tag = this.defaultTag): HTMLElement {
    return document.createElement(tag);
  }

  private createButton(
    id = '',
    name = '',
    text = 'button',
    callback: EventListener | undefined = undefined
  ): HTMLElement {
    const button: HTMLElement = this.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add('button');
    if (callback) button.addEventListener('click', (event) => callback(event));
    return button;
  }
}
