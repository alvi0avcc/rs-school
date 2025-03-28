import faviconPath from '../../assets/favicon.png';

const linkElement: HTMLLinkElement = document.createElement('link');
linkElement.rel = 'icon';
linkElement.type = 'image/x-icon';
linkElement.href = faviconPath;

export const favicon: HTMLLinkElement = linkElement;
