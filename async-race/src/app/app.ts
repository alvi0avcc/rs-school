import './app.css';

import type { Route } from '../router/router';
import { Router } from '../router/router';
import * as create from '../builder/elements';

import { header } from '../pages/header-nav/header-nav';
import { garage } from '../pages/garage/garage';
// import WinnersView from '../pages/winners';
import { notFoundView } from '../pages/404/404';

const notFoundPage: Route = {
  path: '/404',
  view: (root): void => {
    if (header) root.append(header);
    root.append(notFoundView());
  },
};

const routes: Route[] = [
  {
    path: '/',
    view: (root): void => {
      if (header) root.append(header);
      root.append(...garage.getView());
    },
  },
  {
    path: '/winners',
    view: (root): void => {
      if (header) root.append(header);
      root.append(create.section({ tag: 'main', text: 'Winners Page. Loading...' }));
    },
  },
  notFoundPage,
];

export default class App {
  private root: HTMLElement;
  private router: Router;

  constructor() {
    this.root = document.body;
    this.router = new Router(this.root, routes, notFoundPage);
  }

  public init(): void {
    this.router = new Router(this.root, routes, notFoundPage);
  }
}
