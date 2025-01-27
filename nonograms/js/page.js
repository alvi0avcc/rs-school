"use strict";

import nonograms from "./nonograms.js";

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

  puzzle(){
    const puzzle = nonograms.getPuzzle;
      // console.log(puzzle);

    if (puzzle) {
      const container = document.querySelector("#cell-container");
      const colRow = puzzle.data.length;
      // console.log(colRow);
      container.style.gridTemplateColumns = `max-content repeat(${colRow}, 25px)`;
      
      //upper numbers
      for(let colIndex = -1; colIndex < colRow; colIndex++){
        const element = this.createElement({tag: "div", id: `col-${colIndex}`, classes: ["col-cell"]});
        const colCell = container.appendChild(element);

        // let str = '';

        if(colIndex >= 0) {
          for(let row = 0; row < colRow; row++){
            let num = puzzle.data[row][colIndex];
            // console.log(num);
            if (num === 1) {
              const element = this.createElement({tag: "span", text: num, classes: []});
              colCell.append(element);
            }
          }
        }
      }

      puzzle.data.forEach((row, rowIndex) => {
        // console.log(row);
        const element = this.createElement({id: `row-${rowIndex}`, classes: ["row-cell"]});
        const rowCell = container.appendChild(element); //container for left numbers
      
        row.forEach(cell => { //left numbers
          // console.log(cell);
          if (cell === 1){
            const element = this.createElement({tag: "span", text: cell, classes: []});
            rowCell.append(element);
          }
        });
      
        row.forEach((cell, colIndex) => {
          // console.log(cell);
          const element = this.createElement({id: `cell-${rowIndex}/${colIndex}`, text: cell, classes: ["cell"]});
          container.append(element);
        });
      });
    }
  }

}