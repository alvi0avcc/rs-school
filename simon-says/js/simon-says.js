class Simon {
  constructor(parent) {
    this.parent = parent;
    this.state = 0; // if 1 - game started
    this.level = "easy";
    this.round = 1;
    this.countSymbols = 2; // 2 for round 1, +2 for each next round
    this.sequence = "";
    this.kbdNum = parent.querySelector("#kbd-num");
    this.kbdNum.classList.add("show");
    this.kbdSym = parent.querySelector("#kbd-sym");
  }

  start(){
    this.state = 1;
    this.newSequence;
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
    let count = 20;
    let sequence = "";
    for (let i = 0; i < count; i++) {
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
  AddKbdNum();
  AddKbdSym();
  const simon = new Simon(parent);

  parent.querySelector("#start").addEventListener('click', function (event) {
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
    console.log('кнопка:', event.key);
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


function AddKbdNum() {
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
      console.log('kbd-num-click=', events.target.id);
    });
  }
}

function AddKbdSym() {
  const kbdNum = document.querySelector("#kbd-sym");
  for (let i = 65; i <= 90; i++) {
    const btn = createElement({
      tag: "button",
      id: `btn-sym-${i}`,
      text: String.fromCharCode(i),
      classes: [],
    });
    kbdNum.append(btn);
    btn.addEventListener("click", (events) => {
      console.log('kbd-sum-click=', events.target.id);
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
