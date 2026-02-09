let subs = JSON.parse(localStorage.getItem("subjects")) || []
let task = JSON.parse(localStorage.getItem("tasks")) || []
let sched = JSON.parse(localStorage.getItem("schedule")) || []


function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    
    const btn = document.querySelector('.theme-toggle');
    btn.textContent = newTheme === 'dark' ? 'Dark' : 'Light';
}


function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
    }
}

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

    let comp = task.filter(t => t.completed).length
    let comptask = document.getElementById("donetask")
    comptask.innerText = comp;

    
    updateProgress();
}

function updateProgress() {
    
    const totalTasks = task.length;
    const completedTasks = task.filter(t => t.completed).length;
    const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('task-percent').textContent = taskPercent + '%';
    document.getElementById('task-progress').style.width = taskPercent + '%';

    
    const totalSlots = 35; 
    const scheduledSlots = sched.length;
    const studyPercent = Math.min(Math.round((scheduledSlots / totalSlots) * 100), 100);
    
    document.getElementById('study-percent').textContent = studyPercent + '%';
    document.getElementById('study-progress').style.width = studyPercent + '%';
}

function handSub(){
    let sublist = document.getElementById("sublist");
    sublist.innerHTML= "";

    subs.forEach((sub, i)=>{
        const priorityClass = sub.priority === 'High' ? 'high' : sub.priority === 'Medium' ? 'med' : 'low';
        sublist.innerHTML += `<li> 
        <span>${sub.name} <small style="color: var(--text-secondary);">(${sub.priority})</small></span>
        <div>
        <button onclick="editSub(${i})" class="btn-primary">Edit</button>
        <button onclick="delSubs(${i})" class="btn-danger">Delete</button>
        </div>
        </li>
        `
    })
}

function editSub(index){
    let newname = prompt("Edit Subject: ", subs[index].name);
    let newprior = prompt("Edit Priority: ", subs[index].priority);

    if(newname){
        subs[index].name = newname;
        subs[index].priority = newprior || subs[index].priority;
        loadData()
        handSub();
        upDash();
    }
}

function handTask(){
    let tasklist = document.getElementById("tasklist");
    tasklist.innerHTML = "";
    task.forEach((t, i)=>{
        const statusStyle = t.completed ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
        tasklist.innerHTML += `<li ${statusStyle}>
        <span>${t.name} <small style="color: var(--text-secondary);">${t.deadline}</small></span>
        <div>
            <button onclick="togComp(${i})" class="${t.completed ? 'btn-primary' : 'btn-success'}">${t.completed ? "Undo" : "Done"}</button>
            <button onclick="delTasks(${i})" class="btn-danger">Delete</button>
        </div>
        </li>`
    })
}

function handSched(){
    let li = document.getElementById("schedlist");
    li.innerHTML = "";
    sched.forEach((s, i)=>{
        li.innerHTML += `<li>
        <span>${s.day}: ${s.st} - ${s.end} <small style="color: var(--text-secondary);">(${s.subj})</small></span>
        <button onclick="delSched(${i})" class="btn-danger">Delete</button>
        </li>`;
    })
}

function delSched(index){
    sched.splice(index, 1);
    loadData();
    handSched()
    upDash()
}

function addSub(){
    let name = document.getElementById("subname").value
    let priority = document.getElementById("priority").value
    
    if(!name) {
        alert("Please enter subject name");
        return;
    }

    subs.push({
        id: Date.now(),
        name,
        priority
    })

    loadData();
    handSub()
    upDash()

    document.getElementById("subname").value=""
}

function delSubs(index){
    subs.splice(index, 1);
    loadData()
    handSub()
    upDash();
}

function addTasks(){
    let name = document.getElementById("taskname").value;
    let deadline = document.getElementById("taskdeadline").value

    if(!name || !deadline) {
        alert("Please enter task name and deadline")
        return;
    }

    task.push({
        id: Date.now(),
        name, 
        deadline, 
        completed: false
    })

    loadData();
    handTask()
    upDash()

    document.getElementById("taskname").value = "";
    document.getElementById("taskdeadline").value="";
}

function delTasks(index){
    task.splice(index, 1);
    loadData();
    handTask();
    upDash();
}

function addSched(){
    let day = document.getElementById("day").value
    let st = document.getElementById("sttime").value
    let end = document.getElementById("endtime").value
    let subj = document.getElementById("schedsub").value

    sched.push({
        id: Date.now(),
        day, st, end, subj
    })

    loadData()
    handSched();
    upDash();

    document.getElementById("sttime").value = ""
    document.getElementById("endtime").value = ""
    document.getElementById("schedsub").value = ""
}

function togComp(index){
    task[index].completed = !task[index].completed
    loadData()
    handTask()
    upDash()
}

function resetData(){
    if(confirm("Are you sure you want to reset all data? This cannot be undone.")) {
        localStorage.clear()
        subs = []
        task = []
        sched = []
        handSub()
        handTask()
        handSched()
        upDash()
        loadTheme()
    }
}

function expData(){
    let data = {
        subjects: subs,
        tasks: task,
        schedule: sched
    }

    let bl = new Blob([JSON.stringify(data, null, 2)],{type: "application/json"})
    let link = document.createElement("a")
    link.href = URL.createObjectURL(bl)
    link.download = "ACE_data.json"
    link.click()
}


window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    handSub();
    handTask()
    handSched()
    upDash();
});