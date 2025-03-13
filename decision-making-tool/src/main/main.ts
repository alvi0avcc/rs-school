import './main.css';

import ElementCreator from '../element-creator/element-creator';
export default class HeaderView {
  private onHashChange: (hash: string) => void;
  #creator: ElementCreator;
  #main: HTMLElement;
  constructor(onHashChange: (hash: string) => void) {
    this.onHashChange = onHashChange;
    this.#creator = new ElementCreator();
    this.#main = this.#creator.section('main');
    this.createMain();
  }

  public getView(): HTMLElement | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  private createMain(): HTMLElement {
    const page: HTMLElement[] = [
      this.#creator.label('h1', '', 'Decision Making Tool'),
      this.#creator.ul('ul', 'ul'),
      this.#creator.button(
        'btn1',
        'Add Option',
        () => {
          console.log('Button1 clicked!');
        },
        ['button', 'add-option-button']
      ),
      this.#creator.button(
        'btn2',
        'Paste list',
        () => {
          console.log('Button2 clicked!');
        },
        ['button', 'paste-list-button']
      ),
      this.#creator.button(
        'btn3',
        'Clear list',
        () => {
          console.log('Button3 clicked!');
        },
        ['button', 'clear-list-button']
      ),
      this.#creator.button(
        'btn4',
        'Save list to file',
        () => {
          console.log('Button4 clicked!');
        },
        ['button', 'save-list-button']
      ),
      this.#creator.button(
        'btn4',
        'Load list from file',
        () => {
          console.log('Button4 clicked!');
        },
        ['button', 'load-list-button']
      ),
      this.#creator.button(
        'btn5',
        'Start',
        () => {
          console.log('Button5 clicked!');
          history.pushState({ page: 'picker' }, '', '#/picker');
          this.onHashChange('/picker');
        },
        ['button', 'start-button']
      ),
    ];
    this.#main.append(...page);
    return this.#main;
  }
}
