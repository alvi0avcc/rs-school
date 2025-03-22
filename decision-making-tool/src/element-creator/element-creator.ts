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

export const button = (
  id = '',
  text = 'button',
  callback: EventListener | undefined = undefined,
  style: string[] = [],
  type: 'reset' | 'submit' | 'button' = 'button',
  attributes: Record<string, string> = {}
): HTMLButtonElement => {
  const button: HTMLButtonElement = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.type = type;
  button.classList.add(...style);
  if (callback) button.addEventListener('click', (event) => callback(event));
  for (const [key, value] of Object.entries(attributes)) {
    button.setAttribute(key, value);
  }
  return button;
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
