// import './404.css';

import * as htmlElement from '../element-creator/element-creator';

export default class ErrorView {
  private onHashChange: (hash: string) => void;
  #main: HTMLElement;
  constructor(onHashChange: (hash: string) => void) {
    this.onHashChange = onHashChange;
    this.#main = htmlElement.section('main');
    this.createMain();
  }

  public getView(): HTMLElement | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  private createMain(): HTMLElement {
    const page: HTMLElement[] = [
      //TODO replace label to h1
      htmlElement.label({ id: 'h1', text: 'Something went wrong', styles: ['h1'] }),
      htmlElement.button(
        'back-main',
        'Back to main',
        () => {
          console.log('Back to main clicked!');
          history.pushState({ page: '/' }, '', '#/');
          this.onHashChange('/');
        },
        ['button']
      ),
    ];
    this.#main.append(...page);
    return this.#main;
  }
}
