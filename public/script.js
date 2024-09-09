let addTask = document.getElementById('save');
let cont = document.getElementById('cont');
window.onload = getTodo();

addTask.addEventListener('click', () => {
    let ip = document.getElementById('ip').value;
    let ipbox = ip.trim();
    if (ipbox === "") {
        alert("Enter the task");
        return;
    }
    // console.log(ipbox);
    let obj = {
        task: ipbox,
        id: Date.now(),
        checked: false
    };

    savetodo(obj, createTask)

});


function savetodo(value, callback) {
    fetch("/savetodo", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    }).then((data) => {

        if (data.status == 200) {
            callback(value);
        }
    })
}

function createTask(obj) {
    let taskElement = document.createElement('div');
    taskElement.id = obj.id;
    taskElement.classList.add('task');

    // create checkbox
    let checkbox = document.createElement('input');
    checkbox.id = "checkbox"
    checkbox.type = 'checkbox';
    checkbox.checked = obj.checked;
    checkbox.addEventListener('click', function () {
        let taskId = this.parentNode.id;
        // console.log(taskId);

        console.log(taskText.className);
        if (obj.checked) {
            taskText.style.opacity = "50%";
            obj.checked = false;
        }
        else {
            obj.checked = true;
            taskText.style.opacity = "100%";
        }

        check(taskId)


    });

    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function () {
        // cont.removeChild(taskElement);
        let taskId = this.parentNode.id;
        // console.log(taskId);
        removeTask(taskId, () => {
            cont.removeChild(taskElement);
        });
    });
    let taskText = document.createElement('span');
    if (obj.checked == true) {
        taskText.textContent = obj.task;
        taskText.style.opacity = "50%";
    }
    else {
        taskText.textContent = obj.task;
        taskText.style.opacity = "100%";

    }

    //update button
    let update = document.createElement('button');
    update.textContent = "UPDATE";
    update.addEventListener('click', () => {
        let taskId = update.parentElement.childNodes;
        let id = update.parentElement.id;
        let TaskVal = taskId[0].innerText;
        // console.log(updateValue);
        console.log(id);
        let newTaskVal = prompt("Update the Task...", TaskVal);
        taskId[0].innerText = newTaskVal;
        updateTask(id, newTaskVal);

    })




    // append checkbox and task text to task element
    taskElement.appendChild(taskText);
    taskElement.appendChild(removeButton);
    taskElement.appendChild(update);
    taskElement.appendChild(checkbox);

    // Append task element to container
    cont.appendChild(taskElement);
    ip.value = "";
}

function getTodo() {
    fetch("/getdata")
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                createTask(element);
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
}


function removeTask(id, callback) {
    // debugger;
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then((res) => {
            return res.json()
        })
        .then(data => {
            console.log(data);
            callback()
        })
        .catch((err) => {
            console.log("error occured ", err);
        })
}




function check(id) {
    fetch(`/donetask/${id}`, {
        method: 'POST'
    }).then((data) => {
        // console.log(data);
    }).catch(err => console.log("error occured", err));
}

function updateTask(id, val) {
    fetch(`/updateTask/${id}/${val}`, {
        method: 'POST'
    })
        .then(data => console.log(data))
        .catch(err => console.log(err));

}