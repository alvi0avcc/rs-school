export default class ElementCreator {
  private defaultTag = 'div';

  public input(
    tag = this.defaultTag,
    id = '',
    type = 'text',
    value = '',
    callback?: (event: Event) => void
  ): HTMLInputElement {
    const input: HTMLInputElement = document.createElement('input');
    input.id = id;
    input.type = type;
    input.value = value;
    input.classList.add(tag);
    if (callback) input.addEventListener('input', (event: Event) => callback(event));
    return input;
  }

  public label(
    tag = 'label',
    id = '',
    text = tag,
    callback: EventListener | undefined = undefined
  ): HTMLElement {
    const label: HTMLElement = this.createElement(tag);
    label.id = id;
    label.textContent = text;
    label.classList.add(tag);
    if (callback) label.addEventListener('click', (event) => callback(event));
    return label;
  }

  public ul(
    tag = 'ul',
    id = '',
    text = '',
    callback: EventListener | undefined = undefined
  ): HTMLElement {
    const ul: HTMLElement = this.createElement(tag);
    ul.id = id;
    ul.textContent = text;
    ul.classList.add(tag);
    if (callback) ul.addEventListener('click', (event) => callback(event));
    return ul;
  }

  public li(
    tag = 'li',
    id = '',
    text = '',
    callback: EventListener | undefined = undefined
  ): HTMLElement {
    const li: HTMLElement = this.createElement(tag);
    li.id = id;
    li.textContent = text;
    li.classList.add(tag);
    if (callback) li.addEventListener('click', (event) => callback(event));
    return li;
  }

  public section(
    tag = 'section',
    id = '',
    text = '',
    callback: EventListener | undefined = undefined
  ): HTMLElement {
    const section: HTMLElement = this.createElement(tag);
    section.id = id;
    section.textContent = text;
    section.classList.add(tag);
    if (callback) section.addEventListener('click', (event) => callback(event));
    return section;
  }

  public button(
    id = '',
    text = 'button',
    callback: EventListener | undefined = undefined,
    style: string[] = [],
    type: 'reset' | 'submit' | 'button' = 'button',
    attributes: Record<string, string> = {}
  ): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement('button');
    button.id = id;
    button.textContent = this.defaultTag;
    button.textContent = text;
    button.type = type;
    button.classList.add(...style);
    if (callback) button.addEventListener('click', (event) => callback(event));
    for (const [key, value] of Object.entries(attributes)) {
      button.setAttribute(key, value);
    }
    return button;
  }

  public dialog(id = 'dialog'): HTMLDialogElement {
    const dialog: HTMLDialogElement = document.createElement('dialog');
    dialog.id = id;
    dialog.textContent = this.defaultTag;
    dialog.textContent = '';
    dialog.classList.add('dialog');

    return dialog;
  }

  public form(id = 'form'): HTMLFormElement {
    const form = document.createElement('form');
    form.id = id;
    form.textContent = this.defaultTag;
    form.textContent = '';

    return form;
  }

  public textArea(id = 'text-area'): HTMLTextAreaElement {
    const text = document.createElement('textarea');
    text.id = id;
    text.textContent = this.defaultTag;
    text.textContent = '';

    return text;
  }

  private createElement(tag = this.defaultTag): HTMLElement {
    return document.createElement(tag);
  }
}
