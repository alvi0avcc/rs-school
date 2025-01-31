"use strict";

import nonograms from "./nonograms.js";

export default class Page {
  #parent = null;
  #solution = false;
  #timerID = null;

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
          nonograms.clearPuzzle;
          nonograms.freeze(false);
        });
      });
    });


    const ShowSolution = this.#parent.querySelector("#btn-solution");
    ShowSolution.addEventListener('click', () => {
      this.stopTimer();
      if (!this.#solution) {
        const styleSheet = document.styleSheets[0];
        
        styleSheet.insertRule('.solution { background-color: black !important;}');
        styleSheet.insertRule('.cell { background-color: white !important;}');
        this.#solution = true;
        // console.log(styleSheet);
        
        nonograms.clearPuzzle;
        nonograms.freeze(true);
      }
    });

    const levelRestart = this.#parent.querySelector("#restart");
    levelRestart.addEventListener('click', () => {
      this.removePuzzle;
      nonograms.clearPuzzle;
      this.puzzle();
      nonograms.freeze(false);
      const styleSheet = document.styleSheets[0];
      if (this.#solution) {
        styleSheet.deleteRule(0);
        styleSheet.deleteRule(0);
        this.#solution = false;
      }
      this.stopTimer();
      // console.log(styleSheet);
    });

    const randomPuzzle = this.#parent.querySelector("#btn-random");
    randomPuzzle.addEventListener('click', () => {
      const puzzleList = nonograms.getPuzzleListAll;
      // console.log(puzzleList);
      const levels = Object.keys(puzzleList);
      const randomIndex = Math.floor(Math.random() * levels.length);
      const randomLevel = levels[randomIndex];
      // console.log(randomLevel);
      const puzzles = puzzleList[randomLevel];
      // console.log(puzzles);
      const randomPuzzleIndex = Math.floor(Math.random() * puzzles.length);
      const randomPuzzle = puzzles[randomPuzzleIndex];
      // console.log(randomPuzzle);
      const levelSelector = this.#parent.querySelector('#level-selector');
      const puzzleSelector = this.#parent.querySelector('#puzzle-selector');
      levelSelector.value = randomLevel;
      this.clearPuzzleList;
      nonograms.setLevel(randomLevel);
      this.fillPuzzleSelector();
      puzzleSelector.value = randomPuzzle;
      puzzleSelector.dispatchEvent(new Event('change'));
    });

    const winClose = this.#parent.querySelector("#button-x");
    winClose.addEventListener('click', () => {
      const win = this.#parent.querySelector("#win");
      win.classList.remove("show");
      win.style.transform = "";
    });

    const saveGame = this.#parent.querySelector("#btn-save");
    saveGame.addEventListener('click', () => {
      nonograms.saveGame();
    });

    const loadGame = this.#parent.querySelector("#btn-load");
    loadGame.addEventListener('click', () => {
      nonograms.loadGame();

      const levelSelector = this.#parent.querySelector('#level-selector');
      const puzzleSelector = this.#parent.querySelector('#puzzle-selector');
      levelSelector.value = nonograms.getLevel;
      console.log(nonograms.getLevel);
      this.clearPuzzleList;
      this.fillPuzzleSelector();
      console.log(nonograms.getPuzzleName);
      console.log(nonograms.getUserPuzzle);

      puzzleSelector.value = nonograms.getPuzzleName;

      this.removePuzzle;
      this.puzzle();

    });

    this.puzzle();
    this.fillPuzzleSelector();

    console.log("loading of DOM completed");
  }

  fillPuzzleSelector (){
    this.stopTimer();
    const selector = this.#parent.querySelector("#puzzle-selector");
    console.log(selector);
    selector.addEventListener('change', (events) => {
      console.log(events.currentTarget.value);
      nonograms.setPuzzle(events.currentTarget.value).then( () => {
        this.removePuzzle;
        this.puzzle();
        nonograms.clearPuzzle;
        nonograms.freeze(false);
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
    this.stopTimer();
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
        const element = this.createElement({  // create container with left numbers
          id: `row-${rowIndex}`, classes: ["row-cell"], text: rowLineNumbers[rowIndex].join('')
        });
        container.appendChild(element); //add to DOM container with left numbers
      
        row.forEach((cell, colIndex) => {  // cells of puzzle
          // console.log(cell);
          const element = this.createElement({
            id: `cell-${rowIndex}/${colIndex}`,
            text: cell,
            classes: (cell === 1 ? ["cell", "solution"] : ["cell"])
          });
          // console.log(nonograms.getUserCellState(rowIndex, colIndex));
          
          if (nonograms.getUserCellState(rowIndex, colIndex) === 1) element.classList.add('black');
          if (nonograms.getUserCellState(rowIndex, colIndex) === 0) element.classList.add('crossed', 'white');
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

      if (!nonograms.getFreeze) {
        this.startTimer();
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
        if(nonograms.checkPuzzle) this.showWin;
      }
    });

    element.addEventListener('contextmenu', (events) => { // for right click
      events.preventDefault(); // block context menu

      console.log("right events = ", events);

      const [row, col] = this.parseCell(events.currentTarget.id);

      if (!nonograms.getFreeze) {
        this.startTimer();
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
        if(nonograms.checkPuzzle) this.showWin;
      }
    });
  }

  get showWin(){
    console.log("You Win!");
    this.stopTimer(true);
    nonograms.freeze(true);
    const win = this.#parent.querySelector(".win");
    win.classList.add("show");
    setTimeout(() => {
      win.style.transform = "translateY(-100%)";
    }, 100);
  }

  startTimer(){
    const timer = this.#parent.querySelector('#timer');
    if (!this.#timerID) {
      nonograms.initTimer();
      this.#timerID = setInterval(()=>{
        console.log(nonograms.getTimer);
        timer.textContent = `Timer ${nonograms.getTimer}`;
      }, 1000);
    }
  }

  stopTimer(show = false){
    if (!show) {
      const timer = this.#parent.querySelector('#timer');
      timer.textContent = 'Timer 00:00';
    }
    clearInterval(this.#timerID);
    this.#timerID = null;
  }
  
}