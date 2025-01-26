"use strict";

import Page from "./page.js";
import Nonograms from "./nonograms.js";

function App(){

  const nonograms = new Nonograms();
  const page = new Page();

  page.loadDom();

  nonograms.loadPuzzleList();
  nonograms.loadPuzzleByName('x').then(response => console.table(response));
  nonograms.setPuzzle('x').then(() => console.log(nonograms.getPuzzle));

}

//start application
App();