class Nonograms {
  constructor() {
    
  }
  async loadPazlList(){
    try {
      const response = await fetch(`./data/list.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP! ${response.status}`);
      }
      const data = await response.json();
      console.log('list - ',data);
    } catch (error) {
      console.error(`Error during loading list of pazls`, error);
    }
  }

  async loadPazlByName(name) {
    try {
      const response = await fetch(`./data/${name}.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP! ${response.status}`);
      }
      const data = await response.json();
      console.log('pazl - ',data);
    } catch (error) {
      console.error(`Error during loading pazl - ${name}:`, error);
    }
  }
}

const nonograms = new Nonograms();

nonograms.loadPazlList();
nonograms.loadPazlByName('x');
nonograms.loadPazlByName('hash');
nonograms.loadPazlByName('little-smile');