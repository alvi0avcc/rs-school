import './winners.css';
// import carSvg from '../../../assets/car.svg';

import * as create from '../../builder/elements';

import * as AsyncRaceAPI from '../../api/api';

export class Winners {
  private main: HTMLElement | undefined;
  private winnersQuantity: HTMLHeadingElement;
  private winnersTotalQuantity: number;
  private pageNo: HTMLHeadingElement | undefined;
  private tableWinners: HTMLElement | undefined;
  private paginationBtn: HTMLElement | undefined;
  private pageNumber: number;
  private pageLimitWinners: number;

  constructor() {
    this.main = undefined;
    this.winnersQuantity = this.title();
    this.winnersTotalQuantity = 0;
    this.pageNumber = 1;
    this.pageLimitWinners = 10;
  }

  public getView(): HTMLCollection {
    const container: HTMLElement = document.createElement('div');
    if (this.main) {
      container.append(this.main);
    }

    return container.children;
  }

  public async init(): Promise<void> {
    if (!this.main) {
      this.main = create.section({
        id: 'main',
        tag: 'main',
        styles: ['main', 'main-winners'],
        children: [this.title(), this.page(), await this.table(), this.pagination()],
      });
    }
    await this.getWinners();
  }

  private title(): HTMLHeadingElement {
    if (this.winnersQuantity) {
      this.winnersQuantity.textContent = `Winners (${this.winnersTotalQuantity || '0'})`;
    } else {
      this.winnersQuantity = create.h({
        tag: 'h1',
        text: `Winners (${this.winnersTotalQuantity || '0'})`,
        align: 'left',
        styles: ['h1', 'h1-winners'],
      });
    }
    return this.winnersQuantity;
  }

  private page(): HTMLHeadingElement {
    if (this.pageNo) {
      this.pageNo.textContent = `Page #${this.pageNumber}`;
    } else {
      this.pageNo = create.h({ tag: 'h2', text: `Page #${this.pageNumber}`, align: 'left' });
    }
    return this.pageNo;
  }

  private async table(): Promise<HTMLElement> {
    return this.tableWinners || create.section({ tag: 'section' });
  }

  private async getWinners(): Promise<void> {
    const { winners, totalCount }: { winners: AsyncRaceAPI.Winner[]; totalCount: number } =
      await AsyncRaceAPI.getWinners({ _page: this.pageNumber, _limit: this.pageLimitWinners });
    console.log(winners);
    console.log(totalCount);
    this.winnersTotalQuantity = totalCount;
    this.title();
  }

  private pagination(): HTMLElement {
    return (
      this.paginationBtn ||
      create.section({
        id: 'pagination-btn',
        tag: 'section',
        children: [
          create.button({
            id: `btn-prev`,
            text: 'PREV',
            // callback: () => {
            //   if (this.pageNumber > 1) this.pageNumber--;
            //   this.setGarage();
            // },
          }),
          create.button({
            id: `btn-next`,
            text: 'NEXT',
            // callback: () => {
            //   if (this.pageNumber < this.carTotalCount / this.pageLimitCars) this.pageNumber++;
            //   this.setGarage();
            // },
          }),
        ],
      })
    );
  }
}

export const winners = new Winners();
