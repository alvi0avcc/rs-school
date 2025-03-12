export default class ElementCreator {
  private defaultTag = 'div';

  public Section(
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

  public Button(
    id = '',
    text = 'button',
    callback: EventListener | undefined = undefined
  ): HTMLElement {
    const button: HTMLElement = this.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add('button');
    if (callback) button.addEventListener('click', (event) => callback(event));
    return button;
  }

  private createElement(tag = this.defaultTag): HTMLElement {
    return document.createElement(tag);
  }
}
