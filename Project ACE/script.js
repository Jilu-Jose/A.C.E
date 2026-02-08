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
    
}