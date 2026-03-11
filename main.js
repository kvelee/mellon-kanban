// Dummy data
// We have 3 objects one for each column/status
addEventListener("DOMContentLoaded", () => {

let toDoItems = JSON.parse(localStorage.getItem("to_do")) ===null ? localStorage.getItem("to_do") : [];
let inProgressItems = localStorage.getItem("in_progress") == [] ? localStorage.getItem("in_progress") : [];
let doneItems = localStorage.getItem("done") == [] ? localStorage.getItem("done") : [];

localStorage.setItem("to_do",JSON.stringify(toDoItems));
localStorage.setItem("in_progress",JSON.stringify(inProgressItems));
localStorage.setItem("done",JSON.stringify(doneItems));

const user = { username: "whoami", password: "passowrddddd"};

localStorage.setItem("user-stringified",JSON.stringify(user));


// ============== Setting up the drag-ability ======================

document.getElementById("todo").ondragover=allowDrop;
document.getElementById("todo").ondragleave=dragLeave;
document.getElementById("todo").ondrop=drop;

document.getElementById("inprogress").ondragover=allowDrop;
document.getElementById("inprogress").ondragleave=dragLeave;
document.getElementById("inprogress").ondrop=drop;

document.getElementById("done").ondragover=allowDrop;
document.getElementById("done").ondragleave=dragLeave;
document.getElementById("done").ondrop=drop;

// =================================================================

let test = "";
let i=0;

// Add the To-Do Items
for( let task of toDoItems) {
    var temp = "<div id=\"todo"+(i++)+"\" class=\"item\"> <div>" + task.name + "</div> <button class=\"arrow\"> >>> </button> </div>";
    test += (temp);
}

document.getElementById("todo-list").innerHTML=test;

test="";
i=0;

// Add the In-Progress Items
for( let task of inProgressItems) {
    var temp = "<div  id=\"inp"+(i++)+"\"class=\"item\"> <div>" + task.name + "</div> <button class=\"arrow\"> >>> </button> </div>";
    test += (temp);
}

document.getElementById("inprogress-list").innerHTML=test;

test="";
i=0;

// Add the Done Items
for( let task of doneItems) {
    var temp = "<div id=\"done"+(i++)+"\" class=\"item\"  style=\"justify-content: space-evenly;\" > <div>" + task.name + "</div>  </div>";
    test += (temp);
}

document.getElementById("done-list").innerHTML=test;


//======== Adding More Tasks =========

document.getElementById("add-button").addEventListener("click", addTask);


function addTask() {
    let name;
    
    alert(name=prompt("What is the task?", "New Task"));

    if(!name) return;

    const node = document.createElement("div");
    node.className="item";
    node.id = "todo" + toDoItems.length;
    node.draggable ="true";
    node.ondragstart=drag;
    const text = document.createTextNode(name);
    node.appendChild(text);
    document.getElementById("todo-list").appendChild(node);

    //== Add it to the table =
    toDoItems.push(name);
    //===

    const button_node = document.createElement("button");
    button_node.className="arrow";
    const button_text = document.createTextNode(">>>");
    button_node.appendChild(button_text);
    document.getElementById(node.id).appendChild(button_node).addEventListener('click', moveTask);

    localStorage.setItem("to_do",JSON.stringify(toDoItems));
    localStorage.setItem("in_progress",JSON.stringify(inProgressItems));
    localStorage.setItem("done",JSON.stringify(doneItems));
}

//====================================

//=========== Move Tasks =============

var inputElements = document.querySelectorAll('.arrow');
for(var it = 0, len = inputElements.length ; it < len ; it++) {
    inputElements[it].addEventListener('click', moveTask);
}


function moveTask(event) {
    let n = this.closest(".item").id;
    let node = document.getElementById(n);

    let listId = this.closest(".list").id;

    switch (listId) {
        case "todo":
            document.getElementById("inprogress-list").appendChild(node);

            break;
        case "inprogress":
            node.lastChild.remove();
            document.getElementById("done-list").appendChild(node).style.justifyContent="space-evenly";
            break;
        default:
            console.log("Uknown list to move from!");
            break;
    }

    localStorage.setItem("to_do",JSON.stringify(toDoItems));
    localStorage.setItem("in_progress",JSON.stringify(inProgressItems));
    localStorage.setItem("done",JSON.stringify(doneItems));
}



function allowDrop(ev) {
  ev.preventDefault();
}

function dragLeave(ev) {
  ev.preventDefault();
}


function drag(ev) {

  ev.dataTransfer.dropEffect = "move";

  ev.dataTransfer.setData("text",ev.target.id);

}

function drop(ev) {
  ev.preventDefault();
  dragLeave(ev);
  const data = ev.dataTransfer.getData("text");
  if (ev.target.id==="done-list") {
    document.getElementById(data).lastChild.remove()
    ev.target.appendChild(document.getElementById(data)).style.justifyContent="space-evenly";

  }
  else {
        ev.target.appendChild(document.getElementById(data)).style.justifyContent="space-between";
    if (document.getElementById(data).lastChild.className != "arrow") {
        const button_node = document.createElement("button");
        button_node.className="arrow";
        const button_text = document.createTextNode(">>>");
        button_node.appendChild(button_text);

        ev.target.lastChild.appendChild(button_node);
    }
  }

};

//====================================

// ==== Fetching configuration ====

fetch("config.json").then(res => res.json()).then(
    ret => {document.body.style.backgroundColor = ret.background_color;}
)

// ====================================

function updateLocalStorage() {
    localStorage.setItem("to_do", JSON.stringify(toDoItems));
    localStorage.setItem("in_progress", JSON.stringify(inProgressItems));
    localStorage.setItem("done", JSON.stringify(doneItems));
}

function populateFromLocalStorage() {
    // 1. Διάβασμα των δεδομένων (αν δεν υπάρχουν, βάλε άδειο array)
    toDoItems = JSON.parse(localStorage.getItem("to_do")) || [];
    inProgressItems = JSON.parse(localStorage.getItem("in_progress")) || [];
    doneItems = JSON.parse(localStorage.getItem("done")) || [];

    // 2. Σχεδιασμός των To-Do items
    toDoItems.forEach((taskName, index) => {
        // Εδώ χρησιμοποιείς τη λογική που έχεις στο addTask:
        // document.createElement("div"), προσθήκη κειμένου, id, draggable κλπ.
        // Και τέλος: document.getElementById("todo-list").appendChild(node);
    });

    // 3. Επανάληψη της ίδιας διαδικασίας για το inProgressItems και το doneItems
    // (Φροντίζοντας στο doneItems να μην βάζεις το κουμπί arrow)
}

})
