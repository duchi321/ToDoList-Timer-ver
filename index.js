const currentTime = document.querySelector('#currentTime')
const phoneTime = document.querySelector('#phoneTime')
const newTodo = document.querySelector('#new-todo')
const addBtn = document.querySelector('#add-btn')
const myTodo = document.querySelector('#my-todo')
const myDone = document.querySelector('#done')
const todoNone = document.querySelector('.todo-none')
const doneNone = document.querySelector('.done-none')
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let finishtasks = JSON.parse(localStorage.getItem("finishtasks")) || [];

const model = {
    getdataDate() {
        const now = new Date()
        return now
    },
    setTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    setFinishtasks() {
        localStorage.setItem("finishtasks", JSON.stringify(finishtasks));
    }
}

const view = {
    renderCurrentTime() {
        const year = model.getdataDate().getFullYear();
        const month = ('0' + (model.getdataDate().getMonth() + 1)).slice(-2);
        const day = ('0' + model.getdataDate().getDate()).slice(-2);
        const hours = ('0' + model.getdataDate().getHours()).slice(-2);
        const minutes = ('0' + model.getdataDate().getMinutes()).slice(-2);
        const seconds = ('0' + model.getdataDate().getSeconds()).slice(-2);
        const timeString = `${year}<span>年</span> ${month}<span>月</span> ${day}<span>日</span> ${hours} : ${minutes} : ${seconds}`;
        currentTime.innerHTML = timeString;
        phoneTime.innerHTML = `${hours}:${minutes}`
    },
    renderTodoNone() {
        let warning = document.createElement('div');
        warning.classList.add('myTodoNone', 'nonetext');
        warning.textContent = 'none...';
        return warning
    },
    renderDoneNone() {
        let warning = document.createElement('div');
        warning.classList.add('myDoneNone', 'nonetext');
        warning.textContent = 'none...';
        return warning
    },
    renderRemoveNone(removeclass) {
        if (removeclass) {
            removeclass.remove()
        }
    },
    renderItem() {
        myTodo.innerHTML = ''
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            const newItem = document.createElement("span");
            const elapsedTime = Math.floor(task.elapsedTime / 1000); // 计算总时间，转换为秒
            newItem.classList.add('getItem')
            newItem.setAttribute('for', 'my-todo');
            const totaltime = elapsedTime
            const formattedTime = this.formatTime(elapsedTime);
            this.updateTimerDisplay(newItem, totaltime, formattedTime)
            newItem.textContent = `${task.text} - ${newItem.textContent}`;
            newItem.addEventListener("click", () => {
                if (newItem.matches('.getItem')) {
                    controller.finishedItem(index)
                }
            });
            li.appendChild(newItem);
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add('delete')
            deleteBtn.textContent = "X";
            deleteBtn.addEventListener("click", () => {
                controller.deleteItem(index);
            });
            li.appendChild(deleteBtn);
            myTodo.appendChild(li);
        })
        controller.removeNone()
    },
    renderDoneItem() {
        myDone.innerHTML = "";
        finishtasks.forEach((finishtask, index) => {
            const li = document.createElement('li');
            const finishItem = document.createElement("span");
            finishItem.classList.add('finished');
            finishItem.textContent = `${finishtask.text}`;
            li.appendChild(finishItem);
            const delFinishBtn = document.createElement('button');
            delFinishBtn.classList.add('delete');
            delFinishBtn.textContent = 'X';
            delFinishBtn.addEventListener('click', () => {
                controller.removeDoneItem(index);
            });
            li.appendChild(delFinishBtn);
            myDone.appendChild(li);
        });
        controller.removeNone()
    },
    formatTime(elapsedTime) {
        const days = Math.floor(elapsedTime / 86400);
        const remainingSeconds = elapsedTime % 86400;
        const hr = Math.floor(remainingSeconds / 3600);
        const min = Math.floor((remainingSeconds % 3600) / 60);
        const sec = remainingSeconds % 60;
        return `${this.pad(days)}天${this.pad(hr)}時${this.pad(min)}分${this.pad(sec)}秒`;
    },
    pad(time) {
        if (time < 10) {
            return String(time).padStart(2, "0");
        }
        return time;
    },
    updateTimerDisplay(item, totaltime, elapsedTime) {
        if (totaltime >= 86400) {
            item.textContent = `${elapsedTime}`;
        } else if (totaltime >= 3600) {
            item.textContent = `${elapsedTime.substring(3)}`;
        } else if (totaltime >= 60) {
            item.textContent = `${elapsedTime.substring(6)}`;
        } else {
            item.textContent = `${elapsedTime.substring(9)}`;
        }
    }
}

const controller = {
    getCurrentTime() {
        setInterval(view.renderCurrentTime, 1000)
        view.renderCurrentTime()
    },
    addNone() {
        if (myTodo.children.length === 0 && todoNone.children.length === 0) {
            todoNone.appendChild(view.renderTodoNone())
        }
        if (myDone.children.length === 0 && doneNone.children.length === 0) {
            doneNone.appendChild(view.renderDoneNone())
        }
    },
    removeNone() {
        if (myTodo.children.length > 0) {
            const myTodoNone = document.querySelector('.myTodoNone');
            view.renderRemoveNone(myTodoNone)
        }
        if (myDone.children.length > 0) {
            const myDoneNone = document.querySelector('.myDoneNone');
            view.renderRemoveNone(myDoneNone)
        }
    },
    newItem() {
        const getText = newTodo.value.trim()
        if (getText.length > 0) {
            const task = {
                text: getText,
                startTime: new Date().getTime(), // 记录任务开始时间
                elapsedTime: 0 // 记录已经过的时间
            };
            tasks.push(task);
            view.renderItem()
            newTodo.value = ''
            model.setTasks()
        } else {
            alert('請輸入內容')
        }
    },
    enterNewItem() {
        newTodo.addEventListener('keyup', (event) => {
            if (event.key === "Enter") {
                this.newItem()
            }
        });
    },
    getNewItem() {
        addBtn.addEventListener('click', () => {
            this.newItem()
        })
    },
    finishedItem(index) {
        if (tasks[index]) {
            finishtasks.push(tasks[index]); // 将完成的任务添加到 finishtasks 数组中
            tasks.splice(index, 1); // 从 tasks 数组中删除完成的任务
            view.renderItem(); // 重新渲染任务列表
            view.renderDoneItem(); // 重新渲染任务列表
            this.addNone()
            model.setTasks() // 更新本地存储
            model.setFinishtasks(); // 更新本地存储
        } else {
            console.log('not get')
        }
    },
    deleteItem(index) {
        tasks.splice(index, 1); // 从数组中删除项目
        view.renderItem(); // 重新渲染任务列表
        this.addNone()
        model.setTasks(); // 更新本地存储
    },
    removeDoneItem(index) {
        finishtasks.splice(index, 1); // 从数组中删除项目
        view.renderDoneItem(); // 重新渲染任务列表
        this.addNone()
        model.setFinishtasks(); // 更新本地存储
    },
    runTime() {
        setInterval(() => {
            tasks.forEach((task) => {
                task.elapsedTime = new Date().getTime() - task.startTime; // 更新已过时间
            });
            view.renderItem()
            model.setTasks();
        }, 1000);
    },
    start() {
        this.addNone()
        this.getCurrentTime()
        this.enterNewItem()
        this.getNewItem()
        this.runTime()
    }
}

controller.start()
window.onload = () => {
    console.log("window.onload touch");
    view.renderItem();
    view.renderDoneItem()
};