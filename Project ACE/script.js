let subs = JSON.parse(localStorage.getItem("subjects")) || []
let task = JSON.parse(localStorage.getItem("tasks")) || []
let sched = JSON.parse(localStorage.getItem("schedule")) || []

function loadData(){
    let substr = JSON.stringify(subs)
    localStorage.setItem("subjects", substr)

    let taskstr = JSON.stringify(task)
    localStorage.setItem("tasks", taskstr)

    let schedstr = JSON.stringify(sched)
    localStorage.setItem("schedule", schedstr)
}

function upDash(){
    let sublen = document.getElementById("sub")
    sublen.innerText = subs.length;

    let tasklen = document.getElementById("tasks")
    tasklen.innerText = task.length;

    let comp = task.filter(t => t.comp).length
    let comptask = document.getElementById("donetask")
    comptask.innerText = comp;
}

function handSub(){
    let sublist = document.getElementById("sublist");
    sublist.innerHTML= "";

    subs.forEach((sub, i)=>{
        sublist.innerHTML += `<li> 
        ${sub.name} (Priority: ${sub.priority})
        <button onclick="editSub(${i})">Edit</button>
        <button onclick="delSubs(${i})"> Delete</button>
        </li>
        `
    })
}

function editSub(index){
    let newname = prompt("Edit Subject: ", subs[index].name);
    let newprior = prompt("Edit Priority: ", subs[index].priority);

    if(newname){
        subs[index].name = newname;
        subs[index].priority = newprior;
        loadData()
        handSub();
        upDash();

    }
}


function handTask(){
    let tasklist = document.getElementById("tasklist");
    tasklist.innerHTML = "";
    task.forEach((t, i)=>{
        tasklist.innerHTML += `<li>
        ${t.name} - ${t.deadline}
        <button onclick="togComp(${i})">${t.completed ? "Undo" : "Done"}</button>
        <button onclick="delTasks(${i})">Delete</button>
        </li>`
    })
}

function addSub(){
    let name = document.getElementById("subname").value;
    let priority = document.getElementById("priority").value;
    
    subs.push({
        id: Date.now(),
        name
    })

    loadData();
    handSub();
    upDash();

    document.getElementById("subname").value="";
}

function delSubs(index){
    subs.splice(index, 1);
    loadData();
    handSub();
    upDash();
}

function addTasks(){
    let name = document.getElementById("taskname").value;
    let deadline = document.getElementById("taskdeadline").value;

    task.push({
        id: Date.now(),
        name, 
        deadline, 
        completed: false
    })

    loadData();
    handTask();
    upDash();

    document.getElementById("taskname").value = "";
    document.getElementById("taskdeadline").value="";

}


function delTasks(index){
    task.splice(index, 1);
    loadData();
    handTask();
    upDash();
}


function togComp(index){
    task[index].completed = !task[index].completed;
    loadData();
    handTask();
    upDash();
}

function resetData(){
    localStorage.clear();
    subs = [];
    task  =[];
    handSub();
    handTask();
    upDash();
}



handSub();
handTask();
upDash();
