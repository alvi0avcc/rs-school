import { favicon } from './builder/favicon';
import App from './app/app';

document.head.append(favicon);

const app = new App();
app.init();
