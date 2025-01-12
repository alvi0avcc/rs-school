class Simon {
  constructor(parent) {
    this.parent = parent;
    this.state = false; // if true - game started
    this.level = "easy";
    this.round = 1;
    this.countSymbols = 2; // 2 for round 1, +2 for each next round
    this.sequence = "";
    this.memorySequence = "";
    this.countSequence = 0;
    this.pressedKeys = parent.querySelector("#pressed-keys");
    // this.memoryKeys = parent.querySelector("#memory-keys");
    this.kbdNum = parent.querySelector("#kbd-num");
    this.kbdNum.classList.add("show");
    this.kbdSym = parent.querySelector("#kbd-sym");
    this.levelSelector = parent.querySelector("#level-select");
    this.levelSelected = {
      "easy" : parent.querySelector("#easy"),
      "medium" : parent.querySelector("#medium"),
      "hard" : parent.querySelector("#hard")
    };
    this.levelLegend = parent.querySelector("#legend");
    this.startBtn = parent.querySelector("#start");
    this.repeatBtn = parent.querySelector("#repeat");
    this.nextBtn = parent.querySelector("#next");
    this.newBtn = parent.querySelector("#new");
    this.roundLabel = parent.querySelector("#round");
  }

  get getState(){
    return this.state;
  }

  get init(){ // init initial state
    this.state = false;
    this.round = 1;
    this.countSymbols = 2;
    this.sequence = "";
    this.memorySequence = "";
    this.levelLegend.textContent = "Select Level";
    this.repeatBtn.disabled = false;
  }

  get start(){ // start game on current level
    this.state = true;
    // this.countSymbols = 2;
    this.levelSelector.setAttribute("disabled", "");
    for (const key in this.levelSelected) {
      if (this.levelSelected[key].checked) {
        this.levelLegend.textContent = key;
      }
    }
    this.startBtn.classList.remove("show");
    this.roundLabel.classList.add("show");
    this.roundLabel.textContent = "Round " + this.round + " of 5";
    this.pressedKeys.classList.add("show");
    this.pressedKeys.textContent = "Remember";

    this.newSequence;
    return "start current level";
  }

  get nextRound(){
    if (this.round < 6) {
      this.round++;
      this.countSymbols += 2;
      this.roundLabel.textContent = "Round " + this.round;
      this.pressedKeys.textContent = "Remember";
      this.nextBtn.setAttribute("disabled", "");
      this.start;
    }
    return this.round;
  }

  checkSymbol(symbol){ //check by symbol
    if (!this.getState) return false;
    if (!this.symbolFilter(symbol)) return false;
    if (symbol.toUpperCase() === this.sequence[this.countSequence]) {
      console.log("OK");
      if (this.sequence[this.countSequence + 1]) {
        console.log('next symbol=',this.sequence[this.countSequence + 1]);
      } else console.log('Sequence finished');
      
      this.countSequence++;
      return true;
    } else {
      console.log("Incorrect symbol");
    }
    
    return false;
  }

  memorySymbol(symbol){
    if (!this.getState) return false;
    if (!this.symbolFilter(symbol)) return false;
    if (this.sequence.length > this.memorySequence.length) {
      this.pressedBtn(symbol);
      this.memorySequence += symbol.toUpperCase();
      this.pressedKeys.textContent = this.memorySequence;
      if (this.sequence.length === this.memorySequence.length) {
        // this.state = false;
        if (this.checkSequence){
          this.pressedKeys.textContent = "Correct";
          // this.memoryKeys.textContent = `Correct -> ${this.sequence} <- Correct`;
          this.nextBtn.removeAttribute("disabled");
        } else {
          this.pressedKeys.textContent = "Error";
          // this.memoryKeys.textContent = `Error -> ${this.sequence} <- Error`;
        }
        this.memorySequence = "";
        if (this.round === 5) {
          this.nextBtn.classList.remove("show");
          // TODO - hide button repeat after win in all round
        }
        return true;
      }
    }
    return false;
  }

  get checkSequence(){ //check by all sequence
    console.log('checking');
    if (this.sequence === this.memorySequence)
    {
      console.log('checking - OK');
      this.nextBtn.classList.add("show");
      return true;
    }
    console.log('checking - FALSE');
    return false;
  }

  symbolFilter(symbol){
    const regExpNum = /^[0-9]$/;
    const regExpSym = /^[a-zA-Z]$/;
    const regExpAll = /^[0-9a-zA-Z]$/;
    if (this.getLevel === 'easy') return regExpNum.test(symbol);
    if (this.getLevel === 'medium') return regExpSym.test(symbol);
    if (this.getLevel === 'hard') return regExpAll.test(symbol);
    
    return false;
  }

  get getLevel(){
    return this.level;
  }

  set setLevel(data){
    console.log(this.kbdNum);
    
    this.level = data;
    switch (data) {
      case "easy":
        this.kbdNum.classList.add("show");
        this.kbdSym.classList.remove("show");
        break;

      case "medium":
        this.kbdNum.classList.remove("show");
        this.kbdSym.classList.add("show");
        break;

      case "hard":
        this.kbdNum.classList.add("show");
        this.kbdSym.classList.add("show");
        break;
    
      default:
        break;
    }
  }

  get getSequence() {
    return this.sequence;
  }

  get newSequence() {
    this.state = false;// interface ignore user
    this.countSequence = 0;
    let sequence = "";
    for (let i = 0; i < this.countSymbols; i++) {
      switch (this.getLevel) {
        case "easy": // only number
          sequence += Math.round(Math.random() * 9);
          break;
        case "medium": // only symbols
          sequence += String.fromCharCode(Math.round(Math.random() * 25) + 65);
          break;
        case "hard": // numbers + symbols
          if (Math.random() < 0.5) {
            sequence += Math.round(Math.random() * 9);
          } else {
            sequence += String.fromCharCode(Math.round(Math.random() * 25) + 65);
          }
          break;
        default:
          break;
      }
    }
    this.sequence = sequence;

    let index = 0;
    const delay = 800;
    function displayNextCharacter() { //display next symbol in sequence with delay
      if (index < sequence.length) {
        // console.log(sequence[index]);
        const btn = document.body.querySelector(`#btn-${sequence[index]}`);
        btn.classList.toggle('virtual-press');
        setTimeout(displayNextCharacter, delay);
        index++;
        setTimeout(() => (btn.classList.toggle('virtual-press')), delay - 200);
      }
    }
    setTimeout(() => {
      this.repeatBtn.classList.add("show");
      this.newBtn.classList.add("show");
      // this.pressedKeys.classList.add("show");
      this.state = true; // return normal state for interface
      this.pressedKeys.textContent = "Type in what You remember";
    }, sequence.length * delay);
    displayNextCharacter();

    console.log('newSequence=',sequence);
    return this.sequence;
  }

  get repeatSequence(){
    let index = 0;
    const delay = 800;
    const sequence = this.sequence;
    function displayNextCharacter() { //display next symbol in sequence with delay
      if (index < sequence.length) {
        const btn = document.body.querySelector(`#btn-${sequence[index]}`);
        btn.classList.toggle('virtual-press');
        setTimeout(displayNextCharacter, delay);
        index++;
        setTimeout(() => (btn.classList.toggle('virtual-press')), delay - 200);
      }
    }
    setTimeout(() => {
      this.repeatBtn.classList.add("show");
      this.newBtn.classList.add("show");
      this.state = true; // return normal state for interface
      this.pressedKeys.textContent = "Type in what You remember";
    }, sequence.length * delay);
    displayNextCharacter();

    return this.sequence;
  }

  get repeatSequenceAgain(){
    this.repeatBtn.disabled = true;

    const delay = 800;

    function sleep(ms) {
         return new Promise(resolve => setTimeout(resolve, ms));
      }
      
    async function displayNextCharacter(sequence) {
      for (var index = 0; index < sequence.length; index++) {
        const btn = document.body.querySelector(`#btn-${sequence[index]}`);
        btn.classList.toggle('virtual-press');
        await sleep(delay);
        btn.classList.toggle('virtual-press');
      }
    }
    
    displayNextCharacter(this.sequence);

    return this.sequence;
  }

  pressedBtn(symbol){
    console.log("btn = ", symbol);
    const btn = document.body.querySelector(`#btn-${symbol.toUpperCase()}`);
      btn.classList.add('virtual-press');
      setTimeout(() => {
        btn.classList.remove('virtual-press');
      }, 200);
  }
}

function createElement(options) {
  // Default values
  const { tag = "div", text = "", parent, classes = [] } = options;

  const element = document.createElement(tag);
  element.textContent = text;

  // Adding classes if provided
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

  // Adding the element to the parent element if necessary
  if (parent != null) {
    parent.appendChild(element);
  }

  return element; // Returning the created element
}

function App(parent, elements) {
  console.log(elements);
  Dom(parent, elements);
  const simon = new Simon(parent);
  simon.init;
  AddKbdNum(simon);
  AddKbdSym(simon);

  parent.querySelector("#start").addEventListener('click', function () {
    console.log('start click');
    simon.start;
  });

  parent.querySelector("#level-select").addEventListener('click', function (event) {
    // console.log('level-select click', event.target);
    for (const key in simon.levelSelected) {
      if (simon.levelSelected[key].checked) simon.setLevel = key;
    }
  });

  document.addEventListener('keyup', function (event) {
    if (simon.getState) {
      // console.log('кнопка:', event.key);
      // simon.checkSymbol(event.key);
      simon.memorySymbol(event.key);
    }
  });

  simon.nextBtn.addEventListener('click', function () {
      console.log("Round = ",simon.nextRound);
  });

  simon.newBtn.addEventListener('click', function () {
    if (simon.state) {
      console.log("new game");
      simon.newBtn.classList.remove("show");
      simon.repeatBtn.classList.remove("show");
      simon.nextBtn.classList.remove("show");
      simon.startBtn.classList.add("show");
      simon.levelSelector.removeAttribute("disabled");
      simon.roundLabel.classList.remove("show");
      simon.pressedKeys.classList.remove("show");
      simon.init;
      // simon.start;
    }
  });

  simon.repeatBtn.addEventListener('click', function () {
      console.log("repeat");
      console.log(simon.repeatSequenceAgain);
  });

}

function Dom(parent, elements) {
  console.log(elements);
  elements.forEach(
    (el) => {
      console.log('el=', el);
      const node = createElement(el);
      console.log(node);

      parent.append(node);
      if (el.children) Dom(node, el.children);

    }
  );
}


function AddKbdNum(simon) {
  const kbdNum = document.querySelector("#kbd-num");
  for (let i = 0; i < 10; i++) {
    const btn = createElement({
      tag: "button",
      id: `btn-${i}`,
      text: i,
      classes: ["kbd-btn"],
    });
    kbdNum.append(btn);
    btn.addEventListener("click", (events) => {
      // console.log('kbd-num-click=', events.target.id);
      // console.log(events.target.id.slice(-1));
      // if (simon.getState) simon.checkSymbol(events.target.id.slice(-1));
      if (simon.getState) simon.memorySymbol(events.target.id.slice(-1));
    });
  }
}

function AddKbdSym(simon) {
  const kbdNum = document.querySelector("#kbd-sym");
  for (let i = 65; i <= 90; i++) {
    const btn = createElement({
      tag: "button",
      id: `btn-${String.fromCharCode(i)}`,
      text: String.fromCharCode(i),
      classes: ["kbd-btn"],
    });
    kbdNum.append(btn);
    btn.addEventListener("click", (events) => {
      // console.log('kbd-sum-click=', events.target.id);
      // console.log(events.target.id.slice(-1));
      // if (simon.getState) simon.checkSymbol(events.target.id.slice(-1));
      if (simon.getState) simon.memorySymbol(events.target.id.slice(-1));
    });
  }
}

fetch("./js/dom.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    console.log(response);
    App(document.body, response.dom);
  });
