import './picker.css';
// import '../assets/icon.svg';
import icons from '../assets/icon.svg';

import ElementCreator from '../element-creator/element-creator';

export default class PickerView {
  private onHashChange: (hash: string) => void;
  #creator: ElementCreator;
  #main: HTMLElement;
  constructor(onHashChange: (hash: string) => void) {
    this.onHashChange = onHashChange;
    this.#creator = new ElementCreator();
    this.#main = this.#creator.section('main');
    this.createPage();
  }

  public getView(): HTMLElement | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  private createPage(): HTMLElement {
    const form = this.#creator.section();
    const buttonUndo = this.#creator.button(
      'btn-undo',
      '',
      () => {
        console.log('btn-undo clicked!');
        history.pushState({ page: '/' }, '', '#/');
        this.onHashChange('/');
      },
      ['button', 'btn_undo']
    );
    const svgUndo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgUndo.setAttribute('viewBox', '0 0 24 24');
    svgUndo.setAttribute('width', '24');
    svgUndo.setAttribute('height', '24');

    const svgUseUndo = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseUndo.setAttribute('href', `${icons}#undo-2`);
    svgUndo.append(svgUseUndo);
    buttonUndo.append(svgUndo);

    const buttonSound = this.#creator.button(
      'btn-sound',
      '',
      () => {
        console.log('btn-sound clicked!');
      },
      ['button', 'btn_sound']
    );
    const svgSound = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSound.setAttribute('viewBox', '0 0 24 24');
    svgSound.setAttribute('width', '24');
    svgSound.setAttribute('height', '24');

    const svgUseSound = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseSound.setAttribute('href', `${icons}#volume-2`);
    svgSound.append(svgUseSound);
    buttonSound.append(svgSound);

    const buttonStart = this.#creator.button(
      'btn-start',
      '',
      () => {
        console.log('btn-start clicked!');
      },
      ['button', 'btn_start']
    );
    const svgStart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgStart.setAttribute('viewBox', '0 0 24 24');
    svgStart.setAttribute('width', '24');
    svgStart.setAttribute('height', '24');

    const svgUseStart = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseStart.setAttribute('href', `${icons}#play`);
    svgStart.append(svgUseStart);
    buttonStart.append(svgStart);

    const timer = this.#creator.label('label', 'label');
    timer.classList.add('form_timer');
    form.append(buttonUndo, buttonSound, timer, buttonStart);

    const canvas = this.#creator.section('canvas', 'canvas');
    canvas.setAttribute('width', '512');
    canvas.setAttribute('height', '512');

    const page: HTMLElement[] = [
      this.#creator.label('h1', '', 'Decision Making Tool'),
      form,
      this.#creator.label('p', '', 'PRESS START BUTTON'),
      canvas,
    ];
    this.#main.append(...page);
    return this.#main;
  }
}
