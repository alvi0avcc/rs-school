"use strict";

class Nonograms {
  #puzzle = null // current puzzle {}
  #userPuzzle = null // user puzzle [][]
  #level = "Easy"; // current selected level
  #puzzleList; // list of all puzzles
  #freezeClick = false;
  #startTime;
  #elapsedTime = 0;
  soundOn = true; //for all sound
  sounds = {}; //all sounds

  async init(){
    await this.loadPuzzleList();
    this.soundLoad;
    this.#level = "Easy";
    const puzzleName = this.getPuzzleListByLevel(this.#level)[0];
    await this.setPuzzle(puzzleName);
    this.freeze(false);
  }

  get soundOnOffToggle (){
    this.soundOn ? this.soundOn = false : this.soundOn = true;
  }

  saveGame(){
    const game = {};
    game.puzzle = this.#puzzle
    game.userPuzzle = this.#userPuzzle;
    game.level = this.#level;
    game.startTime = this.#startTime;
    game.elapsedTime = this.getTime;
    localStorage.setItem('game', JSON.stringify(game));
  }

  loadGame() {
    const savedGame = localStorage.getItem('game');
    if (savedGame) {
        const game = JSON.parse(savedGame);
        this.#puzzle = game.puzzle;
        this.#userPuzzle = game.userPuzzle;
        this.#level = game.level;
        this.#startTime = game.startTime;
        this.#elapsedTime = game.elapsedTime;
        this.freeze(false);
    } else {
        console.log(`You don't have any saved games`);
    }
  }

  saveResult(){
    const winGame = [
      {
      name: this.#puzzle.name,
      level: this.#level,
      time: this.getTime
      }
    ];

    const savedWinGame = this.loadResult();

    if (savedWinGame) {
      winGame.push(...savedWinGame);
      if (winGame.length > 5) winGame.pop();
    };
    
    localStorage.setItem('win-game', JSON.stringify(winGame));
  }

  loadResult(){
    const savedWinGame = localStorage.getItem('win-game');
    if (savedWinGame) {
      const result = JSON.parse(savedWinGame);
      return result;
    }
    console.log("record not saved");
    return false;
  }

  sortResult(resultList){
    if (resultList) {
      return resultList.sort((a, b) => a.time - b.time);
    }
    return false;
  }

  initTimer(seconds = 0){
    this.#startTime = Date.now() - seconds / 1000;
  }

  get getTime(){
    return Math.round((Date.now() - this.#startTime) / 1000) + this.#elapsedTime;
  }

  get getTimer(){
    const elapsedTime = this.getTime;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${(minutes < 10 ? `0${minutes}` : minutes)} : ${(seconds < 10 ? `0${seconds}` : seconds)}`;
  }

  setElapsedTime(elapsed = 0){
    this.#elapsedTime = elapsed;
  }

  freeze(state){
    this.#freezeClick = state;
  }

  get getFreeze(){
    return this.#freezeClick;
  }

  get getLevel(){
    return this.#level;
  }

  async setLevel(level){
    this.#level = level;
    const list = this.getPuzzleListByLevel(this.#level);
    await this.setPuzzle(list[0]);
    return list;
  }
    
  async setPuzzle(name){
    const response = await this.loadPuzzleByName(name);
    if (response) {
      this.#puzzle = response.puzzle;
      this.clearPuzzle;
      return this.#puzzle;
    } else {
      return false;
    }
  }

  get clearPuzzle(){
    if (this.#puzzle) {
      this.setElapsedTime();
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

  get getPuzzleListByCurrentLevel(){
    return this.#puzzleList[this.#level];
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
      return data;
    } catch (error) {
      console.error(`Error during loading puzzle - ${name}:`, error);
      return false;
    }
  }

  get checkPuzzle(){
    const puzzle = this.getPuzzleMatrix;
    console.log(puzzle);
    const userPuzzle = this.getUserPuzzle
    console.log(userPuzzle);

    for (let row = 0; row < puzzle.length; row++) {
      for (let col = 0; col < puzzle.length; col++) {
        let cell;
        userPuzzle[row][col] === 1 ? cell = 1 : cell = 0;
        if (puzzle[row][col] !== cell) return false;
      }
    }
    console.log("Puzzle solved !");
    
    return true;
  }

  get soundLoad(){
    const soundFiles = [
      'click',
      'select',
      'deselect',
      'start',
      'win',
      'restart',
      'random',
      'solution'
    ];
    soundFiles.forEach(sound => {
      this.sounds[sound] = {
      on: true,
      audio: new Audio(`./assets/sound/${sound}.ogg`)
      }
    });
  }

  soundPlay(soundName, stop = false, duration = 10){
    if (stop === true) {
      setTimeout(()=>{
        this.sounds[soundName].audio.pause();
        this.sounds[soundName].audio.currentTime = 0;
        console.log('pause');
      }, duration);
      
      return false;
    }

    if (this.soundOn && this.sounds[soundName].on) {
      this.sounds[soundName].audio.currentTime = 0;
      this.sounds[soundName].audio.play().catch(error => {
        console.error(`Audio playback error (${soundName}.ogg):`, error);
        return error;
      });
      return true;
    }
  }
}


const nonograms = new Nonograms();
export default nonograms;
