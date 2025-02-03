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
      // console.log(events.currentTarget.value);
      nonograms.soundPlay('click');
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
        nonograms.soundPlay('solution');
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
      nonograms.soundPlay('restart');
      this.removePuzzle;
      nonograms.clearPuzzle;
      this.puzzle();
      nonograms.freeze(false);
      this.hideSolution;
      this.stopTimer();
      // console.log(styleSheet);
    });

    const randomPuzzle = this.#parent.querySelector("#btn-random");
    randomPuzzle.addEventListener('click', async () => {
      this.hideSolution;
      nonograms.soundPlay('click');
      this.showMessage('A random game is being selected.');
      for (let i = 0; i < 5; i++) {
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
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // nonograms.soundPlay('random', true);
    });

    const winClose = this.#parent.querySelector("#button-x");
    winClose.addEventListener('click', () => {
      nonograms.soundPlay('click');
      const win = this.#parent.querySelector("#win");
      win.classList.remove("show");
      win.style.transform = "";
      nonograms.soundPlay('win', true)
    });

    const saveGame = this.#parent.querySelector("#btn-save");
    saveGame.addEventListener('click', () => {
      if (!this.#solution) {
        nonograms.soundPlay('click');
        this.showMessage('Saving Game');

        nonograms.saveGame();
      } else {
        this.showMessage('You cannot save the solution shown!');
      }
    });

    const loadGame = this.#parent.querySelector("#btn-load");
    loadGame.addEventListener('click', () => {
      nonograms.soundPlay('click');
      this.showMessage('Loading Game');
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
      this.hideSolution;
    });

    const btnSound = this.#parent.querySelector("#btn-sound");
    btnSound.addEventListener('click', () => {
      btnSound.classList.toggle("sound-off");
      nonograms.soundPlay('click');
      nonograms.soundOnOffToggle; 
    });

    this.puzzle();
    this.fillPuzzleSelector();

    const btnScore = this.#parent.querySelector("#btn-score");
    btnScore.addEventListener('click', () => {
      nonograms.soundPlay('click');
      const scoreModal = this.#parent.querySelector("#score");
      const score = nonograms.sortResult(nonograms.loadResult());
      if (score) {
        score.forEach((record, row) => {
          console.log(record);
          Object.values(record).forEach((value, index) => {
            console.log(value, index);
            const cell = this.#parent.querySelector(`#score-${row + 1}-${index + 2}`);
            if (row % 2 === 0) cell.classList.add('score-cell-mark');
            if (index === 2) {
              const minutes = Math.floor(value / 60);
              const seconds = value % 60;
              cell.textContent = `${(minutes < 10 ? `0${minutes}` : minutes)} : ${(seconds < 10 ? `0${seconds}` : seconds)}`;
            } else {
              cell.textContent = value;
            }
          });
        });
      }
      scoreModal.classList.add('show');
    });

    const btnScoreX = this.#parent.querySelector("#score-x");
    btnScoreX.addEventListener('click', () => {
      nonograms.soundPlay('click');
      const scoreModal = this.#parent.querySelector("#score");
      scoreModal.classList.remove('show');
    });

    const scoreTable = this.#parent.querySelector("#score-grid");
    for (let row = 1; row < 6; row++ ) {
      for (let col = 1; col < 5; col++ ) {
        const scoreTableCell = this.createElement({
          tag: "div",
          id: `score-${row}-${col}`,
          text: col === 1 ? row : '',
          classes: ["score-cell"]
        });
        scoreTable.appendChild(scoreTableCell);
      }
    }

    const btnTheme = document.getElementById('btn-theme');
    btnTheme.addEventListener('click', () => {
      const root = document.documentElement;

      if (root.style.getPropertyValue('--background-color-body') === 'black') {
          root.style.setProperty('--line-color', 'blue');
          root.style.setProperty('--group-line-color', 'red');
          root.style.setProperty('--background-color-body', 'white');
          root.style.setProperty('--background-color-cells', 'bisque');
          root.style.setProperty('--background-color-hint', 'aquamarine');
          root.style.setProperty('--block-border-color', 'blue');
          root.style.setProperty('--font-color', 'black');

      } else {
          root.style.setProperty('--line-color', 'white');
          root.style.setProperty('--group-line-color', 'orange');
          root.style.setProperty('--background-color-body', 'black');
          root.style.setProperty('--background-color-cells', '#333');
          root.style.setProperty('--background-color-hint', '#555');
          root.style.setProperty('--block-border-color', 'white');
          root.style.setProperty('--font-color', 'white');
      }
    });

    const btnHint = this.#parent.querySelector("#btn-hint");
    btnHint.addEventListener('click', () => {
      nonograms.soundPlay('click');
      const cellsHint = this.#parent.querySelectorAll(".cell.solution");
      cellsHint.forEach((cell)=>{
        cell.classList.toggle("hint");
      });
    });

    console.log("loading of DOM completed");
  }

  get hideSolution(){
    const styleSheet = document.styleSheets[0];
      if (this.#solution) {
        styleSheet.deleteRule(0);
        styleSheet.deleteRule(0);
        this.#solution = false;
      }
    return this.#solution;
  }

  fillPuzzleSelector (){
    this.stopTimer();
    const selector = this.#parent.querySelector("#puzzle-selector");
    console.log(selector);
    selector.addEventListener('change', (events) => {
      console.log(events.currentTarget.value);
      nonograms.soundPlay('click');
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
    if (options.title) {
      element.setAttribute("title", options.title);
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
      // container.style.gridTemplateColumns = `1fr repeat(${colRow}, 1fr)`;
      container.style.gridTemplateColumns = `repeat(${colRow + 1}, 1fr)`;
      // container.style.gridTemplateRows = `min-content repeat(${colRow}, 1fr)`;
      
      const colLineNumbers = nonograms.getColLineNumbers; //upper numbers
      for(let colIndex = -1; colIndex < colRow; colIndex++){
        const element = this.createElement({ //create container with upper numbers
          tag: "div",
          id: `col-${colIndex}`,
          classes: ["col-cell"],
          text: colIndex >=0 ? colLineNumbers[colIndex].join('\n') : ''
        });
        if ((colIndex + 1) % 5 === 0) element.classList.add('vertical');
        container.appendChild(element); //add to DOM container with upper numbers
      }

      const rowLineNumbers = nonograms.getRowLineNumbers; //left numbers
      puzzle.data.forEach((row, rowIndex) => {
        // console.log(row);
        const element = this.createElement({  // create container with left numbers
          id: `row-${rowIndex}`, classes: ["row-cell"], text: rowLineNumbers[rowIndex].join(' | ')
        });
        if ((rowIndex + 1) % 5 === 0) element.classList.add('horizontal');
        container.appendChild(element); //add to DOM container with left numbers
      
        row.forEach((cell, colIndex) => {  // cells of puzzle
          // console.log(cell);
          const element = this.createElement({
            id: `cell-${rowIndex}/${colIndex}`,
            text: (cell === 1 ? "◉": ""),
            classes: (cell === 1 ? ["cell", "solution"] : ["cell"])
          });
          // console.log(nonograms.getUserCellState(rowIndex, colIndex));
          
          if (nonograms.getUserCellState(rowIndex, colIndex) === 1) element.classList.add('black');
          if (nonograms.getUserCellState(rowIndex, colIndex) === 0) element.classList.add('crossed', 'white');
          this.cellClick(element);
          if ((colIndex + 1) % 5 === 0) element.classList.add('vertical');
          if ((rowIndex + 1) % 5 === 0) element.classList.add('horizontal');
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
            nonograms.soundPlay('select');
            break;
          case null:
            element.classList.remove("white");
            element.classList.remove("crossed");
            element.classList.remove("black");
            nonograms.soundPlay('deselect');
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
            nonograms.soundPlay('select');
            break;

          case null:
            element.classList.remove("white");
            element.classList.remove("crossed");
            element.classList.remove("black");
            nonograms.soundPlay('deselect');
            break;
        }
        if(nonograms.checkPuzzle) this.showWin;
      }
    });
  }

  get showWin(){
    console.log("You Win!");
    
    nonograms.soundPlay('win');
    this.stopTimer(true);
    nonograms.freeze(true);
    const win = this.#parent.querySelector(".win");
    win.classList.add("show");
    const winMessage = this.#parent.querySelector("#win-message");
    winMessage.textContent = `Great! You have solved the nonogram in ${nonograms.getTime} seconds!`
    setTimeout(() => {
      win.style.transform = "translateY(-100%)";
    }, 10);
    nonograms.saveResult();
  }
  
  startTimer(){
    const timer = this.#parent.querySelector('#timer');
    if (!this.#timerID) {
      nonograms.initTimer();
      nonograms.soundPlay('start');
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

  showMessage(text){
    // nonograms.soundPlay('message');
    const message = this.#parent.querySelector("#message-text");
    message.textContent = text;
    const showMessage = this.#parent.querySelector("#message");
    showMessage.classList.add("show");
    

    setTimeout(() => {
      showMessage.style.opacity = 1;
      setTimeout(() => {
        showMessage.style.opacity = 0;
        setTimeout(() => {
          showMessage.classList.remove("show");
        }, 50);
      }, 1000);
    }, 50);
    nonograms.saveResult();
  }
  
}