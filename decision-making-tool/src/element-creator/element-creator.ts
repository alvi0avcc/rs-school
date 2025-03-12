export default class ElementCreator {
  private defaultTag = 'div';

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
    style: string[]
  ): HTMLElement {
    const button: HTMLElement = this.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add(...style);
    if (callback) button.addEventListener('click', (event) => callback(event));
    return button;
  }

  private createElement(tag = this.defaultTag): HTMLElement {
    return document.createElement(tag);
  }
}
