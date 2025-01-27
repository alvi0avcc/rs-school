"use strict";

import Page from "./page.js";
import nonograms from "./nonograms.js";

function App(){

  const page = new Page();

  page.loadDom();

  nonograms.loadPuzzleList();
  nonograms.loadPuzzleByName('x').then(response => {
    console.table(response);
    nonograms.setPuzzle('x').then( ()=> {
      page.puzzle();
      nonograms.getRowLineNumbers;
    });
  });
  nonograms.setPuzzle('x').then(() => console.log(nonograms.getPuzzle));

}

//start application
App();