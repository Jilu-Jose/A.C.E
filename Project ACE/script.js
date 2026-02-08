let subs = JSON.parse(localStorage.getItem("subjects")) || [];
let task = JSON.parse(localStorage.getItem("tasks")) || [];

function loadData(){
    let substr = JSON.stringify(subs)
    localStorage.setItem("subjects", substr);
    let taskstr = JSON.stringify(task);
    localStorage.setItem("tasks", taskstr);
}

function upDash(){
    let sublen = document.getElementById("sub");
    sublen.innerText = subs.length;

    let tasklen = document.getElementById("tasks");
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
        ${sub.name}
        <button onclick="delSubs(${i})"> Delete</button>
        </li>
        `
    })
}


function handTask(){
    let tasklist = document.getElementById("tasklist");
    tasklist.innerHTML = "";
    task.forEach((t, i)=>{
        tasklist.innerHTML += `<li>
        
        </li>`
    })
}