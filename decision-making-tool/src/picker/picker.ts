import './picker.css';
import icons from '../assets/icon.svg';

import * as htmlElement from '../element-creator/element-creator';

import type { Option } from '../utils/storage';
import { EasingTimerFunction } from '../utils/easing';
import { cleanedList } from '../utils/option-list';

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
    this.#main = htmlElement.section('main');
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
    console.log(this.#timer);
  }

  public getView(): HTMLElement | undefined {
    if (this.#main) return this.#main;
    return undefined;
  }

  public setListOptions(options: Option[] | undefined): void {
    if (options) this.#listOptions = options;
    console.log('set picker option =', this.#listOptions);
    this.#main.replaceChildren();
    this.createPage();
  }

  private createPage(): HTMLElement {
    const form = htmlElement.section();
    const buttonUndo = htmlElement.button(
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

    const buttonSound = htmlElement.button(
      'btn-sound',
      '',
      () => {
        console.log('btn-sound clicked!');
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

    const buttonStart = htmlElement.button(
      'btn-start',
      '',
      () => {
        console.log('btn-start clicked!');
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

    // const timer = this.#creator.label('label', 'label');
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

    form.append(buttonUndo, buttonSound, timer, buttonStart);

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

  private stateCircle(list: Option[], summ: number, state: number): boolean {
    if (this.#stateRotary === -1) return false;
    let angle: number = this.#rotation * state;
    const angles: number[] = list.map((value) => ((value.weight || 1) / summ) * 2 * Math.PI);
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
    if (context) {
      context.font = '20px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.shadowColor = 'black';
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
    }
    const width: number = canvas.width;
    const height: number = canvas.height;
    const Xc: number = width / 2;
    const Yc: number = height / 2;

    const summ: number = coloredList.reduce(
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
        this.stateCircle(coloredList, summ, easedT);

        //outer circle
        context.beginPath();
        context.arc(Xc, Yc, spinnerRadius, 0, Math.PI * 2);
        context.fillStyle = 'blue';
        context.fill();
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.stroke();

        let startAngle = -Math.PI / 2;

        context.imageSmoothingEnabled = true;

        //segments
        context.strokeStyle = 'white';

        for (const segment of coloredList) {
          if (segment.title && segment.weight) {
            const endAngle: number = startAngle + (segment.weight / summ) * 2 * Math.PI;

            const rotatedStartAngle = startAngle - this.#rotation * easedT;
            const rotatedEndAngle = endAngle - this.#rotation * easedT;

            context.beginPath();
            context.moveTo(Xc, Yc);
            context.arc(Xc, Yc, spinnerRadius, rotatedStartAngle, rotatedEndAngle);
            context.closePath();
            context.fillStyle = segment.color;
            context.fill();
            context.stroke();

            if (endAngle - startAngle >= 0.2) {
              const midAngle = (rotatedStartAngle + rotatedEndAngle) / 2;
              const x: number = Xc + spinnerRadius * 0.6 * Math.cos(midAngle);
              const y: number = Yc + spinnerRadius * 0.6 * Math.sin(midAngle);

              context.save();
              context.translate(x, y);
              context.rotate(midAngle);
              context.fillStyle = 'white';
              context.shadowColor = 'black';
              context.shadowBlur = 5;
              context.fillText(
                segment.title.length > 9 ? `${segment.title.slice(0, 10)}...` : segment.title,
                0,
                0
              );
              context.restore();
            }
            startAngle = endAngle;
          }
        }

        //inner circle
        context.save();
        context.shadowColor = 'black';

        context.shadowBlur = 20;

        context.beginPath();
        context.arc(Xc, Yc, circleInnerRadius, 0, Math.PI * 2);
        context.fillStyle = 'green';
        context.fill();
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.stroke();
        context.restore();

        //cursor
        context.save();

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.beginPath();

        context.moveTo(Xc, cursorYpos);
        context.lineTo(Xc + 15, cursorYpos - 30);
        context.lineTo(Xc, cursorYpos - 20);
        context.lineTo(Xc - 15, cursorYpos - 30);
        context.closePath();
        context.fillStyle = '#33a3a3';
        context.fill();
        context.stroke();
        context.restore();
      }

      // if (PickerView.stateRotary >= 0) requestAnimationFrame(draw);
      requestAnimationFrame(draw);
    };
    draw();
  }
}
