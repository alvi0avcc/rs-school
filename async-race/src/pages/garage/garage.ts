import './garage.css';
import flag from '../../../assets/flag.png';
import carSvg from '../../../assets/car.svg';

import * as create from '../../builder/elements';

import * as AsyncRaceAPI from '../../api/api';

export class Garage {
  private main: HTMLElement | undefined;
  private carQuantity: HTMLHeadingElement | undefined;
  private garage: HTMLElement | undefined;

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
        children: [
          create.section({
            id: 'section-management',
            tag: 'section',
            styles: ['section-management'],
            children: [
              create.input({ styles: ['input', 'car-name'] }),
              create.input({ type: 'color', value: '#00ff00', styles: ['input', 'car-color'] }),
              create.button({
                text: 'CREATE',
                callback: () => {
                  AsyncRaceAPI.createCar({ name: 'new', color: '#e6e6fa' }).then(() =>
                    this.setGarage()
                  );
                },
              }),
              create.input({ styles: ['input', 'car-name'] }),
              create.input({ type: 'color', value: '#ffffff', styles: ['input', 'car-color'] }),
              create.button({ text: 'UPDATE' }),
              create.button({ text: 'RACE', styles: ['button', 'btn-race'] }),
              create.button({ text: 'RESET', styles: ['button', 'btn-reset'] }),
              create.button({ text: 'GENERATE CARS', styles: ['button', 'btn-generate'] }),
            ],
          }),
          this.getCarQuantity(),
          await this.getGarage(),
        ],
      });
    }
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
      this.garage.append(...carsBlock(cars), paginationBlock);
    } else {
      this.garage = create.section({
        id: 'section-garage',
        tag: 'section',
        text: 'Page #1',
        styles: ['section', 'section-garage'],
        children: [...carsBlock(cars), paginationBlock],
      });
    }

    return this.garage;
  }

  private async getGarage(): Promise<HTMLElement> {
    return this.garage || this.setGarage();
  }
}

// end class Garage

const carsBlock = (cars: AsyncRaceAPI.Car[]): HTMLElement[] => {
  return cars.map((car: AsyncRaceAPI.Car, index: number) => {
    return create.section({
      tag: 'article',
      children: [
        create.section({
          tag: 'section',
          id: `edit-btn-${index}`,
          styles: ['section', 'section-edit-btn'],
          children: [
            create.button({ id: `btn-select-${index}`, text: 'SELECT' }),
            create.button({
              id: `btn-remove--${index}`,
              text: 'REMOVE',
              attributes: { 'data-id': `${car.id}` },
              callback: (event: Event) => {
                console.dir(event.target);
                if (event.target && event.target instanceof HTMLElement) {
                  const buttonRemoveClick: HTMLElement = event.target;
                  const id: string | undefined = buttonRemoveClick.dataset.id || undefined;
                  if (id)
                    AsyncRaceAPI.deleteCar(+id).then(() => {
                      console.log(id);
                      //TODO update DOM after delete car
                    });
                }
              },
            }),
            create.label({ id: `btn-remove-${index}`, text: car.name }),
          ],
        }),
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
};

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

export const garage = new Garage();
