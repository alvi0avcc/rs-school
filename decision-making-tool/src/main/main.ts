import './main.css';

import * as htmlElement from '../element-creator/element-creator';
import type { List } from '../utils/storage';
import { cleanedList } from '../utils/option-list';

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
  private onHashChange: (hash: string) => void;
  private onOptionsChange: (rule: OptionRule, value: string) => void;
  #listOptions: List | undefined;
  #main: HTMLElement;
  #dialog: HTMLDialogElement;

  constructor(
    onHashChange: (hash: string) => void,
    onOptionsChange: (rule: OptionRule, value: string) => void,
    listOptions: List | undefined
  ) {
    this.onHashChange = onHashChange;
    this.onOptionsChange = onOptionsChange;
    this.#listOptions = listOptions;
    this.#main = htmlElement.section('main');
    this.#dialog = htmlElement.dialog();
    this.createDialog();
    this.createMain();
  }

  public getView(): HTMLElement | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  public dialogShow(): void {
    if (!this.#dialog.open) this.#dialog.showModal();
  }

  public dialogClose(): void {
    this.#dialog.close();
  }

  public setListOptions(listOptions: List): void {
    this.#listOptions = listOptions;
    console.log(this.#listOptions);
    this.createMain();
  }

  private createDialog(): void {
    this.#dialog.classList.add('dialog');
    const form = htmlElement.form('form-dialog');

    form.classList.add('form-dialog');
    const text = htmlElement.textArea();
    text.classList.add('text-csv');
    text.placeholder = `
      Paste a list of new options in a CSV-like format:

      title,1                 -> | title                 | 1 |
      title with whitespace,2 -> | title with whitespace | 2 |
      title , with , commas,3 -> | title , with , commas | 3 |
      title with &quot;quotes&quot;,4   -> | title with &quot;quotes&quot;   | 4 |
    `;
    const buttonCancel = htmlElement.button(
      'btn-cancel',
      'Cancel',
      () => {
        console.log('Button1 clicked!');
        this.dialogClose();
      },
      ['button', 'btn-cancel'],
      'reset'
    );
    const buttonConfirm = htmlElement.button(
      'btn-confirm',
      'Confirm',
      () => {
        console.log('btn-confirm clicked!');
        this.onOptionsChange(OptionRule.paste, text.value);
        this.dialogClose();
      },
      ['button', 'btn-confirm'],
      'reset'
    );
    form.append(text, buttonCancel, buttonConfirm);

    this.#dialog.append(form);
  }

  private createMain(): HTMLElement {
    const loadButton = htmlElement.label({
      text: 'Load list from file',
      htmlFor: 'load-input',
      styles: ['button', 'load-list-button'],
    });
    const loadInput = htmlElement.input('load-input', 'file', '', (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const files = event.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          file
            .text()
            .then((fileContent: string) => {
              this.onOptionsChange(OptionRule.load, fileContent);
            })
            .catch((error) => {
              console.error('Error reading file:', error);
            });
        } else {
          console.error('No file selected');
        }
      } else {
        console.error('Event target is not an input element');
      }
    });
    loadInput.setAttribute('accept', '.json');
    loadInput.setAttribute('hidden', '');

    const page: HTMLElement[] = [
      //TODO replace label to h1
      htmlElement.label({ id: 'h1', text: 'Decision Making Tool', styles: ['h1'] }),
      this.createListOption() || htmlElement.section('div'),
      htmlElement.button(
        'btn1',
        'Add Option',
        () => {
          console.log('Button1 clicked!');
          this.onOptionsChange(OptionRule.add, '');
        },
        ['button', 'add-option-button']
      ),
      htmlElement.button(
        'btn2',
        'Paste list',
        () => {
          console.log('Button2 clicked!');
          this.onOptionsChange(OptionRule.paste, 'open');
        },
        ['button', 'paste-list-button']
      ),
      htmlElement.button(
        'btn3',
        'Clear list',
        () => {
          console.log('Button3 clicked!');
          this.onOptionsChange(OptionRule.clear, '');
        },
        ['button', 'clear-list-button']
      ),
      htmlElement.button(
        'btn4',
        'Save list to file',
        () => {
          console.log('Button4 clicked!');
          this.onOptionsChange(OptionRule.save, '');
        },
        ['button', 'save-list-button']
      ),
      loadButton,
      loadInput,
      htmlElement.button(
        'btn5',
        'Start',
        () => {
          if (cleanedList(this.#listOptions?.listOptions, false).length > 1) {
            history.pushState({ page: 'picker' }, '', '#/picker');
            this.onHashChange('/picker');
          } else {
            console.log('not valid list');
            //TODO add modal message "not valid list"
          }
        },
        ['button', 'start-button']
      ),
      this.#dialog,
    ];
    this.#main.replaceChildren();
    this.#main.append(...page);
    this.#main.classList.add('main-page');
    return this.#main;
  }

  private createListOption(): HTMLElement | undefined {
    if (!this.#listOptions) return undefined;

    const sectionListOption: HTMLElement = htmlElement.ul();

    for (const line of this.#listOptions.listOptions) {
      const id = line.id || '#1';
      const title = line.title || '';
      const weight: string = line.weight === undefined ? '' : line.weight.toString();
      const sectionLine: HTMLElement = htmlElement.li();
      const elementId: HTMLLabelElement = htmlElement.label({ id: `id-${id}`, text: `${id}` });

      const elementTitle: HTMLInputElement = htmlElement.input(
        `input-title-${id.toString()}`,
        'text',
        title,
        (event: Event) => {
          this.onOptionsChange(
            OptionRule.updateTitle,
            event.target instanceof HTMLInputElement
              ? JSON.stringify({
                  id: id,
                  value: event.target.value,
                })
              : ''
          );
        }
      );
      elementTitle.placeholder = 'Title';
      elementTitle.classList.add('input-title');
      const elementWeight: HTMLInputElement = htmlElement.input(
        `input-weight-${id.toString()}`,
        'number',
        `${weight}`,
        (event: Event) => {
          this.onOptionsChange(
            OptionRule.updateWeight,
            event.target instanceof HTMLInputElement
              ? JSON.stringify({
                  id: id,
                  value: event.target.value,
                })
              : ''
          );
        }
      );
      elementWeight.placeholder = 'Weight';
      elementWeight.classList.add('input-weight');

      const elementButton: HTMLElement = htmlElement.button(
        `btn-del-${id.toString()}`,
        'Delete',
        () => {
          console.log('Button del clicked!');
          this.onOptionsChange(OptionRule.del, id.toString());
        },
        ['button']
      );

      sectionLine.append(elementId, elementTitle, elementWeight, elementButton, this.#dialog);
      sectionListOption.append(sectionLine);
    }

    sectionListOption.classList.add('option-list');

    return sectionListOption;
  }
}
