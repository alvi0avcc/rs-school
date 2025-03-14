import App from './app/app';

import faviconPath from './assets/favicon.png';

const linkElement =
  document.createElement('link');
linkElement.rel = 'icon';
linkElement.type = 'image/x-icon';
linkElement.href = faviconPath;

document.head.append(linkElement);

const app = new App();
app.start();
