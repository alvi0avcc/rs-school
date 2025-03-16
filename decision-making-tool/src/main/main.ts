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
  updateTitle,
  updateWeight,
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
    const loadButton =
      this.#creator.label(
        'label',
        'label-load',
        'Load list from file'
      );
    loadButton.setAttribute(
      'for',
      'load-input'
    );
    loadButton.classList.add(
      'button',
      'load-list-button'
    );
    loadButton.classList.remove(
      'label'
    );
    const loadInput =
      this.#creator.input(
        'input',
        'load-input',
        'file',
        '',
        (event: Event) => {
          console.log('load clicked!');

          if (
            event.target instanceof
            HTMLInputElement
          ) {
            const files =
              event.target.files;
            if (
              files &&
              files.length > 0
            ) {
              const file = files[0];
              file
                .text()
                .then(
                  (
                    fileContent: string
                  ) => {
                    this.onOptionsChange(
                      OptionRule.load,
                      fileContent
                    );
                  }
                )
                .catch((error) => {
                  console.error(
                    'Error reading file:',
                    error
                  );
                });
            } else {
              console.error(
                'No file selected'
              );
            }
          } else {
            console.error(
              'Event target is not an input element'
            );
          }
        }
      );
    loadInput.setAttribute(
      'accept',
      '.json'
    );
    loadInput.setAttribute(
      'hidden',
      ''
    );
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
          this.onOptionsChange(
            OptionRule.clear,
            ''
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
          this.onOptionsChange(
            OptionRule.save,
            ''
          );
        },
        ['button', 'save-list-button']
      ),
      loadButton,
      loadInput,
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
      const weight: string =
        line.weight === undefined
          ? ''
          : line.weight.toString();
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
          `input-title-${id.toString()}`,
          'text',
          title,
          (event: Event) => {
            this.onOptionsChange(
              OptionRule.updateTitle,
              event.target instanceof
                HTMLInputElement
                ? JSON.stringify({
                    id: id,
                    value:
                      event.target
                        .value,
                  })
                : ''
            );
          }
        );
      const elementWeight: HTMLInputElement =
        this.#creator.input(
          'input',
          `input-weight-${id.toString()}`,
          'number',
          `${weight}`,
          (event: Event) => {
            this.onOptionsChange(
              OptionRule.updateWeight,
              event.target instanceof
                HTMLInputElement
                ? JSON.stringify({
                    id: id,
                    value:
                      event.target
                        .value,
                  })
                : ''
            );
          }
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
