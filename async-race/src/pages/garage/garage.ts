import './garage.css';
import flag from '../../../assets/flag.png';
import carSvg from '../../../assets/car.svg';

import * as create from '../../builder/elements';

import * as AsyncRaceAPI from '../../api/api';

const defaultCarColor = '#00ff00';
const CarNames: string[] = ['Ford', 'BMW', 'Mercedes', 'VW', 'Fiat', 'GM', 'Lincoln'];
const CarModels: string[] = ['Mustang', 'X6', 'C-Class', 'Golf', 'Panda', 'Corvette', 'Navigator'];

export class Garage {
  private main: HTMLElement | undefined;
  private carQuantity: HTMLHeadingElement | undefined;
  private garage: HTMLElement | undefined;
  private carNameSelected: HTMLInputElement | undefined;
  private carColorSelected: HTMLInputElement | undefined;
  private carIdSelected: number | undefined;
  private pageNumber: number;
  private pageLimitCars: number;
  private carTotalCount: number;
  private viewportWidth: number;
  private carsForRace:
    | {
        element: SVGElement | undefined;
        animation?: Animation | undefined;
      }[]
    | undefined;
  private moveBtn: {
    startBtn: HTMLButtonElement;
    stopBtn: HTMLButtonElement;
  }[] = [];
  private haveWinner: boolean;
  private winnerDialog: HTMLDialogElement | undefined;
  private raceDialog: HTMLDialogElement;
  private raceStopped: boolean;

  constructor() {
    this.main = undefined;
    this.pageNumber = 1;
    this.pageLimitCars = 7;
    this.carTotalCount = 0;
    this.haveWinner = false;
    this.viewportWidth = window.innerWidth;
    this.raceDialog = create.dialog({
      id: 'race-dialog',
      text: 'Preparing for race. Please wait',
      styles: ['dialog', 'dialog-race'],
    });
    this.raceStopped = false;
  }

  public getView(): HTMLCollection {
    const container: HTMLElement = document.createElement('div');
    if (this.main) {
      container.append(this.main);
      window.addEventListener('resize', () => {
        this.viewportWidth = this.garage?.clientWidth || window.innerWidth;
      });
      globalThis.addEventListener('click', () => {
        if (this.winnerDialog) {
          this.winnerDialog.close();
          this.winnerDialog.remove();
          this.winnerDialog = undefined;
          this.haveWinner = false;
        }
      });
    }

    return container.children;
  }

  public async init(): Promise<void> {
    if (!this.main) {
      this.setCarQuantity(0);

      this.main = create.section({
        id: 'main',
        tag: 'main',
        styles: ['main', 'main-garage'],
        children: [this.sectionManagement(), this.getCarQuantity(), await this.getGarage()],
      });
    }
  }

  private raceDialogModal(startStop: boolean): void {
    this.raceDialog.textContent = startStop
      ? 'Preparing for race. Please wait'
      : 'Stopping the cars. Please wait';
    document.body.append(this.raceDialog);
    this.raceDialog.showModal();
  }

  private sectionManagement(): HTMLElement {
    const raceButton: HTMLElement = create.button({
      text: 'RACE',
      styles: ['button', 'btn-race'],
      callback: () => {
        this.raceDialogModal(true);
        this.toggleButtonMove(true);

        this.startRace();
      },
    });
    const resetButton: HTMLElement = create.button({
      text: 'RESET',
      styles: ['button', 'btn-reset'],
      callback: async () => {
        this.raceStopped = true;

        for (const index in this.carsForRace) {
          const car = this.carsForRace[+index].element;
          const id: number | undefined = Number(car?.dataset.id) || undefined;

          this.raceDialogModal(false);
          this.toggleButtonMove(false);

          if (id) await this.carAnimatedStop(+index, id);
        }
      },
    });

    return create.section({
      id: 'section-management',
      tag: 'section',
      styles: ['section-management'],
      children: [
        ...this.sectionManagementCreateCar(),
        ...this.sectionManagementUpdateCar(),
        raceButton,
        resetButton,
        this.btnGenerateHundredCars(),
      ],
    });
  }

  private toggleButtonMove(startStop: boolean): void {
    for (const { startBtn, stopBtn } of this.moveBtn) {
      startBtn.disabled = startStop;
      stopBtn.disabled = !startStop;
    }
  }

  private btnGenerateHundredCars(): HTMLElement {
    return create.button({
      text: 'GENERATE CARS',
      styles: ['button', 'btn-generate'],
      callback: async () => {
        for (let index = 0; index < 100; index++)
          await AsyncRaceAPI.createCar({
            name: getRandomNameModel(),
            color: getRandomHexColor(),
          });
        this.setGarage();
      },
    });
  }

  private sectionManagementUpdateCar(): HTMLElement[] {
    let carName: string, carColor: string;

    this.carNameSelected = create.input({
      styles: ['input', 'car-name'],
      callback: (event) => {
        carName = checkEventTarget(event) || '';
      },
    });
    this.carColorSelected = create.input({
      type: 'color',
      value: '#ffffff',

      callback: (event) => {
        carColor = checkEventTarget(event) || '';
      },
      styles: ['input', 'car-color'],
    });
    return [
      this.carNameSelected,
      this.carColorSelected,
      create.button({
        text: 'UPDATE',
        callback: () => {
          carName = this.carNameSelected?.value || '';
          carColor = this.carColorSelected?.value || defaultCarColor;

          if (this.carIdSelected) {
            AsyncRaceAPI.updateCar(this.carIdSelected, { name: carName, color: carColor }).then(
              () => this.setGarage()
            );
          }
        },
      }),
    ];
  }

  private sectionManagementCreateCar(): HTMLElement[] {
    let carName: string, carColor: string;
    return [
      create.input({
        list: 'car-names',
        styles: ['input', 'car-name'],
        callback: (event) => {
          carName = checkEventTarget(event) || '';
        },
      }),
      create.datalist({
        id: 'car-names',
        children: CarNames.map((name: string) => create.options({ value: name })),
      }),
      create.input({
        type: 'color',
        value: defaultCarColor,
        styles: ['input', 'car-color'],
        callback: (event) => {
          carColor = checkEventTarget(event) || '';
        },
      }),
      create.button({
        text: 'CREATE',
        callback: () => {
          AsyncRaceAPI.createCar({ name: carName, color: carColor || defaultCarColor }).then(() =>
            this.setGarage()
          );
        },
      }),
    ];
  }

  private setCarQuantity(quantity = 0): HTMLHeadingElement {
    this.carTotalCount = quantity;
    if (!this.carQuantity)
      this.carQuantity = create.h({ tag: 'h1', align: 'left', styles: ['h1', 'h1-garage'] });
    if (quantity >= 0) this.carQuantity.textContent = `Garage (${quantity})`;
    if (quantity === -1)
      this.carQuantity.textContent = `The garage has been dismantled, check the connection with the server!`;
    return this.carQuantity;
  }

  private getCarQuantity(): HTMLHeadingElement {
    return this.carQuantity || this.setCarQuantity();
  }

  private async setGarage(): Promise<HTMLElement> {
    const { cars, totalCount }: { cars: AsyncRaceAPI.Car[]; totalCount: number } =
      await AsyncRaceAPI.getGarage({ _page: this.pageNumber, _limit: this.pageLimitCars });

    this.setCarQuantity(totalCount);

    const previousButton: HTMLButtonElement = create.button({
      id: `btn-prev`,
      text: 'PREV',
      callback: () => {
        if (this.pageNumber > 1) this.pageNumber--;
        this.setGarage();
      },
    });
    const nextButton: HTMLButtonElement = create.button({
      id: `btn-next`,
      text: 'NEXT',
      callback: () => {
        if (this.pageNumber < this.carTotalCount / this.pageLimitCars) this.pageNumber++;
        this.setGarage();
      },
    });

    const paginationBlock: HTMLElement = create.section({
      tag: 'section',
      children: [previousButton, nextButton],
    });

    if (this.garage) {
      this.garage.replaceChildren();
      this.garage.textContent = `Page #${this.pageNumber}`;
      this.garage.append(...this.carsBlock(cars), paginationBlock);
    } else {
      this.garage = create.section({
        id: 'section-garage',
        tag: 'section',
        text: `Page #${this.pageNumber}`,
        styles: ['section', 'section-garage'],
        children: [...this.carsBlock(cars), paginationBlock],
      });
    }

    return this.garage;
  }

  private async getGarage(): Promise<HTMLElement> {
    return this.garage || this.setGarage();
  }

  private carsBlock(cars: AsyncRaceAPI.Car[]): HTMLElement[] {
    this.carsForRace = [];
    this.moveBtn = [];
    return cars.map((car: AsyncRaceAPI.Car, index: number) => {
      const carSVG: HTMLElement = getCarSVG(car);

      const carChild: Element | undefined = carSVG.children.item(0) || undefined;

      if (carChild instanceof SVGElement) this.carsForRace?.push({ element: carChild });

      return create.section({
        tag: 'article',
        children: [
          this.btnSelectRemove(car, index),
          create.section({
            tag: 'section',
            id: `race-${index}`,
            styles: ['section', 'section-race'],
            children: [
              create.section({
                tag: 'section',
                id: `move-btn-${index}`,
                styles: ['move-btn'],
                children: [this.sectionMoveBtn(index, car.id)],
              }),
              carSVG,
              create.img({ id: `flag-${index}`, source: flag, styles: ['flag'] }),
            ],
          }),
        ],
      });
    });
  }

  private btnSelectRemove(car: AsyncRaceAPI.Car, index: number): HTMLElement {
    return create.section({
      tag: 'section',
      id: `edit-btn-${index}`,
      styles: ['section', 'section-edit-btn'],
      children: [
        create.button({
          id: `btn-select-${index}`,
          text: 'SELECT',
          attributes: { 'data-id': `${car.id}` },
          callback: async (event) => {
            const id: number | undefined = checkEventTargetId(event);
            if (id) {
              this.carIdSelected = id;
              const car = await AsyncRaceAPI.getCar(id);
              if (car) {
                if (this.carNameSelected) this.carNameSelected.value = car.name || '';
                if (this.carColorSelected) this.carColorSelected.value = car.color;
              }
            }
          },
        }),
        create.button({
          id: `btn-remove-${index}`,
          text: 'REMOVE',
          attributes: { 'data-id': `${car.id}` },
          callback: (event: Event) => {
            console.dir(event.target);
            const id: number | undefined = checkEventTargetId(event);
            if (id)
              AsyncRaceAPI.deleteCar(id).then(() => {
                this.setGarage();
              });
          },
        }),
        create.label({ id: `car-name-${index}`, text: car.name || '' }),
      ],
    });
  }

  private sectionMoveBtn(index: number, carID: number): HTMLElement {
    const buttonA: HTMLButtonElement = create.button({
      id: `btn-start-${index}`,
      text: 'A',
      attributes: { 'data-index': `${index} `, 'data-car-id': `${carID} ` },
      callback: () => {
        buttonA.disabled = true;
        this.carAnimatedStart(index, carID, false, buttonB);
      },
    });
    const buttonB: HTMLButtonElement = create.button({
      id: `btn-start-${index} `,
      text: 'B',
      attributes: { 'data-index': `${index} `, 'data-car-id': `${carID}`, disabled: 'true' },
      callback: () => {
        buttonB.disabled = true;
        this.carAnimatedStop(index, carID, buttonA);
      },
    });
    this.moveBtn.push({ startBtn: buttonA, stopBtn: buttonB });

    return create.section({
      tag: 'section',
      id: `move-btn-${index} `,
      styles: ['move-btn'],
      children: [buttonA, buttonB],
    });
  }

  private carAnimatedStart = async (
    index: number,
    carID: number,
    waitStart = false,
    activateStopButton?: HTMLButtonElement
  ): Promise<void> => {
    if (carID) {
      const response = await AsyncRaceAPI.controlEngine(carID, 'started');
      if (activateStopButton) activateStopButton.disabled = false;
      if (
        'velocity' in response &&
        'distance' in response &&
        this.carsForRace &&
        this.carsForRace[index]
      ) {
        const duration: number = this.viewportWidth / response.velocity; //sec
        this.carsForRace[index].element?.setAttribute('data-time', `${duration}`);
        this.carsForRace[index].animation = this.carsForRace[index].element?.animate(
          [
            { transform: 'translateX(0)', offset: 0 },
            {
              transform: `translateX(${this.viewportWidth - 130}px)`,
              offset: 1,
            },
          ],
          {
            duration: duration * 1000, //msec
            fill: 'forwards',
            easing: 'ease-in',
          }
        );
        if (waitStart && this.carsForRace[index].animation)
          this.carsForRace[index].animation.pause();
      }
      if (!waitStart) await this.carCheckEngine(index, carID);
    }
  };

  private carAnimatedStop = async (
    index: number,
    carID: number,
    activateStartButton?: HTMLButtonElement
  ): Promise<void> => {
    if (carID) {
      await AsyncRaceAPI.controlEngine(carID, 'stopped').then(() => {
        if (this.carsForRace && this.carsForRace[index].element) {
          const allAnimations = this.carsForRace[index].element.getAnimations();
          for (const anim of allAnimations) anim.cancel();
        }
      });
    }
    if (activateStartButton) activateStartButton.disabled = false;

    this.raceDialog.close();
  };

  private carCheckEngine = async (index: number, id: number): Promise<void> => {
    const response = await AsyncRaceAPI.controlEngine(id, 'drive');
    if ('success' in response && response.success === false) {
      AsyncRaceAPI.controlEngine(id, 'stopped');
      if (this.carsForRace && this.carsForRace[index].animation)
        this.carsForRace[index].animation.pause();
      if (this.carsForRace && this.carsForRace[index].element)
        this.carsForRace[index].animation = this.carsForRace[index].element.animate(
          [
            {
              transform: getComputedStyle(this.carsForRace[index].element).transform,
              opacity: 1,
            },
            {
              transform: `${getComputedStyle(this.carsForRace[index].element).transform} scale(0.5)`,
              opacity: 0.5,
            },
            {
              transform: getComputedStyle(this.carsForRace[index].element).transform,
              opacity: 1,
            },
          ],
          {
            duration: 1000,
            iterations: 3,
            easing: 'ease-in-out',
          }
        );
    }
  };

  private async startRace(): Promise<void> {
    if (this.carsForRace) {
      this.raceStopped = false;
      for (const index in this.carsForRace) {
        const car = this.carsForRace[index].element;
        if (car) {
          const id: number | undefined = Number(car.dataset.id) || undefined;
          if (id) await this.carAnimatedStart(+index, id, true);
        }
      }

      for (const car of this.carsForRace) {
        if (car.animation) {
          car.animation.play();

          this.raceDialog.close();

          car.animation.onfinish = (): void => {
            if (!this.raceStopped && !this.haveWinner && this.main) {
              const id: string | undefined = car.element?.dataset.id || undefined;
              const name: string | undefined = car.element?.dataset.name || undefined;
              const time: string | undefined = car.element?.dataset.time || undefined;
              this.winnerDialog = create.dialog({
                text: `${name} went first (${time ? Math.round(+time) : ''}s)!`,
              });
              this.main.append(this.winnerDialog);
              this.winnerDialog.show();

              this.haveWinner = true;
              if (id && time) {
                AsyncRaceAPI.addWin(+id, +time);
                AsyncRaceAPI.getWinners();
              }
            }
          };
        }
      }

      for (const [index, car] of this.carsForRace.entries()) {
        const id: string | undefined = car.element?.dataset.id || undefined;
        if (id) await this.carCheckEngine(index, +id);
      }
    }
  }
}

export const getCarSVG = (car: AsyncRaceAPI.Car): HTMLElement => {
  return create.svg({
    id: `car-${car.id}`,
    viewBox: '0 0 250 200',
    styles: ['car'],
    attributes: { 'data-id': `${car.id}`, 'data-name': `${car.name}` },
    children: [
      create.use({
        href: `${carSvg}#car-icon`,
        attributes: { fill: car.color },
      }),
    ],
  });
};

const checkEventTarget = (event: Event): string | undefined => {
  if (event.target && event.target instanceof HTMLInputElement) {
    return event.target.value;
  }
};

const checkEventTargetId = (event: Event): number | undefined => {
  let id: string | undefined;
  if (event.target && event.target instanceof HTMLElement) {
    const buttonSelectClick: HTMLElement = event.target;
    id = buttonSelectClick.dataset.id || undefined;
  }
  return id ? +id : undefined;
};

const getRandomNameModel = (): string => {
  return `${CarNames[Math.round(Math.random() * (CarNames.length - 1))]} ${CarModels[Math.round(Math.random() * (CarModels.length - 1))]}`;
};

const getRandomHexColor = (): string => {
  return `#${Math.floor(Math.random() * 0xff_ff_ff)
    .toString(16)
    .padStart(6, '0')}`;
};

export const garage = new Garage();
