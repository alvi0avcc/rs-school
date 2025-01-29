"use strict";

import nonograms from "./nonograms.js";

export default class Page {
  #parent = null;

  constructor(){
    this.#parent = document.getElementsByTagName('body')[0];
  }

  get getParent(){
    return this.#parent ? this.#parent : false;
  }

  async init(){
    console.log("commence loading of DOM");
    console.log(this.#parent);

    await this.loadDom();
    console.log(this.#parent);

    await nonograms.init();
    console.log(nonograms.getPuzzleListAll);

    const levelSelector = this.#parent.querySelector("#level-selector");
    levelSelector.addEventListener('change', (events) => {
      console.log(events.currentTarget.value);
      nonograms.setLevel(events.currentTarget.value).then(() => {
        this.clearPuzzleList;
        this.fillPuzzleSelector();
        nonograms.setPuzzle(nonograms.getPuzzleListByLevel(nonograms.getLevel)[0]).then( () => {
          this.removePuzzle;
          this.puzzle();
        });
      });
    });

    this.puzzle();
    this.fillPuzzleSelector();

    console.log("loading of DOM completed");
  }

  fillPuzzleSelector (){
    const selector = this.#parent.querySelector("#puzzle-selector");
    console.log(selector);
    selector.addEventListener('change', (events) => {
      console.log(events.currentTarget.value);
      nonograms.setPuzzle(events.currentTarget.value).then( () => {
        this.removePuzzle;
        this.puzzle();
      });
      
    });
    console.log(nonograms.getPuzzleListByCurrentLevel);
    nonograms.getPuzzleListByCurrentLevel.forEach((name) => {
      selector.append(this.createElement({tag: "option", text: name, value: name}));
    });
  }

  async loadDom() {
    await fetch("./js/dom.json")
      .then( response => {
        return response.json();
      })
      .then( response => {
        this.Dom(this.getParent, response.dom);
      });
  }

  Dom(parent, elements) {
    elements.forEach(
      (el) => {
        const node = this.createElement(el);
        parent.append(node);
        if (el.children) this.Dom(node, el.children);
      }
    );
  }

  get clearPuzzleList(){
    this.removeElement(document.querySelector("#puzzle-selector"));
  }

  get removePuzzle(){
    this.removeElement(document.querySelector("#cell-container"));
  }

  removeElement(container){
    container.replaceChildren();
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
    if (options.value) {
      element.setAttribute("value", options.value);
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

  parseCell(id){
    // cell-row/col
    return id.slice(5).split('/');
  }

  cellClick(element){
    element.addEventListener('click', (events) => { // for left click
      console.log("left events = ", events.currentTarget.id);

      const [row, col] = this.parseCell(events.currentTarget.id);

      switch (nonograms.toggleUserCell(row, col, 1)) {

        case 1:
          element.classList.remove("white");
          element.classList.remove("crossed");
          element.classList.add("black");
          break;

        case null:
          element.classList.remove("white");
          element.classList.remove("crossed");
          element.classList.remove("black");
          break;
      }
    });

    element.addEventListener('contextmenu', (events) => { // for right click
      events.preventDefault(); // block context menu

      console.log("right events = ", events);

      const [row, col] = this.parseCell(events.currentTarget.id);

      switch (nonograms.toggleUserCell(row, col, 0)) {
        case 0:
          element.classList.add("white");
          element.classList.add("crossed");
          element.classList.remove("black");
          break;

        case null:
          element.classList.remove("white");
          element.classList.remove("crossed");
          element.classList.remove("black");
          break;
      }

    });
  }

}