import './picker.css';
import icons from '../assets/icon.svg';

import ElementCreator from '../element-creator/element-creator';
import type { Option } from '../utils/storage';
import { EasingTimerFunction } from '../utils/easing';

export enum MakeRule {
  sound,
  timer,
  run,
}

export default class PickerView {
  private onHashChange: (hash: string) => void;
  private onMakeChange: (rule: MakeRule, value: string) => void;
  #creator: ElementCreator;
  #main: HTMLElement;
  #listOptions: Option[] | undefined;
  #timer: number;

  constructor(
    onHashChange: (hash: string) => void,
    onMakeChange: (rule: MakeRule, value: string) => void,
    listOptions: Option[] | undefined
  ) {
    this.#listOptions = listOptions;
    this.onHashChange = onHashChange;
    this.onMakeChange = onMakeChange;
    this.#creator = new ElementCreator();
    this.#main = this.#creator.section('main');
    this.#timer = 16;
    this.createPage();
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

    const buttonStart = this.#creator.button(
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

    const timer = this.#creator.label('label', 'label');
    timer.classList.add('form_timer');
    form.append(buttonUndo, buttonSound, timer, buttonStart);

    const page: HTMLElement[] = [
      this.#creator.label('h1', '', 'Decision Making Tool'),
      form,
      this.#creator.label('p', '', 'PRESS START BUTTON'),
      this.getCanvas(),
    ];
    this.#main.append(...page);
    return this.#main;
  }

  private cleanedList(): Option[] {
    console.log(this.#timer);
    console.log('picker this.#listOptions =', this.#listOptions);

    if (this.#listOptions) {
      const cleanedList: Option[] = this.#listOptions.filter(
        (item) => item.title !== '' && item.weight !== undefined
      );
      console.log('cleanedList=', cleanedList);
      return cleanedList;
    }

    return [];
  }

  private getCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.id = 'canvas';
    canvas.classList.add('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const cleanedList: Option[] = this.cleanedList();

    if (cleanedList.length > 0) {
      console.log('list for canvas');

      console.log(this.#timer);
      console.log(cleanedList);

      this.drawCanvas(canvas, cleanedList);
    }
    return canvas;
  }

  private drawCanvas(canvas: HTMLCanvasElement, cleanedList: Option[]): void {
    console.log(this.#timer);
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (context) context.font = '30px Arial';
    const width: number = canvas.width;
    const height: number = canvas.height;
    const Xc: number = width / 2;
    const Yc: number = height / 2;

    const summ: number = cleanedList.reduce(
      (accumulator, value) => accumulator + (value.weight || 0),
      0
    );

    let rotation = 10 * 3.14;
    let accumulator = 0;
    const duration = 3000; //ms

    const startTime = performance.now();

    function draw(): void {
      const currentTime: number = performance.now();
      const elapsedTime: number = currentTime - startTime;
      const t: number = Math.min(elapsedTime / duration, 1);

      // const easedT: number = EasingTimerFunction.easeInOutBack(t);
      const easedT: number = EasingTimerFunction.easeInOut(t);

      if (context) {
        context.imageSmoothingEnabled = true;

        //outer circle
        context.beginPath();
        context.arc(Xc, Yc, 200, 0, Math.PI * 2);
        context.fillStyle = 'blue';
        context.fill();
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();

        //segments
        accumulator = 0;

        context.strokeStyle = 'red';
        for (const segment of cleanedList) {
          if (segment.title && segment.weight) {
            accumulator += segment.weight;

            context.beginPath();
            context.moveTo(Xc, Yc);
            const angle: number = (accumulator * 2 * 3.14) / summ + rotation * easedT;
            const angleT: number =
              ((accumulator - segment.weight / 2) * 2 * 3.14) / summ + rotation * easedT - 0.1;
            const x: number = Xc + 200 * Math.sin(angle);
            const y: number = Yc + 200 * Math.cos(angle);
            const Xt: number = Xc + 100 * Math.sin(angleT);
            const Yt: number = Yc + 100 * Math.cos(angleT);

            context.lineTo(x, y);
            context.stroke();
            if (segment.weight >= 0.5) {
              context.save();
              context.translate(Xt, Yt);
              context.rotate(3.14 / 2 - angleT);
              context.fillStyle = 'lime';
              context.fillText(`${segment.title}`, 0, 0);
              context.restore();
            }
          }
        }

        //inner circle
        context.beginPath();
        context.arc(Xc, Yc, 30, 0, Math.PI * 2);
        context.fillStyle = 'green';
        context.fill();
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
      }

      // rotation -= 0.01;

      requestAnimationFrame(draw);
    }
    draw();
  }
}
