class Page {
  constructor() {
    this.parent = document.body;
  }

  loadDom() {
    fetch("./js/dom.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        App(document.body, response.dom);
      });
  }

  Dom(parent, elements) {
    elements.forEach(
      (el) => {
        const node = createElement(el);
        parent.append(node);
        if (el.children) Dom(node, el.children);
      }
    );
  }

  createElement(options) {
    const { tag = "div", text = "", parent, classes = [] } = options;
    const element = document.createElement(tag);
    element.textContent = text;
    if (classes.length > 0) {
      element.classList.add(...classes);
    }
    if (options.type) {
      element.setAttribute("type", options.type);
    }
    if (options.name) {
      element.setAttribute("name", options.name);
    }
    if (options.checked) {
      element.setAttribute("checked", options.checked);
    }
    if (options.for) {
      element.setAttribute("for", options.for);
    }
    if (options.id) {
      element.setAttribute("id", options.id);
    }
    if (parent != null) {
      parent.appendChild(element);
    }
    return element; // Returning the created element
  }

  puzzle(parent){

  }

}