// import Router from '../router/router';

// import GarageView from '../pages/garage';
// import WinnersView from '../pages/winners';
// import ErrorsView from '../pages/404';

type View = 'garage' | 'winners' | '404';

export default class App {
  // private currentView: View = 'garage';
  // private garageView: GarageView | undefined = undefined;
  // private winnersView: WinnersView | undefined = undefined;

  constructor() {}

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
