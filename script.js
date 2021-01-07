const dbOut = "http://localhost:3000/outgoings"
const dbInc = "http://localhost:3000/incomings"
const checkbox = document.getElementById("box")
const label = document.getElementById("typeLabel")
const outgoingList = document.getElementById("outgoings")
const incList = document.getElementById("incomings")

function load(callback, db) {
    var xh = new XMLHttpRequest();
    xh.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(xh.responseText)
            
        }
    };
    xh.open("GET", db, true)
    //xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xh.send() 
}

function send(id, title, time, db) {
    var data = {id: id, title: title, time: time, complete: false}
    var xh = new XMLHttpRequest();
    xh.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            //document.getElementById("root").innerHTML = this.responseText;
            //alert("Sucess")
            reload()
        }
    };
    xh.open("POST", db, true)
    xh.setRequestHeader("Content-type", "application/json")
    xh.send(JSON.stringify(data))
    
}

function modify(id,db, param) {
    var data = {complete: param}
    var xh = new XMLHttpRequest();
    xh.onreadystatechange = function () {
        if(this.readyState == 4){
            reload()
        }
    }
    xh.open("PATCH", db+"/"+id, true)
    xh.setRequestHeader("Content-type", "application/json")
    xh.send(JSON.stringify(data))
}

function display(result) {
    var data = result
    var objects = JSON.parse(data)
    var obj = ""
    var classType = "<li class='outgoing'"
    var classTypeComp = "<li class='outgoing-complete'"
    if (objects.length == 0) {
        obj = "No outgoing trips to show"
    } else {
        objects.forEach(outgoing => {
            if (outgoing.complete == true) {
                obj += classTypeComp
            } else {
                obj += classType
            }
            obj += " id=" + outgoing.id+">"+ outgoing.title + " "+outgoing.time + "<button class='done'>Done</button>" + "</li>"
        });
    }
    
    document.getElementById("outgoings").innerHTML = obj
}

function displayInc(result) {
    var data = result
    var objects = JSON.parse(data)
    var obj = ""
    var classType = "<li class='incoming'" 
    var classTypeComp = "<li class='incoming-complete'"
    if (objects.length == 0) {
        obj = "No incoming trips to show"
    } else {
        objects.forEach(incoming => {
            if (incoming.complete == true) {
                obj += classTypeComp
            } else {
                obj += classType
            }
            obj += " id=" + incoming.id+">"+ incoming.title + " "+incoming.time + "<button class='done'>Done</button>" + "</li>"
        });
    }
    
    document.getElementById("incomings").innerHTML = obj

}

function add() {
    var id = ""
    var db = ""
    var title = ""
    var time = ""
    if (label.textContent == "Outgoing") {
        db = dbOut
        id = document.getElementById("outgoings").lastChild.id
        id = parseInt(id) + 1
    } else {
        db = dbInc
        id = document.getElementById("incomings").lastChild.id
        id = parseFloat(id) + 1
    }
    title = document.getElementById("place").value
    time = document.getElementById("time").value
    send(id, title, time, db)
    document.getElementById("time").value = ""
    document.getElementById("place").value = ""

}

function checkboxFun() {
    checkbox.addEventListener('change', e => {
        e.preventDefault()
        if (checkbox.checked) {
            label.textContent = "Incoming"
        } else {
            label.textContent = "Outgoing"
        }
    })
}

function toggleButtonInc() {
    incList.addEventListener('click', event => {
        if (event.target.className == 'done') {
            var param
            if (event.target.parentElement.className == "incoming") {
                param = true
            } else {
                param = false

            }
            modify(event.target.parentElement.id, dbInc, param)
        }
    })
}

function toggleButtonOut() {
    outgoingList.addEventListener('click', event => {
        if (event.target.className == 'done') {
            var param
            if (event.target.parentElement.className == "outgoing") {
                param = true
            } else {
                param = false

            }
            modify(event.target.parentElement.id, dbOut, param)
        }
    })
}

function reload() {
    load(display, dbOut);
    load(displayInc, dbInc);
}

window.addEventListener('load', event => {
    console.log("Beginning");
    checkboxFun()
    toggleButtonInc()
    toggleButtonOut()
    reload()
});