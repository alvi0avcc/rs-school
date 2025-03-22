import './main.css';

import * as htmlElement from '../element-creator/element-creator';
import type { List, Option } from '../utils/storage';
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
        this.dialogClose();
      },
      ['button', 'btn-cancel'],
      'reset'
    );
    const buttonConfirm = htmlElement.button(
      'btn-confirm',
      'Confirm',
      () => {
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
    this.#main.replaceChildren();

    this.#main.append(
      // //TODO replace label to h1
      htmlElement.label({
        id: 'h1',
        text: 'Decision Making Tool',
        styles: ['h1'],
      }),

      this.createListOption() || htmlElement.section('div'),
      ...this.sectionButton()
    );
    this.#main.classList.add('main-page');
    return this.#main;
  }

  private createListOption(): HTMLElement | undefined {
    if (!this.#listOptions) return undefined;

    const sectionListOption: HTMLElement = htmlElement.ul();

    for (const line of this.#listOptions.listOptions) {
      const id = line.id || '#1';
      const sectionLine: HTMLElement = htmlElement.li();
      const elementId: HTMLLabelElement = htmlElement.label({ id: `id-${id}`, text: `${id}` });

      const elementTitle: HTMLInputElement = this.OptionTitle(line);
      const elementWeight: HTMLInputElement = this.OptionWeight(line);

      const elementButton: HTMLElement = htmlElement.button(
        `btn-del-${id.toString()}`,
        'Delete',
        () => {
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

  private OptionTitle(line: Option): HTMLInputElement {
    const title: HTMLInputElement = htmlElement.input(
      `input-title-${line.id.toString()}`,
      'text',
      line.title,
      (event: Event) => {
        this.onOptionsChange(
          OptionRule.updateTitle,
          event.target instanceof HTMLInputElement
            ? JSON.stringify({
                id: line.id,
                value: event.target.value,
              })
            : ''
        );
      }
    );
    title.placeholder = 'Title';
    title.classList.add('input-title');

    return title;
  }

  private OptionWeight(line: Option): HTMLInputElement {
    const weight: HTMLInputElement = htmlElement.input(
      `input-weight-${line.id.toString()}`,
      'number',
      `${line.weight}`,
      (event: Event) => {
        this.onOptionsChange(
          OptionRule.updateWeight,
          event.target instanceof HTMLInputElement
            ? JSON.stringify({
                id: line.id,
                value: event.target.value,
              })
            : ''
        );
      }
    );
    weight.placeholder = 'Weight';
    weight.classList.add('input-weight');
    return weight;
  }

  private loadInputEvent(event: Event): void {
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
  }

  private sectionButton(): HTMLElement[] {
    const section: HTMLElement[] = [
      this.buttonAdd(),
      this.buttonOpen(),
      this.buttonClear(),
      this.buttonSave(),
      htmlElement.label({
        text: 'Load list from file',
        htmlFor: 'load-input',
        styles: ['button', 'load-list-button'],
      }),
      htmlElement.inputFileLoad('load-input', (event: Event) => {
        this.loadInputEvent(event);
      }),
      this.buttonStart(),
      this.#dialog,
    ];

    return section;
  }

  private buttonClear(): HTMLElement {
    return htmlElement.button(
      'btn3',
      'Clear list',
      () => {
        this.onOptionsChange(OptionRule.clear, '');
      },
      ['button', 'clear-list-button']
    );
  }

  private buttonOpen(): HTMLElement {
    return htmlElement.button(
      'btn2',
      'Paste list',
      () => {
        this.onOptionsChange(OptionRule.paste, 'open');
      },
      ['button', 'paste-list-button']
    );
  }

  private buttonSave(): HTMLElement {
    return htmlElement.button(
      'btn4',
      'Save list to file',
      () => {
        this.onOptionsChange(OptionRule.save, '');
      },
      ['button', 'save-list-button']
    );
  }

  private buttonAdd(): HTMLElement {
    return htmlElement.button(
      'btn1',
      'Add Option',
      () => {
        this.onOptionsChange(OptionRule.add, '');
      },
      ['button', 'add-option-button']
    );
  }

  private buttonStart(): HTMLElement {
    return htmlElement.button(
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
    );
  }
}
