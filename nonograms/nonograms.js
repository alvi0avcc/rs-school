class Nonograms {
  constructor() {
    
  }

  printAllPazl() { // for testing
    this.loadPazlList().then(responseList => {
        console.log(responseList.list);
        if (typeof responseList.list === 'object' && responseList.list !== null) {
            const loadPromises = [];
            for (const level in responseList.list) {
                if (Array.isArray(responseList.list[level])) {
                    responseList.list[level].forEach(name => {
                        loadPromises.push(
                            this.loadPazlByName(name).then(responsePazl => {
                                console.log(responsePazl.pazl);
                                console.table(responsePazl.pazl.data);
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


  async loadPazlList(){
    try {
      const response = await fetch(`./data/list.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP! ${response.status}`);
      }
      const data = await response.json();
      // console.table(data);
      return data;
    } catch (error) {
      console.error(`Error during loading list of pazl`, error);
      return false;
    }
  }

  async loadPazlByName(name) {
    try {
      const response = await fetch(`./data/${name}.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP! ${response.status}`);
      }
      const data = await response.json();
      // console.table(data);
      return data;
    } catch (error) {
      console.error(`Error during loading pazl - ${name}:`, error);
      return false;
    }
  }
}

const nonograms = new Nonograms();

nonograms.loadPazlList();
nonograms.loadPazlByName('x').then(response => console.table(response));
// nonograms.loadPazlByName('hash');
// nonograms.loadPazlByName('little-smile');
// nonograms.printAllPazl();