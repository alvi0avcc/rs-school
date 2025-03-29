import './garage.css';
import * as create from '../../builder/elements';

export class Garage {
  private main: HTMLElement | undefined;
  private carQuantity: HTMLHeadingElement | undefined;
  private garage: HTMLElement | undefined;

  constructor() {
    this.main = undefined;

    this.init();
  }

  public getView(): HTMLCollection {
    const container: HTMLElement = document.createElement('div');
    if (this.main) container.append(this.main);

    return container.children;
  }

  private init(): void {
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
            create.button({ text: 'CREATE' }),
            create.input({ styles: ['input', 'car-name'] }),
            create.input({ type: 'color', value: '#ffffff', styles: ['input', 'car-color'] }),
            create.button({ text: 'UPDATE' }),
            create.button({ text: 'RACE', styles: ['button', 'btn-race'] }),
            create.button({ text: 'RESET', styles: ['button', 'btn-reset'] }),
            create.button({ text: 'GENERATE CARS', styles: ['button', 'btn-generate'] }),
          ],
        }),
        this.getCarQuantity(),
        this.getGarage(),
      ],
    });
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

  private setGarage(): HTMLElement {
    if (!this.garage)
      this.garage = create.section({
        id: 'section-garage',
        tag: 'section',
        text: 'TO-DO - must be cars',
        styles: ['section', 'section-garage'],
        children: [],
      });

    return this.garage;
  }

  private getGarage(): HTMLElement {
    return this.garage || this.setGarage();
  }
}

export const garage = new Garage();
