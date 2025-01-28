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
      
       const colLineNumbers = nonograms.getColLineNumbers; //upper numbers
      for(let colIndex = -1; colIndex < colRow; colIndex++){
        const element = this.createElement({ //create container with upper numbers
          tag: "div",
          id: `col-${colIndex}`,
          classes: ["col-cell"],
          text: colIndex >=0 ? colLineNumbers[colIndex].join('\n') : ''
        });
        container.appendChild(element); //add to DOM container with upper numbers
      }

      const rowLineNumbers = nonograms.getRowLineNumbers; //left numbers
      puzzle.data.forEach((row, rowIndex) => {
        // console.log(row);
        const element = this.createElement({id: `row-${rowIndex}`, classes: ["row-cell"], text: rowLineNumbers[rowIndex].join('') }); // create container with left numbers
        container.appendChild(element); //add to DOM container with left numbers
      
        row.forEach((cell, colIndex) => {  // cells of puzzle
          // console.log(cell);
          const element = this.createElement({id: `cell-${rowIndex}/${colIndex}`, text: cell, classes: ["cell"]});
          this.cellClick(element);
          container.append(element);
        });
      });
    }
  }

  cellClick(element){
    element.addEventListener('click', (events) => { // for left click
      console.log("left events = ", events);
    });

    element.addEventListener('contextmenu', (events) => { // for right click
      events.preventDefault(); // block context menu

      console.log("right events = ", events);
    });
  }

}