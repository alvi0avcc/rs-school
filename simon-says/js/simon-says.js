
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


// const buttonStart = createElement({
//   tag: "button",
//   text: "Start",
//   classes: ["btn-start"],
// });
// buttonStart.addEventListener("click", () => {
//   paragraphElement.classList.toggle("content--hidden");
// });

// const levelSelect = createElement({
//   tag: "button",
//   text: "Start",
//   classes: ["btn-start"],
// });


function App(parent, elements){
  console.log(elements);

  elements.forEach(
    (el) => {
      console.log('el=',el);
      const node = createElement(el);
      console.log(node);
      
      parent.append(node);
      if(el.children) App(node, el.children);

    }
  );

}

fetch("./js/dom.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    console.log(response);
    App(document.body, response.dom);
  });
