import './picker.css';
import icons from '../assets/icon.svg';

import * as htmlElement from '../element-creator/element-creator';

import type { Option } from '../utils/storage';
import { EasingTimerFunction } from '../utils/easing';
import { cleanedList } from '../utils/option-list';
import {
  drawAllSegments,
  drawCursor,
  drawInnerCircle,
  drawOuterCircle,
  drawTextStyle,
} from './draw';

export enum MakeRule {
  sound,
  timer,
  run,
}

export interface ColoredOption extends Option {
  color: string;
}

export default class PickerView {
  private onHashChange: (hash: string) => void;
  private onMakeChange: (rule: MakeRule, value: string) => void;
  #main: HTMLElement;
  #listOptions: Option[] | undefined;
  #timer: number;
  #stateRotary: number;
  #rotation: number;
  #startTime: number;
  #pickingLabel: HTMLParagraphElement;

  constructor(
    onHashChange: (hash: string) => void,
    onMakeChange: (rule: MakeRule, value: string) => void,
    listOptions: Option[] | undefined
  ) {
    this.#listOptions = listOptions;
    this.onHashChange = onHashChange;
    this.onMakeChange = onMakeChange;
    this.#main = htmlElement.main({});
    this.#timer = 16_000;
    this.#stateRotary = -1;
    this.#rotation = 10 * 3.14 + Math.random() * 2 * 3.14;
    this.#startTime = 0;
    this.#pickingLabel = document.createElement('p');

    this.createPage();
  }

  public startRotary(): void {
    this.#stateRotary = 0;
    this.#rotation = 10 * 3.14 + Math.random() * 2 * 3.14;
    this.#startTime = performance.now();
  }

  public getView(): HTMLElement | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  public setListOptions(options: Option[] | undefined): void {
    if (options) this.#listOptions = options;
    this.#main.replaceChildren();
    this.createPage();
  }

  private createPage(): HTMLElement {
    const form = htmlElement.section();

    const buttonUndo = this.buttonUndo();
    const buttonSound = this.buttonSound();
    const buttonTimer: HTMLLabelElement = this.buttonTimer();
    const buttonStart = this.buttonStart();

    form.append(buttonUndo, buttonSound, buttonTimer, buttonStart);

    this.#pickingLabel.id = 'picking-label';
    this.#pickingLabel.textContent = 'PRESS START BUTTON';
    this.#pickingLabel.classList.add('p');

    const page: HTMLElement[] = [
      //TODO replace label to h1
      htmlElement.label({ id: 'h1', text: 'Decision Making Tool', styles: ['h1'] }),

      form,
      this.#pickingLabel,
      this.getCanvas(),
    ];
    this.#main.append(...page);
    return this.#main;
  }

  private buttonUndo(): HTMLButtonElement {
    const buttonUndo = htmlElement.button(
      'btn-undo',
      '',
      () => {
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

    return buttonUndo;
  }

  private buttonSound(): HTMLButtonElement {
    const buttonSound = htmlElement.button(
      'btn-sound',
      '',
      () => {
        this.onMakeChange(MakeRule.sound, '');
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

    return buttonSound;
  }

  private buttonStart(): HTMLButtonElement {
    const buttonStart = htmlElement.button(
      'btn-start',
      '',
      () => {
        this.onMakeChange(MakeRule.run, '');
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

    return buttonStart;
  }

  private buttonTimer(): HTMLLabelElement {
    const timer: HTMLLabelElement = document.createElement('label');
    timer.classList.add('label', 'form_timer', 'timer-label');
    const svgTimer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgTimer.setAttribute('viewBox', '0 0 24 24');
    svgTimer.setAttribute('width', '24');
    svgTimer.setAttribute('height', '24');
    const svgUseTimer = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseTimer.setAttribute('href', `${icons}#timer`);
    svgTimer.append(svgUseTimer);
    const timerInput: HTMLInputElement = document.createElement('input');
    timerInput.classList.add('input', 'timer-input');
    timerInput.type = 'number';
    timerInput.value = (this.#timer / 1000).toString();
    timerInput.addEventListener('change', () => {
      if (+timerInput.value < 5 || timerInput.value === '') timerInput.value = '5';
      if (+timerInput.value > 30) timerInput.value = '30';
      this.#timer = +timerInput.value * 1000;
    });

    timer.append(svgTimer, timerInput);

    return timer;
  }

  private getCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.id = 'canvas';
    canvas.classList.add('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const coloredList: ColoredOption[] = cleanedList(this.#listOptions, true);

    if (coloredList.length > 0) {
      this.drawCanvas(canvas, coloredList);
    }
    return canvas;
  }

  private stateCircle(list: Option[], sum: number, state: number): boolean {
    if (this.#stateRotary === -1) return false;
    let angle: number = this.#rotation * state;
    const angles: number[] = list.map((value) => ((value.weight || 1) / sum) * 2 * Math.PI);
    const cumulativeAngles: number[] = [];
    let cumulativeSum = 0;

    for (const angle of angles) {
      cumulativeSum += angle;
      cumulativeAngles.push(cumulativeSum);
    }
    let index = -1;
    if (angle > 2 * Math.PI) angle = angle % (2 * Math.PI);
    for (let index_ = 0; index_ < cumulativeAngles.length; index_++) {
      if (index_ === 0 && cumulativeAngles[index_] > angle) index = index_;
      if (index_ !== 0 && cumulativeAngles[index_ - 1] <= angle && cumulativeAngles[index_] > angle)
        index = index_;
    }

    if (list[index])
      this.#pickingLabel.textContent =
        list[index].title.length > 15 ? list[index].title.slice(0, 15) + '...' : list[index].title;
    return true;
  }

  private drawCanvas(canvas: HTMLCanvasElement, coloredList: ColoredOption[]): void {
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) drawTextStyle(context);

    const Xc: number = canvas.width / 2;
    const Yc: number = canvas.height / 2;

    const sum: number = coloredList.reduce(
      (accumulator, value) => accumulator + (value.weight || 0),
      0
    );

    const draw = (): void => {
      const currentTime: number = performance.now();
      const elapsedTime: number = currentTime - this.#startTime;
      const t: number = Math.min(elapsedTime / this.#timer, 1);

      // let easedT: number = EasingTimerFunction.easeInOutBack(t);
      let easedT: number = EasingTimerFunction.easeInOut(t);
      if (this.#stateRotary === -1) easedT = 0;

      if (context) {
        const cursorYpos = 70;
        const circleInnerRadius = 25;
        const spinnerRadius = 200;
        this.stateCircle(coloredList, sum, easedT);

        drawOuterCircle(context, Xc, Yc, spinnerRadius);

        let startAngle = -Math.PI / 2;

        drawAllSegments(
          context,
          Xc,
          Yc,
          spinnerRadius,
          this.#rotation,
          startAngle,
          sum,
          easedT,
          coloredList
        );

        drawInnerCircle(context, Xc, Yc, circleInnerRadius);
        drawCursor(context, Xc, cursorYpos);
      }

      requestAnimationFrame(draw);
    };
    draw();
  }
}
