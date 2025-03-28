import type { Route } from '../router/router';
import { Router } from '../router/router';

// import GarageView from '../pages/garage';
// import WinnersView from '../pages/winners';
// import ErrorsView from '../pages/404';

const notFoundPage: Route = {
  path: '/404',
  view: async (root) => {
    root.innerHTML = '<h1>404 - Page Not Found</h1>';
  },
};

const routes: Route[] = [
  {
    path: '/',
    view: (root) => {
      root.innerHTML = '<h1>Garage Page. Loading...</h1>';
      //todo () => await fetchGarage();
    },
  },
  {
    path: '/winners',
    view: async (root) => {
      root.innerHTML = '<h1>Winners Page. Loading...</h1>';
      //todo () => await fetchWinners();
    },
  },
  notFoundPage,
];

type View = 'garage' | 'winners' | '404';

export default class App {
  private root: HTMLElement;
  private router: Router;
  // private currentView: View = 'garage';
  // private garageView: GarageView | undefined = undefined;
  // private winnersView: WinnersView | undefined = undefined;

  constructor() {
    this.root = document.body;
    this.router = new Router(this.root, routes, notFoundPage);
  }

  public init(): void {
    console.log('app initialized');
    // this.switchView(this.currentView);
  }

  private switchView(view: View) {
    // this.currentView = view;
    //todo clear current dom view

    switch (view) {
      case 'garage': {
        break;
      }

      case 'winners': {
        break;
      }

      case '404': {
        break;
      }

      default: {
        break;
      }
    }
    if (view === 'garage') {
      // this.garageView = new GarageView();
    } else {
      // this.winnersView = new WinnersView();
    }
  }
}
