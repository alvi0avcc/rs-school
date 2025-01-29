"use strict";

import Page from "./page.js";

function App(){
  const page = new Page();
    // TODO add initial state before loaded DOM
    
    page.init().then(() => {
      // TODO remove initial state after loading DOM

    });
}

//start application
App();