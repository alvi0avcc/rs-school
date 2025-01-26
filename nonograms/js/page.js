"use strict";

export default class Page {
  #parent = null;

  constructor(){
    this.#parent = document.body;
  }

  get getParent(){
    return this.#parent ? this.#parent : false;
  }

  loadDom() {
    fetch("./js/dom.json")
      .then( response => {
        return response.json();
      })
      .then( response => {
        this.Dom(this.getParent, response.dom);
      });
  }

  Dom(parent, elements) {
    this.#parent = parent;
    elements.forEach(
      (el) => {
        const node = this.createElement(el);
        parent.append(node);
        if (el.children) this.Dom(node, el.children);
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