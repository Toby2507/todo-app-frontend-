// Variables
const darkToggle = document.querySelector(".darkToggle");
const todoBox = document.querySelector(".todo-box");
const form = document.querySelector(".create-todo");
const filterBox = document.querySelectorAll(".filterBox");
const filterBtns = document.querySelectorAll(".filter-btn");
const available = document.querySelector(".available");
const interfaceContainer = document.querySelector(".interface");
const filterActive = "filter-btn active capitalize text-base text-brightBlue font-bold";
const filterInactive = "filter-btn capitalize text-base text-lightTextLight font-bold hover:text-lightTextDark dark:text-darkFilterText dark:hover:text-darkFilterHover";
let displayMode;
let dragStartIndex;
let listItemsList = [];
let todoItems = [];
// General Functionalities

// Dark Mode Toggle

class UI {
    displayTodoItem(item) {
        const todoitem = document.createElement("li");
        todoitem.setAttribute("data-id", item.id);
        todoitem.classList.add("dropstop");
        if (item.isCompleted == false) {
            todoitem.innerHTML = `
            <div class="draggable touch-auto border-b border-lightAccent px-6 py-4 flex items-center space-x-4 dark:border-darkAccent dark:bg-darkSecBg dark:text-darkSecText" draggable="true">
                    <button class="checkbtn relative h-6 w-6 grid place-items-center bg-checkBg rounded-full" data-id=${item.id}>
                        <img src="images/icon-check.svg" alt="selected">
                        <div class="disp-check absolute w-full h-full bg-white rounded-full border-2 border-lightAccent hover:border-0 hover:w-4 hover:h-4 dark:border-darkAccent dark:bg-darkSecBg"></div>
                    </button>
                    <p class="text-base flex-1 truncate text-lightTextDark hover:whitespace-normal dark:text-darkSecText">${item.body}</p>
                    <button class="text-2xl text-lightAccent dark:text-darkAccent"><i class="delete fa-solid fa-xmark w-full h-full" data-id=${item.id}></i></button>
                </div>`;
        } else {
            todoitem.innerHTML = `
                <div class="draggable touch-auto border-b border-lightAccent px-6 py-4 flex items-center space-x-4 dark:border-darkAccent dark:bg-darkSecBg dark:text-darkSecText" draggable="true">
                <button class="relative h-6 w-6 grid place-items-center bg-checkBg rounded-full" data-id=${item.id}>
            <img src="images/icon-check.svg" alt="selected">
            <div class="hidden disp-check absolute w-full h-full bg-white rounded-full border-2 border-lightAccent hover:border-0 hover:w-4 hover:h-4 dark:border-darkAccent dark:bg-darkSecBg"></div>
            </button>
            <p class="text-base flex-1 truncate text-lightAccent line-through hover:whitespace-normal dark:text-darkFilterText">${item.body}</p>
            <button class="text-2xl text-lightAccent dark:text-darkAccent"><i class="delete fa-solid fa-xmark w-full h-full" data-id=${item.id}></i></button>
            </div>`;
        };
        listItemsList.push(todoitem);
        todoBox.appendChild(todoitem);
    };
    async setUp() {
        todoItems = Storage.getTodoItems();
        displayMode = Storage.getDisplayMode();
        displayMode = Storage.getDisplayMode();
        todoItems.forEach(item => {
            if (item) {
                this.displayTodoItem(item);
            }
        });
        this.setTodoCount(todoItems);
    };
    setTodoCount(items) {
        let total = 0;
        let availableTotal = 0;
        items.forEach(item => {
            total++
            if (item.isCompleted == false) {
                availableTotal++;
            }
        });
        if (total < 1) {
            filterBox.forEach(box => box.style.visibility = "hidden");
        } else {
            filterBox.forEach(box => box.style.visibility = "visible");
            available.innerText = availableTotal;
        };
    };
    createNewTodo() {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const itemInput = document.querySelector(".todoitem");
            const itemBody = itemInput.value;
            if (itemBody != "") {
                const itemId = new Date().getTime();
                const item = {
                    body: itemBody,
                    id: itemId,
                    isCompleted: false
                };
                itemInput.value = "";
                itemInput.innerText = "";
                todoItems.push(item);
                Storage.saveTodoItems(todoItems);
                this.setTodoCount(todoItems);
                this.displayTodoItem(item, todoItems.length);
                this.dragLogic();
            };
        });
    };
    uiLogic() {
        interfaceContainer.addEventListener("click", e => {
            if (e.target.classList.contains("disp-check")) {
                const btn = e.target.parentElement;
                const id = parseInt(btn.dataset.id);
                const itemP = btn.nextElementSibling;
                todoItems = todoItems.map(item => {
                    if (item.id == id) {
                        item.isCompleted = true;
                    };
                    return item;
                });
                Storage.saveTodoItems(todoItems);
                this.setTodoCount(todoItems);
                e.target.style.display = "none";
                itemP.classList.remove("text-lightTextDark", "dark:text-darkSecText");
                itemP.classList.add("text-lightAccent", "dark:text-darkFilterText", "line-through");
                btn.classList.remove("checkbtn");
            } else if (e.target.closest(".delete")) {
                let id = parseInt(e.target.dataset.id);
                this.removeId(id);
                e.target.parentElement.parentElement.remove();
            } else if (e.target.closest(".filter-btn")) {
                let category = (e.target.dataset.category);
                if (category == "all") {
                    todoBox.innerHTML = "";
                    todoItems.forEach(item => this.displayTodoItem(item));
                } else {
                    category = JSON.parse(category);
                    const filteredItems = todoItems.filter(item => item.isCompleted == category);
                    todoBox.innerHTML = "";
                    filteredItems.forEach(item => this.displayTodoItem(item));
                };
                filterBtns.forEach(btn => btn.classList = filterInactive);
                e.target.classList = filterActive;
            } else if (e.target.closest(".clear-completed")) {
                todoItems = todoItems.filter(item => item.isCompleted != true);
                Storage.saveTodoItems(todoItems);
                todoBox.innerHTML = "";
                todoItems.forEach(item => this.displayTodoItem(item));
                this.setTodoCount(todoItems);
            };
            this.dragLogic();
        });
    };
    dragstart(e) {
        dragStartIndex = this.closest("li");
    };
    dragover(e) {
        this.classList.add("bg-lightSecBg", "dark:bg-darkInfo");
        e.preventDefault();
    };
    dragleave(e) {
        this.classList.remove("bg-lightSecBg", "dark:bg-darkInfo");
    };
    dragdrop(e) {
        const dragEndIndex = this;
        swapItems(dragStartIndex, dragEndIndex);
        this.classList.remove("bg-lightSecBg", "dark:bg-darkInfo");
    };
    dragLogic() {
        const draggables = document.querySelectorAll(".draggable");
        const dragListItems = todoBox.querySelectorAll("li");
        draggables.forEach(draggable => {
            draggable.addEventListener("dragstart", this.dragstart);
            draggable.addEventListener("touchstart", this.dragstart);
        });
        dragListItems.forEach(dragListItem => {
            dragListItem.addEventListener("dragover", this.dragover);
            dragListItem.addEventListener("drop", this.dragdrop);
            dragListItem.addEventListener("dragleave", this.dragleave);
        })
    };
    removeId(id) {
        listItemsList = listItemsList.filter(item => +item.dataset.id !== id)
        todoItems = todoItems.filter(item => item.id != id);
        this.setTodoCount(todoItems);
        Storage.saveTodoItems(todoItems);
    };
    displayModeLogic() {
        if (displayMode == "dark") {
            document.body.classList.add("dark");
            darkToggle.src = "images/icon-moon.svg";
        };
        darkToggle.addEventListener("click", () => {
            if (document.body.classList.contains("dark")) {
                document.body.classList.remove("dark");
                darkToggle.src = "images/icon-sun.svg";
                Storage.saveDisplayMode("light");
            } else {
                document.body.classList.add("dark");
                darkToggle.src = "images/icon-moon.svg";
                Storage.saveDisplayMode("dark");
            };
        });
    };
};

function swapItems(from, to) {
    const itemOne = from.querySelector(".draggable");
    const itemTwo = to.querySelector(".draggable");
    from.appendChild(itemTwo);
    to.appendChild(itemOne);
};

class Storage {
    static getTodoItems() {
        const todoitems = localStorage.getItem("todo") ? JSON.parse(localStorage.getItem("todo")) : [];
        return todoitems;
    };
    static saveTodoItems(items) {
        localStorage.setItem("todo", JSON.stringify(items));
    };
    static getDisplayMode() {
        const mode = localStorage.getItem("display");
        return mode;
    };
    static saveDisplayMode(val) {
        localStorage.setItem("display", val);
    };
};

const ui = new UI();
window.addEventListener("DOMContentLoaded", () => {
    ui.setUp().then(() => {
        ui.createNewTodo();
        ui.uiLogic();
        ui.dragLogic();
        ui.displayModeLogic();
    })
});