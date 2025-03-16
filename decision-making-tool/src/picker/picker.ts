import './picker.css';
import icons from '../assets/icon.svg';

import ElementCreator from '../element-creator/element-creator';
import type { Option } from '../utils/storage';

export enum MakeRule {
  sound,
  timer,
  run,
}

export default class PickerView {
  private onHashChange: (
    hash: string
  ) => void;
  private onMakeChange: (
    rule: MakeRule,
    value: string
  ) => void;
  #creator: ElementCreator;
  #main: HTMLElement;
  #listOptions: Option[] | undefined;
  #timer: number;

  constructor(
    onHashChange: (
      hash: string
    ) => void,
    onMakeChange: (
      rule: MakeRule,
      value: string
    ) => void,
    listOptions: Option[] | undefined
  ) {
    this.#listOptions = listOptions;
    this.onHashChange = onHashChange;
    this.onMakeChange = onMakeChange;
    this.#creator =
      new ElementCreator();
    this.#main =
      this.#creator.section('main');
    this.#timer = 16;
    this.createPage();
  }

  public getView():
    | HTMLElement
    | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  public setListOptions(
    options: Option[] | undefined
  ): void {
    if (options)
      this.#listOptions = options;
    console.log(
      'set picker option =',
      this.#listOptions
    );
    this.#main.replaceChildren();
    this.createPage();
  }

  private createPage(): HTMLElement {
    const form =
      this.#creator.section();
    const buttonUndo =
      this.#creator.button(
        'btn-undo',
        '',
        () => {
          console.log(
            'btn-undo clicked!'
          );
          history.pushState(
            { page: '/' },
            '',
            '#/'
          );
          this.onHashChange('/');
        },
        ['button', 'btn_undo']
      );
    const svgUndo =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
    svgUndo.setAttribute(
      'viewBox',
      '0 0 24 24'
    );
    svgUndo.setAttribute('width', '24');
    svgUndo.setAttribute(
      'height',
      '24'
    );

    const svgUseUndo =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
    svgUseUndo.setAttribute(
      'href',
      `${icons}#undo-2`
    );
    svgUndo.append(svgUseUndo);
    buttonUndo.append(svgUndo);

    const buttonSound =
      this.#creator.button(
        'btn-sound',
        '',
        () => {
          console.log(
            'btn-sound clicked!'
          );
          this.onMakeChange(
            MakeRule.sound,
            ''
          );
        },
        ['button', 'btn_sound']
      );
    const svgSound =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
    svgSound.setAttribute(
      'viewBox',
      '0 0 24 24'
    );
    svgSound.setAttribute(
      'width',
      '24'
    );
    svgSound.setAttribute(
      'height',
      '24'
    );

    const svgUseSound =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
    svgUseSound.setAttribute(
      'href',
      `${icons}#volume-2`
    );
    svgSound.append(svgUseSound);
    buttonSound.append(svgSound);

    const buttonStart =
      this.#creator.button(
        'btn-start',
        '',
        () => {
          console.log(
            'btn-start clicked!'
          );
          this.onMakeChange(
            MakeRule.run,
            ''
          );
        },
        ['button', 'btn_start']
      );
    const svgStart =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
    svgStart.setAttribute(
      'viewBox',
      '0 0 24 24'
    );
    svgStart.setAttribute(
      'width',
      '24'
    );
    svgStart.setAttribute(
      'height',
      '24'
    );

    const svgUseStart =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
    svgUseStart.setAttribute(
      'href',
      `${icons}#play`
    );
    svgStart.append(svgUseStart);
    buttonStart.append(svgStart);

    const timer = this.#creator.label(
      'label',
      'label'
    );
    timer.classList.add('form_timer');
    form.append(
      buttonUndo,
      buttonSound,
      timer,
      buttonStart
    );

    const page: HTMLElement[] = [
      this.#creator.label(
        'h1',
        '',
        'Decision Making Tool'
      ),
      form,
      this.#creator.label(
        'p',
        '',
        'PRESS START BUTTON'
      ),
      this.getCanvas(),
    ];
    this.#main.append(...page);
    return this.#main;
  }

  private cleanedList(): Option[] {
    console.log(this.#timer);
    console.log(
      'picker this.#listOptions =',
      this.#listOptions
    );

    if (this.#listOptions) {
      const cleanedList: Option[] =
        this.#listOptions.filter(
          (item) =>
            item.title !== '' &&
            item.weight !== undefined
        );
      console.log(
        'cleanedList=',
        cleanedList
      );
      return cleanedList;
    }

    return [];
  }

  private getCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement =
      document.createElement('canvas');

    canvas.id = 'canvas';
    canvas.classList.add('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const cleanedList: Option[] =
      this.cleanedList();

    if (cleanedList.length > 0) {
      console.log(this.#timer);
      console.log(cleanedList);
    }
    return canvas;
  }
}
