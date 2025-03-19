import '../app.css';

import type { List } from '../utils/storage';
import { Storage } from '../utils/storage';

import Router from '../router/router';

import MainView from '../main/main';
import { OptionRule } from '../main/main';
import PickerView, { MakeRule } from '../picker/picker';
import ErrorView from '../404/404';

export default class App {
  #storage: Storage;
  #listOptions: List | undefined;

  #main: MainView;
  #picker: PickerView;
  #error404: ErrorView;
  #page: HTMLElement;
  #pageMain: HTMLElement | undefined;
  #pagePicker: HTMLElement | undefined;
  #page404: HTMLElement | undefined;
  #router: Router;
  #hash: string;

  constructor() {
    this.#storage = new Storage();

    this.#hash = '/';
    this.#page = document.body;
    this.#main = new MainView(
      (hash: string) => this.onHashChange(hash),
      (rule: OptionRule, value: string) => this.onOptionsChange(rule, value),
      this.#listOptions
    );
    this.#picker = new PickerView(
      (hash: string) => this.onHashChange(hash),
      (rule: MakeRule, value: string) => this.onMakeChange(rule, value),
      this.#listOptions?.listOptions
    );
    this.#error404 = new ErrorView((hash: string) => this.onHashChange(hash));
    this.#router = new Router((hash: string) => this.onHashChange(hash));
  }

  public async start(): Promise<boolean[]> {
    const isStarted: boolean[] = await this.#storage.init();
    this.#listOptions = this.#storage.getList();
    console.log('listOptions =', this.#listOptions);

    this.#main.setListOptions(this.#listOptions);

    this.createView();

    return isStarted;
  }

  private createView(): void {
    if (this.#hash === '/') {
      this.#pageMain = this.#main.getView();
      if (this.#pageMain) {
        // this.#pageMain.remove();
        this.#page.append(this.#pageMain);
      }
      if (this.#pagePicker) this.#pagePicker.remove();
      if (this.#page404) this.#page404.remove();
    }

    if (this.#hash === '/picker') {
      this.#picker.setListOptions(this.#listOptions?.listOptions);
      this.#pagePicker = this.#picker.getView();
      if (this.#pagePicker) this.#page.append(this.#pagePicker);
      if (this.#pageMain) this.#pageMain.remove();
      if (this.#page404) this.#page404.remove();
    }

    if (this.#hash === '/404') {
      this.#page404 = this.#error404.getView();
      if (this.#page404) this.#page.append(this.#page404);
      if (this.#pageMain) this.#pageMain.remove();
      if (this.#pagePicker) this.#pagePicker.remove();
    }
  }

  private onMakeChange(rule: MakeRule, value: string): void {
    switch (rule) {
      case MakeRule.sound: {
        console.log('sound'); //temp

        console.log(value); //temp
        console.log(this.#hash); //temp

        break;
      }

      case MakeRule.timer: {
        console.log('timer'); //temp

        break;
      }

      case MakeRule.run: {
        console.log('run'); //temp
        this.#picker.startRotary();

        break;
      }

      default: {
        break;
      }
    }
  }

  private onHashChange(hash: string): void {
    this.#hash = hash;
    console.log('Hash changed to:', hash);
    switch (hash) {
      case '/': {
        history.pushState({ page: '#/' }, '', '#/');
        break;
      }

      case '/picker': {
        history.pushState({ page: '#/picker' }, '', '#/picker');
        break;
      }

      default: {
        history.pushState({ page: '#/404' }, '', '#/404');
        console.log('error 404');
        this.#hash = '/404';
        break;
      }
    }
    this.createView();
  }

  private onOptionsChange(rule: OptionRule, value: string): void {
    console.log('storage clicked');
    switch (rule) {
      case OptionRule.add: {
        const maxId: number = this.#listOptions?.lastId || 0;
        this.#listOptions?.listOptions.push({
          id: `#${maxId + 1}`,
          title: '',
          weight: undefined,
        });
        if (this.#listOptions) this.#listOptions.lastId = maxId + 1;
        break;
      }

      case OptionRule.updateTitle: {
        if (this.#listOptions) {
          const valueObject: Record<string, number | string> = JSON.parse(value);
          const index: number = this.#listOptions.listOptions.findIndex(
            (item) => item.id === valueObject.id
          );
          if (index !== -1) {
            this.#listOptions.listOptions[index].title = `${valueObject.value}`;
          }
        }
        break;
      }

      case OptionRule.updateWeight: {
        if (this.#listOptions) {
          const valueObject: Record<string, number | string | undefined> = JSON.parse(value);
          console.log(valueObject);
          if (valueObject.value === '') valueObject.value = undefined;

          const index: number = this.#listOptions.listOptions.findIndex(
            (item) => item.id === valueObject.id
          );
          if (index !== -1) {
            this.#listOptions.listOptions[index].weight = valueObject.value
              ? +valueObject.value
              : undefined;
          }
        }
        break;
      }

      case OptionRule.del: {
        if (this.#listOptions?.listOptions)
          this.#listOptions.listOptions = this.#listOptions?.listOptions.filter(
            (item) => item.id !== value
          );
        if (this.#listOptions?.listOptions.length === 0) this.#listOptions.lastId = 0;
        break;
      }

      case OptionRule.paste: {
        if (this.#listOptions) {
          console.log('dialog open');
          if (value === 'open') this.#main.dialogShow();
          if (value !== 'open') {
            console.log('paste');
            const options: [string, number | undefined][] = Storage.pasteOption(value);
            if (options.length > 0) {
              console.log('paste options =', options);
              for (const line of options) {
                console.log(line);
                this.#listOptions.listOptions.push({
                  id: `#${this.#listOptions.lastId + 1}`,
                  title: line[0],
                  weight: line[1],
                });
                this.#listOptions.lastId++;
              }
            }
          }
          break;
        }
      }

      case OptionRule.clear: {
        if (this.#listOptions) {
          this.#listOptions.listOptions = [];
          this.#listOptions.lastId = 0;
        }
        break;
      }

      case OptionRule.save: {
        if (this.#listOptions) {
          this.#storage.saveStorageToFile();
        }
        break;
      }

      case OptionRule.load: {
        if (this.#listOptions) {
          const loaded: List = JSON.parse(value);
          this.#listOptions = loaded;
        }
        break;
      }

      default: {
        break;
      }
    }

    if (this.#listOptions) {
      this.#storage.setList(this.#listOptions);

      if (
        rule !== OptionRule.updateTitle &&
        rule !== OptionRule.updateWeight &&
        rule !== OptionRule.save
      ) {
        this.#main.setListOptions(this.#listOptions);
        this.createView();
      }
    }
  }
}
