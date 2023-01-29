const suffix = Date.now();
updateIDs();

const container = document.querySelector(".container");
const emptyContainer = document.createElement("span");
emptyContainer.innerHTML = "No notes registered";

let notesList = JSON.parse(localStorage.getItem('notes')) || [];
if (notesList.length === 0) {
    container.appendChild(emptyContainer);
}
notesList.map(atividade => addNoteDiv(atividade));


const form = document.querySelector('form');
form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    let start = form.querySelector('#start-'+suffix).value;
    let end = form.querySelector('#end-'+suffix).value;
    let title = form.querySelector('#title-'+suffix).value;
    if (validate(start, end, title)) {
        let note = getObject(start, end, title);
        if (note) {
            if (!existsInList(note, notesList)) {
                addToList(note, notesList);
                updateDOM(notesList);
                updateStorage();
            } else {
                alert('Previously inserted element');
            }
        }
        form.reset();
        form.querySelector('#start-'+suffix).focus();
    }

});

function updateIDs(){
    document.querySelector("#start").id = "start-" + suffix;
    document.querySelector("#end").id = "end-" + suffix;
    document.querySelector("#title").id = "title-" + suffix;
}

function _validateField(field, name) {
    if (!field) {
        alert(name + " must be informed.");
        return false;
    }
    return true;
}

function validate(start, end, title) {
    return _validateField(start, 'start') &&
        _validateField(end, "end") &&
        _validateField(title, "title");

}

function existsInList(element, list) {
    for (let i = 0; i < list.length; i++) {
        let aux = list[i];
        if (aux.start === element.start
            && aux.end === element.end
            && aux.elapsedTime === element.elapsedTime
            && aux.title === element.title) {
            return true;
        }
    }
    return false;
}


function removeFromList(note, list) {
    let index = list.indexOf(note);
    if (index >= 0) {
        list.splice(index, 1);
    }
}

function removeDiv(id) {
    const container = document.querySelector(".container");
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
    const container = document.querySelector(".container");
    for (let element of container.children) {
        element.className = '';
    }
    divAlvo.className = 'activeNote';
}

function addNoteDiv(note) {
    const container = document.querySelector(".container");
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

function getObject(start, end, title) {
    let startInMin = dayInMinutes(start);
    let endInMin = dayInMinutes(end);

    let elapsedTime = endInMin - startInMin;
    let obj = {
        start,
        end,
        elapsedTime,
        title
    };

    return obj;
}

function addToList(obj, list) {
    if (existsInList(obj, list)) {
        alert('Previously inserted element');
    } else {
        list.push(obj);
        sortByStart(list);
    }
}

function sortByStart(list){
    list.sort((a, b) => dayInMinutes(a.start) - dayInMinutes(b.start));
}

function updateDOM(list){
    const container = document.querySelector(".container");
    while(container.children.length > 0){
        container.removeChild(container.lastChild);
    }
    list.map(atividade => addNoteDiv(atividade));
}

function dayInMinutes(hour) {
    let time = hour.split(':');
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}