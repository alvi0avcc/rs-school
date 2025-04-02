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

  constructor() {
    this.main = undefined;
  }

  public getView(): HTMLCollection {
    const container: HTMLElement = document.createElement('div');
    if (this.main) container.append(this.main);

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

  private sectionManagement(): HTMLElement {
    return create.section({
      id: 'section-management',
      tag: 'section',
      styles: ['section-management'],
      children: [
        ...this.sectionManagementCreateCar(),
        ...this.sectionManagementUpdateCar(),
        create.button({ text: 'RACE', styles: ['button', 'btn-race'] }),
        create.button({ text: 'RESET', styles: ['button', 'btn-reset'] }),
        this.btnGenerateHundredCars(),
      ],
    });
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
    if (!this.carQuantity)
      this.carQuantity = create.h({ tag: 'h1', align: 'left', styles: ['h1', 'h1-garage'] });
    this.carQuantity.textContent = `Garage (${quantity})`;
    return this.carQuantity;
  }

  private getCarQuantity(): HTMLHeadingElement {
    return this.carQuantity || this.setCarQuantity();
  }

  private async setGarage(): Promise<HTMLElement> {
    const { cars, totalCount }: { cars: AsyncRaceAPI.Car[]; totalCount: number } =
      await AsyncRaceAPI.getGarage({ _page: 1, _limit: 7 });

    this.setCarQuantity(totalCount);

    const paginationBlock: HTMLElement = create.section({
      tag: 'section',
      children: [
        create.button({ id: `btn-prev`, text: 'PREV' }),
        create.button({ id: `btn-next`, text: 'NEXT' }),
      ],
    });

    if (this.garage) {
      this.garage.replaceChildren();
      this.garage.append(...this.carsBlock(cars), paginationBlock);
    } else {
      this.garage = create.section({
        id: 'section-garage',
        tag: 'section',
        text: 'Page #1',
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
    return cars.map((car: AsyncRaceAPI.Car, index: number) => {
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
                children: [
                  create.button({ id: `btn-start-${index}`, text: 'A' }),
                  create.button({ id: `btn-start-${index}`, text: 'B' }),
                ],
              }),
              getCarSVG(index, car),
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
          id: `btn-remove--${index}`,
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
        create.label({ id: `btn-remove-${index}`, text: car.name || '' }),
      ],
    });
  }
}

const getCarSVG = (index: number, car: AsyncRaceAPI.Car): HTMLElement => {
  return create.svg({
    id: `car-${index}`,
    viewBox: '0 0 250 200',
    styles: ['car'],
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
