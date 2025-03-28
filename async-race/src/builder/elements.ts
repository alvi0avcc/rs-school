export const main = ({
  id = 'main',
  text = '',
  callback = undefined,
  styles = ['main'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLElement => {
  const main: HTMLElement = document.createElement('main');
  if (id) main.id = id;
  if (text) main.textContent = text;
  if (styles) main.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      main.setAttribute(key, value);
    }
  if (callback) main.addEventListener('click', (event) => callback(event));
  return main;
};

export const h = ({
  id = '',
  tag = 'h1',
  text = '',
  align = 'center',
  callback = undefined,
  styles = [tag],
  attributes = {},
}: {
  id?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  align?: string;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLHeadingElement => {
  const element: HTMLHeadingElement = document.createElement(tag);
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (align) element.style.textAlign = align;
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const a = ({
  id = '',
  text = '',
  href = '',
  target = '_self',
  callback = undefined,
  styles = ['a'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLAnchorElement => {
  const element: HTMLAnchorElement = document.createElement('a');
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (href) element.href = href;
  if (target) element.target = target;
  if (target === '_blank') {
    element.rel = 'noopener noreferrer';
  }
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const button = ({
  id = '',
  text = '',
  type = 'button',
  disabled = false,
  callback = undefined,
  styles = ['button'],
  attributes = {},
}: {
  id?: string;
  text?: string;
  type?: 'reset' | 'submit' | 'button';
  disabled?: boolean;
  callback?: EventListener;
  styles?: string[];
  attributes?: Record<string, string>;
}): HTMLButtonElement => {
  const element: HTMLButtonElement = document.createElement('button');
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (type) element.type = type;
  if (disabled) element.disabled = disabled;
  if (styles) element.classList.add(...styles);
  if (attributes)
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  if (callback) element.addEventListener('click', (event) => callback(event));
  return element;
};

export const input = (
  id = '',
  type = 'text',
  value = '',
  callback?: (event: Event) => void
): HTMLInputElement => {
  const input: HTMLInputElement = document.createElement('input');
  input.id = id;
  input.type = type;
  input.value = value;
  input.classList.add('input');
  if (callback) input.addEventListener('input', (event: Event) => callback(event));
  return input;
};

export const inputFileLoad = (id = '', callback?: (event: Event) => void): HTMLInputElement => {
  const input: HTMLInputElement = document.createElement('input');
  input.id = id;
  input.type = 'file';
  input.accept = '.json';
  input.hidden = true;
  input.value = '';
  if (callback) input.addEventListener('input', (event: Event) => callback(event));
  return input;
};

export const label = ({
  id = '',
  text = 'label',
  htmlFor = undefined,
  callback = undefined,
  styles = ['label'],
}: {
  id?: string;
  text?: string;
  htmlFor?: string;
  callback?: EventListener;
  styles?: string[];
}): HTMLLabelElement => {
  const label: HTMLLabelElement = document.createElement('label');
  if (id) label.id = id;
  if (text) label.textContent = text;
  if (htmlFor) label.htmlFor = htmlFor;
  if (styles) label.classList.add(...styles);
  if (callback) label.addEventListener('click', (event) => callback(event));
  return label;
};

export const ul = (
  tag = 'ul',
  id = '',
  text = '',
  callback: EventListener | undefined = undefined
): HTMLElement => {
  const ul: HTMLElement = document.createElement('ul');
  ul.id = id;
  ul.textContent = text;
  ul.classList.add(tag);
  if (callback) ul.addEventListener('click', (event) => callback(event));
  return ul;
};

export const li = (
  tag = 'li',
  id = '',
  text = '',
  callback: EventListener | undefined = undefined
): HTMLElement => {
  const li: HTMLElement = document.createElement('li');
  li.id = id;
  li.textContent = text;
  li.classList.add(tag);
  if (callback) li.addEventListener('click', (event) => callback(event));
  return li;
};

export const section = (
  tag = 'section',
  id = '',
  text = '',
  callback: EventListener | undefined = undefined
): HTMLElement => {
  const section: HTMLElement = document.createElement('section');
  section.id = id;
  section.textContent = text;
  section.classList.add(tag);
  if (callback) section.addEventListener('click', (event) => callback(event));
  return section;
};

export const dialog = (id = 'dialog'): HTMLDialogElement => {
  const dialog: HTMLDialogElement = document.createElement('dialog');
  dialog.id = id;
  dialog.textContent = '';
  dialog.classList.add('dialog');
  return dialog;
};

export const form = (id = 'form'): HTMLFormElement => {
  const form = document.createElement('form');
  form.id = id;
  form.textContent = '';

  return form;
};

export const textArea = (id = 'text-area'): HTMLTextAreaElement => {
  const text = document.createElement('textarea');
  text.id = id;
  text.textContent = '';

  return text;
};

export const createElement = (tag = 'div'): HTMLElement => {
  return document.createElement(tag);
};
