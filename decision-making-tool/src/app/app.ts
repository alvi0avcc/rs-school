import '../app.css';

import type { List } from '../utils/storage';
import { Storage } from '../utils/storage';

import Router from '../router/router';

import MainView from '../main/main';
import { OptionRule } from '../main/main';
import PickerView from '../picker/picker';
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
      (hash: string) =>
        this.onHashChange(hash),
      (
        rule: OptionRule,
        value: string
      ) =>
        this.onOptionsChange(
          rule,
          value
        ),
      this.#listOptions
    );
    this.#picker = new PickerView(
      (hash: string) =>
        this.onHashChange(hash)
    );
    this.#error404 = new ErrorView(
      (hash: string) =>
        this.onHashChange(hash)
    );
    this.#router = new Router(
      (hash: string) =>
        this.onHashChange(hash)
    );
  }

  public async start(): Promise<
    boolean[]
  > {
    const isStarted: boolean[] =
      await this.#storage.init();
    this.#listOptions =
      this.#storage.getList();
    console.log(
      'listOptions =',
      this.#listOptions
    );

    this.#main.setListOptions(
      this.#listOptions
    );

    this.createView();

    return isStarted;
  }

  private createView(): void {
    if (this.#hash === '/') {
      this.#pageMain =
        this.#main.getView();
      if (this.#pageMain) {
        // this.#pageMain.remove();
        this.#page.append(
          this.#pageMain
        );
      }
      if (this.#pagePicker)
        this.#pagePicker.remove();
      if (this.#page404)
        this.#page404.remove();
    }

    if (this.#hash === '/picker') {
      this.#pagePicker =
        this.#picker.getView();
      if (this.#pagePicker)
        this.#page.append(
          this.#pagePicker
        );
      if (this.#pageMain)
        this.#pageMain.remove();
      if (this.#page404)
        this.#page404.remove();
    }

    if (this.#hash === '/404') {
      this.#page404 =
        this.#error404.getView();
      if (this.#page404)
        this.#page.append(
          this.#page404
        );
      if (this.#pageMain)
        this.#pageMain.remove();
      if (this.#pagePicker)
        this.#pagePicker.remove();
    }
  }

  private onHashChange(
    hash: string
  ): void {
    this.#hash = hash;
    console.log(
      'Hash changed to:',
      hash
    );
    switch (hash) {
      case '/': {
        history.pushState(
          { page: '#/' },
          '',
          '#/'
        );
        break;
      }

      case '/picker': {
        history.pushState(
          { page: '#/picker' },
          '',
          '#/picker'
        );
        break;
      }

      default: {
        history.pushState(
          { page: '#/404' },
          '',
          '#/404'
        );
        console.log('error 404');
        this.#hash = '/404';
        break;
      }
    }
    this.createView();
  }

  private onOptionsChange(
    rule: OptionRule,
    value: string
  ): void {
    console.log('storage clicked');
    console.log(rule);
    console.log(value);
    switch (rule) {
      case OptionRule.add: {
        this.#listOptions?.listOptions.push(
          {
            id: 0,
            title: 'title',
            weight: 0,
          }
        );
        break;
      }

      case OptionRule.del: {
        if (
          this.#listOptions?.listOptions
        )
          this.#listOptions.listOptions =
            this.#listOptions?.listOptions.filter(
              (item) =>
                item.id !== +value
            );
      }

      default: {
        break;
      }
    }

    if (this.#listOptions)
      this.#storage.setList(
        this.#listOptions
      );
    this.createView();
  }
}
