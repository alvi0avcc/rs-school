import './main.css';

import ElementCreator from '../element-creator/element-creator';
import type { List } from '../utils/storage';

export enum OptionRule {
  add,
  del,
  paste,
  clear,
  save,
  load,
}
export default class MainView {
  private onHashChange: (
    hash: string
  ) => void;
  private onOptionsChange: (
    rule: OptionRule,
    value: string
  ) => void;
  #listOptions: List | undefined;
  #creator: ElementCreator;
  #main: HTMLElement;

  constructor(
    onHashChange: (
      hash: string
    ) => void,
    onOptionsChange: (
      rule: OptionRule,
      value: string
    ) => void,
    listOptions: List | undefined
  ) {
    this.onHashChange = onHashChange;
    this.onOptionsChange =
      onOptionsChange;
    this.#listOptions = listOptions;
    this.#creator =
      new ElementCreator();
    this.#main =
      this.#creator.section('main');
    this.createMain();
  }

  public getView():
    | HTMLElement
    | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  public setListOptions(
    listOptions: List
  ): void {
    this.#listOptions = listOptions;
    console.log(this.#listOptions);
    this.createMain();
  }

  private createMain(): HTMLElement {
    const page: HTMLElement[] = [
      this.#creator.label(
        'h1',
        '',
        'Decision Making Tool'
      ),
      this.createListOption() ||
        this.#creator.section('div'),
      this.#creator.button(
        'btn1',
        'Add Option',
        () => {
          console.log(
            'Button1 clicked!'
          );
          this.onOptionsChange(
            OptionRule.add,
            ''
          );
        },
        ['button', 'add-option-button']
      ),
      this.#creator.button(
        'btn2',
        'Paste list',
        () => {
          console.log(
            'Button2 clicked!'
          );
        },
        ['button', 'paste-list-button']
      ),
      this.#creator.button(
        'btn3',
        'Clear list',
        () => {
          console.log(
            'Button3 clicked!'
          );
        },
        ['button', 'clear-list-button']
      ),
      this.#creator.button(
        'btn4',
        'Save list to file',
        () => {
          console.log(
            'Button4 clicked!'
          );
        },
        ['button', 'save-list-button']
      ),
      this.#creator.button(
        'btn4',
        'Load list from file',
        () => {
          console.log(
            'Button4 clicked!'
          );
        },
        ['button', 'load-list-button']
      ),
      this.#creator.button(
        'btn5',
        'Start',
        () => {
          console.log(
            'Button5 clicked!'
          );
          history.pushState(
            { page: 'picker' },
            '',
            '#/picker'
          );
          this.onHashChange('/picker');
        },
        ['button', 'start-button']
      ),
    ];
    this.#main.replaceChildren();
    this.#main.append(...page);
    this.#main.classList.add(
      'main-page'
    );
    return this.#main;
  }

  private createListOption():
    | HTMLElement
    | undefined {
    console.log(
      'this.#listOptions =',
      this.#listOptions
    );

    if (!this.#listOptions)
      return undefined;

    const sectionListOption: HTMLElement =
      this.#creator.ul();

    for (const line of this.#listOptions
      .listOptions) {
      const id = line.id || 0;
      const title = line.title || '';
      const weight: string = line.weight
        ? line.weight.toString()
        : '';
      const sectionLine: HTMLElement =
        this.#creator.li();
      const elementId: HTMLElement =
        this.#creator.label(
          'label',
          `id-${id.toString()}`,
          id.toString()
        );
      const elementTitle: HTMLInputElement =
        this.#creator.input(
          'input',
          '',
          'text',
          title
        );
      const elementWeight: HTMLInputElement =
        this.#creator.input(
          'input',
          '',
          'number',
          `${weight}`
        );
      const elementButton: HTMLElement =
        this.#creator.button(
          `btn-del-${id.toString()}`,
          'Delete',
          () => {
            console.log(
              'Button del clicked!'
            );
            this.onOptionsChange(
              OptionRule.del,
              id.toString()
            );
          },
          ['button']
        );

      sectionLine.append(
        elementId,
        elementTitle,
        elementWeight,
        elementButton
      );
      sectionListOption.append(
        sectionLine
      );
    }

    sectionListOption.classList.add(
      'option-list'
    );

    return sectionListOption;
  }
}
