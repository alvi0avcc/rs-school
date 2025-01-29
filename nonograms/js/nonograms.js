"use strict";

class Nonograms {
  #puzzle = null // current puzzle {}
  #userPuzzle = null // user puzzle [][]
  #level = "Easy"; // current selected level
  #puzzleList; // list of all puzzles

  async init(){
    await this.loadPuzzleList();
    this.#level = "Easy";
    const puzzleName = this.getPuzzleListByLevel(this.#level)[0];
    await this.setPuzzle(puzzleName);
    // console.table(this.#puzzle);
  }
    
  async setPuzzle(name){
    const response = await this.loadPuzzleByName(name);
    if (response) {
      // console.log(response.puzzle);
      this.#puzzle = response.puzzle;
      this.clearPuzzle;
      return true;
    } else {
      return false;
    }
  }

  get clearPuzzle(){
    if (this.#puzzle) {
      const size = this.getPuzzleMatrix.length;
      this.#userPuzzle = Array.from({ length: size }, () => Array(size).fill(null));
      return this.#userPuzzle;
    }
    return false;
  }

  get getPuzzleListAll(){
    return this.#puzzleList;
  }

  getPuzzleListByLevel(level){
    return this.#puzzleList[level];
  }

  setUserCellState( row, col, state){
    this.#userPuzzle[row][col] = state;
    return this.#userPuzzle;
  }

  get getUserPuzzle(){
    return this.#userPuzzle;
  }

  getUserCellState(row, col){
    return this.#userPuzzle[row][col];
  }

  toggleUserCell(row, col, state){
    if (this.getUserCellState(row, col) !== state) {
      this.setUserCellState(row, col, state);
    } else {
      this.setUserCellState(row, col, null);
    }

    // console.log("toggleUserCell = ",this.getUserCellState(row, col))

    return this.getUserCellState(row, col);
  }

  get getPuzzle(){
    return this.#puzzle ? this.#puzzle : false;
  }

  get getPuzzleName(){
    return this.getPuzzle ? this.#puzzle.name : false;
  }

  get getPuzzleLevel(){
    return this.getPuzzle ? this.#puzzle.level : false;
  }

  get getPuzzleMatrix(){
    return this.getPuzzle ? this.#puzzle.data : false;
  }

  get getRowLineNumbers(){
    const matrix = this.getPuzzleMatrix;
    const result = [];
    for(let row = 0; row < matrix.length; row++) {
      const rowResult = [];
      let counter = 0;

      for (let col = 0; col < matrix.length; col++) {
        if (matrix[row][col] === 1){
          counter += 1;
        } else {
          if (counter > 0){
            rowResult.push(counter);
          }
          counter = 0;
        }
      }

      if (counter > 0) {
        rowResult.push(counter);
      }

      result.push(rowResult);
    }
    // console.log('counter = ',result);
    return result;
  }

  get getColLineNumbers() {
    const matrix = this.getPuzzleMatrix;
    const result = [];
    
    for (let col = 0; col < matrix.length; col++) {
        const colResult = [];
        let counter = 0;

        for (let row = 0; row < matrix.length; row++) {
            if (matrix[row][col] === 1) {
                counter += 1;
            } else {
                if (counter > 0) {
                    colResult.push(counter);
                }
                counter = 0;
            }
        }

        if (counter > 0) {
            colResult.push(counter);
        }

        result.push(colResult);
    }
    // console.log('counter = ',result);

    return result;
}

  
  printAllPuzzle() { // for testing
    this.loadPuzzleList().then(responseList => {
        console.log(responseList.list);
        if (typeof responseList.list === 'object' && responseList.list !== null) {
            const loadPromises = [];
            for (const level in responseList.list) {
                if (Array.isArray(responseList.list[level])) {
                    responseList.list[level].forEach(name => {
                        loadPromises.push(
                            this.loadPuzzleByName(name).then(responsePuzzle => {
                                console.log(responsePuzzle.puzzle);
                                console.table(responsePuzzle.puzzle.data);
                            }).catch(error => {
                                console.error(`Error loading puzzle ${name}:`, error);
                            })
                        );
                    });
                } else {
                    console.error(`The value for ${level} is not an array:`, responseList.list[level]);
                }
            }
            return Promise.all(loadPromises);
        } else {
            console.error('responseList.list is not an object:', responseList.list);
        }
    }).catch(error => {
        console.error('Error loading puzzle list:', error);
    });
}


  async loadPuzzleList(){
    try {
      const response = await fetch(`./data/list.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP! ${response.status}`);
      }
      const data = await response.json();
      this.#puzzleList = data.list;
      console.table( this.#puzzleList);
      console.log(this.getPuzzleListByLevel('Easy')); //for testing
      return this.#puzzleList;
    } catch (error) {
      console.error(`Error during loading list of puzzles`, error);
      return false;
    }
  }

  async loadPuzzleByName(name) {
    try {
      const response = await fetch(`./data/${name}.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP! ${response.status}`);
      }
      const data = await response.json();
      // console.table(data);
      return data;
    } catch (error) {
      console.error(`Error during loading puzzle - ${name}:`, error);
      return false;
    }
  }
}


const nonograms = new Nonograms();
export default nonograms;
