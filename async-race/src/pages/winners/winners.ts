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
  private winners: AsyncRaceAPI.Winner[] | undefined;

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
    await this.getWinners();

    if (!this.main) {
      this.main = create.section({
        id: 'main',
        tag: 'main',
        styles: ['main', 'main-winners'],
        children: [this.title(), this.page(), await this.table(), this.pagination()],
      });
    }
  }

  public async getWinners(): Promise<void> {
    const { winners, totalCount }: { winners: AsyncRaceAPI.Winner[]; totalCount: number } =
      await AsyncRaceAPI.getWinners({ _page: this.pageNumber, _limit: this.pageLimitWinners });
    // console.log(winners);
    // console.log(totalCount);
    this.winnersTotalQuantity = totalCount;
    this.winners = winners;
    this.title();
    await this.table();
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
    if (this.tableWinners) {
      this.tableWinners.replaceChildren();
      this.tableWinners.append(await this.innerTable());
    } else {
      this.tableWinners = create.section({
        id: 'table-container',
        tag: 'section',
        children: [await this.innerTable()],
      });
    }
    return this.tableWinners;
  }

  private async innerTable(): Promise<HTMLElement> {
    return create.section({
      id: 'table',
      tag: 'table',
      children: [this.tableHead(), await this.tableBody()],
    });
  }

  private tableHead(): HTMLElement {
    return create.section({
      tag: 'thead',
      children: [
        create.section({
          tag: 'tr',
          children: [
            create.section({ tag: 'th', text: 'Number' }),
            create.section({ tag: 'th', text: 'Car' }),
            create.section({ tag: 'th', text: 'Name' }),
            create.section({ tag: 'th', text: 'Wins' }),
            create.section({ tag: 'th', text: 'Best time (seconds)' }),
          ],
        }),
      ],
    });
  }

  private async tableBody(): Promise<HTMLElement> {
    console.log('body -', this.winners);

    if (!this.winners?.length) {
      return this.createEmptyBody();
    }

    const getCar = async (winnerId: number): Promise<AsyncRaceAPI.Car> => {
      try {
        return await AsyncRaceAPI.getCar(winnerId);
      } catch (error) {
        console.error(`Failed to fetch car ${winnerId}:`, error);
        return {
          id: winnerId,
          name: 'Unknown Car',
          color: '#aaabbb',
        };
      }
    };

    const rows = await Promise.all(
      this.winners.map(async (winner) => {
        const car = await getCar(winner.id);
        return this.createWinnerRow(winner, car);
      })
    );

    return create.section({
      tag: 'tbody',
      children: rows,
    });
  }

  private createEmptyBody(): HTMLElement {
    return create.section({
      tag: 'tbody',
      children: [
        create.section({
          tag: 'tr',
          children: [
            create.section({
              tag: 'td',
              attributes: { colspan: '5' },
              text: 'No winners yet',
              styles: ['no-winners'],
            }),
          ],
        }),
      ],
    });
  }

  private createWinnerRow(winner: AsyncRaceAPI.Winner, car: AsyncRaceAPI.Car): HTMLElement {
    return create.section({
      tag: 'tr',
      children: [
        create.section({ tag: 'td', text: winner.id.toString() }),
        create.section({
          tag: 'td',
          children: [
            create.section({
              tag: 'div',
              styles: ['car-icon'],
              attributes: {
                style: `background-color: ${car.color}`,
              },
            }),
          ],
        }),
        create.section({ tag: 'td', text: car.name }),
        create.section({ tag: 'td', text: winner.wins.toString() }),
        create.section({ tag: 'td', text: winner.time.toFixed(2) }),
      ],
    });
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
