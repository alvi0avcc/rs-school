class Simon {
  constructor(parent) {
    this.parent = parent;
    this.state = false; // if true - game started
    this.level = "easy";
    this.round = 1;
    this.countSymbols = 10; // 2 for round 1, +2 for each next round
    this.sequence = "";
    this.countSequence = 0;
    this.kbdNum = parent.querySelector("#kbd-num");
    this.kbdNum.classList.add("show");
    this.kbdSym = parent.querySelector("#kbd-sym");
  }

  get getState(){
    return this.state;
  }

  start(){ // start game & init initial state
    this.state = true;
    this.round = 1;
    // this.countSymbols = 2;
    this.newSequence;
  }

  checkSymbol(symbol){
    if (!this.state) return false;
    if (symbol.toUpperCase() === this.sequence[this.countSequence]) {
      console.log("OK");
      if (this.sequence[this.countSequence + 1]) {
        console.log('next symbol=',this.sequence[this.countSequence + 1]);
      } else console.log('Sequence finished');
      
      this.countSequence++;
      return true;
    } else {
      console.error("Error");
    }
    
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
    console.log('newSequence=',sequence);
    
    return this.sequence;
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
  AddKbdNum(simon);
  AddKbdSym(simon);

  parent.querySelector("#start").addEventListener('click', function () {
    console.log('start click');
    simon.start();
  });

  parent.querySelector("#level-select").addEventListener('click', function (event) {
    console.log('level-select click', event.target);
    const levelSelector = parent.querySelectorAll('[name="level"]');
    console.log('levelSelector=',levelSelector);
    levelSelector.forEach((el)=>{
      if (el.checked) {
        console.log('el=',el.checked);
        console.log('el=',el.id);
        simon.setLevel = el.id;
        console.log('simon level=',simon.getLevel);
      }
    });
  });

  document.addEventListener('keyup', function (event) {
    if (simon.getState) {
      console.log('кнопка:', event.key);
      simon.checkSymbol(event.key);
    }
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
      id: `btn-num-${i}`,
      text: i,
      classes: [],
    });
    kbdNum.append(btn);
    btn.addEventListener("click", (events) => {
      // console.log('kbd-num-click=', events.target.id);
      // console.log(events.target.id.slice(-1));
      if (simon.getState) simon.checkSymbol(events.target.id.slice(-1));
    });
  }
}

function AddKbdSym(simon) {
  const kbdNum = document.querySelector("#kbd-sym");
  for (let i = 65; i <= 90; i++) {
    const btn = createElement({
      tag: "button",
      id: `btn-sym-${String.fromCharCode(i)}`,
      text: String.fromCharCode(i),
      classes: [],
    });
    kbdNum.append(btn);
    btn.addEventListener("click", (events) => {
      // console.log('kbd-sum-click=', events.target.id);
      // console.log(events.target.id.slice(-1));
      if (simon.getState) simon.checkSymbol(events.target.id.slice(-1));
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
