class Nonograms {
    #puzzle = null // current puzzle {}

  async setPuzzle(name){
    const response = await this.loadPuzzleByName(name);
    if (response) {
      // console.log(response.puzzle);
      this.#puzzle = response.puzzle;
      return true;
    } else {
      return false;
    }
  }

  get getPuzzle(){
    return this.#puzzle ? this.#puzzle : false;
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
      // console.table(data);
      return data;
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

nonograms.loadPuzzleList();
nonograms.loadPuzzleByName('x').then(response => console.table(response));
nonograms.setPuzzle('x').then(() => console.log(nonograms.getPuzzle));
// nonograms.loadPuzzleByName('hash');
// nonograms.loadPuzzleByName('little-smile');
// nonograms.printAllPuzzle();
console.log('current puzzle = ', nonograms.puzzle);