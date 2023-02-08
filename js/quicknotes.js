class Note {
    constructor() {
        this.start = "";
        this.end = "";
        this.title = "";
        this.elapsedTime = "";
    }

    validate(form) {
        let inputStart = form.querySelector('.start');
        let inputEnd = form.querySelector('.end');
        let inputTitle = form.querySelector('.title');
        this.start = this.validateField(inputStart);
        this.end = this.validateField(inputEnd);
        this.title = this.validateField(inputTitle);
        if (this.start && this.end && this.title) {
            this.elapsedTime = dayInMinutes(this.end) - dayInMinutes(this.start);
            return true;
        }
        return false;
    }

    validateField(field) {
        if (field.value == "") {
            this.setStatus(field,
                `Input ${field.classList[0]}`,
                "error");
            return null;
        }
        this.setStatus(field, null, "success");
        return field.value;
    }

    setStatus(field, message, status) {
        const errorMessage = field.parentNode.querySelector(".error-message");
        errorMessage.innerText = message;
        status == "success" ? field.classList.remove("input-error") : field.classList.add("input-error");
    }

    noteAlert(modal, title, message) {
        if (modal) {
            modal.style.display = "block";
            modal.querySelector(".modal-header h2").innerText = title;
            modal.querySelector(".modal-body p").innerText = message;
        } else {
            alert(message);
        }
    }

}

const form = document.querySelector(".noteInput");
const container = document.querySelector(".container");
const emptyContainer = document.createElement("span");
emptyContainer.innerHTML = "No notes registered";

let notesList = JSON.parse(localStorage.getItem('notes')) || [];
if (notesList.length === 0) {
    container.appendChild(emptyContainer);
}
notesList.map(atividade => addNoteDiv(atividade));

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let note = new Note();
    if (note.validate(form)) {
        if (!existsInList(note, notesList)) {
            addToList(note, notesList);
            updateDOM(notesList);
            updateStorage();
            form.reset();
        } else {
            note.noteAlert(modal, 'Error', 'Previously inserted element');
        }
    }
});

function existsInList(node, list) {
    let aux = list.filter(aux => {
        return (aux.start === node.start
            && aux.end === node.end
            && aux.elapsedTime === node.elapsedTime
            && aux.title === node.title)
    });
    return aux.length > 0;
}


function removeFromList(note, list) {
    let index = list.indexOf(note);
    if (index >= 0) {
        list.splice(index, 1);
    }
}

function removeDiv(id) {
    let nodeDiv = document.querySelector("#" + id);
    container.removeChild(nodeDiv);
    if (container.children.length === 0) {
        container.appendChild(emptyContainer);
    }
}

function updateStorage() {
    localStorage.setItem('notes', JSON.stringify(notesList));
}

function activeNoteDiv(divAlvo) {
    for (let element of container.children) {
        element.className = '';
    }
    divAlvo.className = 'activeNote';
}

function addNoteDiv(note) {
    if (emptyContainer.parentNode) {
        emptyContainer.parentNode.removeChild(emptyContainer);
    }
    const idDiv = 'note-' + container.children.length;
    const newDiv = document.createElement("div");
    newDiv.id = idDiv;
    newDiv.addEventListener("click", () => {
        activeNoteDiv(newDiv);
    });
    const title = document.createElement("span");
    title.innerHTML = note.title;
    const p = document.createElement("p");
    p.innerHTML = `${note.start} to ${note.end} (${note.elapsedTime} min)`;
    const btnDelete = makeBtnDelete(note, notesList, idDiv);
    newDiv.appendChild(title);
    newDiv.appendChild(p);
    newDiv.appendChild(btnDelete);
    container.appendChild(newDiv);
}

function makeBtnDelete(obj, list, idDiv) {
    let btn = newHTMLButton('<i class="gg-trash"></i>');
    btn.className = 'btnDelete';
    btn.addEventListener('click', function () {
        removeFromList(obj, list);
        removeDiv(idDiv);
        updateStorage();
    });
    return btn;
}

function newHTMLButton(text) {
    let btn = document.createElement('button');
    if (text) {
        btn.innerHTML = text;
    }
    return btn;
}

function addToList(obj, list) {
    list.push(obj);
    sortByStart(list);
}

function sortByStart(list) {
    list.sort((a, b) => dayInMinutes(a.start) - dayInMinutes(b.start));
}

function updateDOM(list) {
    while (container.children.length > 0) {
        container.removeChild(container.lastChild);
    }
    list.map(note => addNoteDiv(note));
}

function dayInMinutes(hour) {
    let time = hour.split(':');
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}