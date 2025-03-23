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
        //TODO - toggle sound on/off
        console.log('sound clicked'); //temp
        console.log('sound value =', value); //temp

        break;
      }

      case MakeRule.timer: {
        console.log('timer clicked'); //temp
        break;
      }

      case MakeRule.run: {
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
        this.#hash = '/404';
        break;
      }
    }
    this.createView();
  }

  private onOptionsChange(rule: OptionRule, value: string): void {
    switch (rule) {
      case OptionRule.add: {
        this.optionRuleAdd();
        break;
      }
      case OptionRule.updateTitle: {
        this.optionRuleUpdateTitle(value);
        break;
      }
      case OptionRule.updateWeight: {
        this.optionRuleUpdateWeight(value);
        break;
      }
      case OptionRule.del: {
        this.optionRuleDel(value);
        break;
      }
      case OptionRule.paste: {
        this.optionRulePaste(value);
        break;
      }
      case OptionRule.clear: {
        this.optionRuleClear();
        break;
      }
      case OptionRule.save: {
        this.optionRuleSave();
        break;
      }
      case OptionRule.load: {
        this.optionRuleLoad(value);
        break;
      }
      default: {
        break;
      }
    }

    this.optionsChangeUpdateView(rule);
  }

  private optionRuleAdd(): void {
    const maxId: number = this.#listOptions?.lastId || 0;
    this.#listOptions?.listOptions.push({
      id: `#${maxId + 1}`,
      title: '',
      weight: undefined,
    });
    if (this.#listOptions) this.#listOptions.lastId = maxId + 1;
  }

  private optionRuleUpdateTitle(value: string): void {
    if (this.#listOptions) {
      const valueObject: Record<string, number | string> = JSON.parse(value);
      const index: number = this.#listOptions.listOptions.findIndex(
        (item) => item.id === valueObject.id
      );
      if (index !== -1) {
        this.#listOptions.listOptions[index].title = `${valueObject.value}`;
      }
    }
  }

  private optionRuleUpdateWeight(value: string): void {
    if (this.#listOptions) {
      const valueObject: Record<string, number | string | undefined> = JSON.parse(value);
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
  }

  private optionRuleDel(value: string): void {
    if (this.#listOptions?.listOptions)
      this.#listOptions.listOptions = this.#listOptions?.listOptions.filter(
        (item) => item.id !== value
      );
    if (this.#listOptions?.listOptions.length === 0) this.#listOptions.lastId = 0;
  }

  private optionRulePaste(value: string): void {
    if (this.#listOptions) {
      if (value === 'open') this.#main.fillDialog();
      if (value !== 'open') {
        const options: [string, number | undefined][] = Storage.pasteOption(value);
        if (options.length > 0) {
          for (const line of options) {
            this.#listOptions.listOptions.push({
              id: `#${this.#listOptions.lastId + 1}`,
              title: line[0],
              weight: line[1],
            });
            this.#listOptions.lastId++;
          }
        }
      }
    }
  }

  private optionRuleClear(): void {
    if (this.#listOptions) {
      this.#listOptions.listOptions = [];
      this.#listOptions.lastId = 0;
    }
  }

  private optionRuleSave(): void {
    if (this.#listOptions) {
      this.#storage.saveStorageToFile();
    }
  }

  private optionRuleLoad(value: string): void {
    if (this.#listOptions) {
      const loaded: List = JSON.parse(value);
      this.#listOptions = loaded;
    }
  }

  private optionsChangeUpdateView(rule: OptionRule): void {
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
