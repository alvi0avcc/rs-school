import './header-nav.css';

import { section, a } from '../../builder/elements';

export const header = section({
  id: 'header-nav',
  tag: 'header',
  children: [
    a({
      id: 'link-garage',
      text: 'TO GARAGE',
      href: '/',
      attributes: { 'data-router-link': '' },
      styles: ['button', 'button-green'],
    }),
    a({
      id: 'link-winners',
      text: 'TO WINNERS',
      href: '/winners',
      attributes: { 'data-router-link': '' },
      styles: ['button', 'button-green'],
    }),
  ],
});
