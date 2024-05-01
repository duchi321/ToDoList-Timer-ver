const currentTime = document.querySelector('#currentTime')
const newTodo = document.querySelector('#new-todo')
const addBtn = document.querySelector('#add-btn')
const myTodo = document.querySelector('#my-todo')
const myDone = document.querySelector('#done')
let timerCount = 0; // 記錄計時器的數量，以便為每個計時器生成唯一的 ID

const model = {
    getdataDate() {
        const now = new Date()
        return now
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
        const timeString = `${year}<span>年</span> ${month}<span>月</span> ${day}<span>日</span> ${hours}:${minutes}:${seconds}`;
        currentTime.innerHTML = timeString;
    },
    renderNone() {
        let warning = document.createElement('div')
        warning.classList.add('warning')
        warning.textContent = 'none...'
        return warning
    },
    renderRemoveNone() {
        let warning = document.querySelector('.warning')
        warning.remove()
    },
    renderTimer(text, timerId) {
        const timerDiv = document.createElement("div");
        timerDiv.id = timerId;
        timerDiv.innerHTML = `<label for="my-todo" class="close">${text}</label><span id='${timerId}_display'>00秒</span><i class="delete">X</i>`;
        myTodo.appendChild(timerDiv);
        console.log(timerDiv)
        return timerDiv;
    },
    renderDoneItem(text) {
        const doneItem = document.createElement('li')
        doneItem.innerHTML = `
        <label for="done" class="checked finished">${text}</label>
        <i class="delete finished">X</i>
        `
        myDone.appendChild(doneItem)
    },
    renderRemoveDoneItem(click) {
        click.remove()
    },
    formatTime(elapsedTime) {
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const remainingSeconds = totalSeconds % 86400;
        const hr = Math.floor(remainingSeconds / 3600);
        const Min = Math.floor((remainingSeconds % 3600) / 60);
        const sec = remainingSeconds % 60;
        const renderresult = `${this.pad(days)}天${this.pad(hr)}時${this.pad(Min)}分${this.pad(sec)}秒`;
        return renderresult;
    },
    pad(time) {
        if (time < 10) {
            return String(time).padStart(2, "0");
        }
        return time;
    }
}

const controller = {
    getCurrentTime() {
        setInterval(view.renderCurrentTime, 1000)
        view.renderCurrentTime()
    },
    addNone() {
        if (myTodo.childElementCount === 0) {
            myTodo.prepend(view.renderNone())
        }
        if (myDone.childElementCount === 0) {
            myDone.prepend(view.renderNone())
        }
    },
    removeNone() {
        let myTodoChildren = myTodo.querySelectorAll("*");
        let myDonechildren = myDone.querySelectorAll("*")
        // 遍歷每個子元素，檢查是否與指定的 CSS 選擇器匹配
        for (let i = 0; i < myTodoChildren.length; i++) {
            let childElement = myTodoChildren[i];
            if (childElement.matches(".warning")) {
                view.renderRemoveNone()
            }
        }
        if (myDone.children.length > 1) {
            for (let i = 0; i < myDonechildren.length; i++) {
                let childElement = myDonechildren[i];
                if (childElement.matches(".warning")) {
                    view.renderRemoveNone()
                }
            }
        }
    },
    createTimer(text) {
        const timerId = "timer_" + timerCount++;
        const timerDiv = view.renderTimer(text, timerId);
        const displayTimerId = document.querySelector(`#${timerId}_display`);
        const startTime = Date.now();
        const timerInterval = this.startTimerInterval(startTime, displayTimerId);

        timerDiv.setAttribute("data-timerId", timerId);
        timerDiv.setAttribute("data-intervalId", timerInterval);

        timerDiv.addEventListener('click', (event) => {
            if (event.target.matches('.close')) {
                this.finfshedItem(timerId);
                view.renderDoneItem(event.target.textContent)
                this.removeNone()
                this.addNone()
            }
        })
        this.deleteTimer(timerInterval);
    },
    startTimerInterval(startTime, displayTimerId) {
        return setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            this.updateTimerDisplay(displayTimerId, elapsedTime);
        }, 1000);
    },
    updateTimerDisplay(displayTimerId, elapsedTime) {
        const formattedTime = view.formatTime(elapsedTime);
        if (elapsedTime >= 86400000) {
            displayTimerId.textContent = formattedTime;
        } else if (elapsedTime >= 3600000) {
            displayTimerId.textContent = formattedTime.substring(3);
        } else if (elapsedTime >= 60000) {
            displayTimerId.textContent = formattedTime.substring(6);
        } else {
            displayTimerId.textContent = formattedTime.substring(9);
        }
    },
    enterNewItem() {
        newTodo.addEventListener("keyup", (event) => {
            const getText = newTodo.value.trim();
            if (event.key === "Enter" && getText.length > 0) {
                this.removeNone()
                this.createTimer(getText)
                newTodo.value = "";
            } else if (event.key === "Enter") {
                alert("請輸入資料");
            }
        });
    },
    getNewItem() {
        addBtn.addEventListener('click', () => {
            const getText = newTodo.value.trim()
            if (getText.length > 0) {
                this.removeNone()
                this.createTimer(getText)
                newTodo.value = ''
            } else {
                alert('請輸入內容')
            }
        })
    },
    removeDoneItem() {
        myDone.addEventListener('click', (evnet) => {
            if (evnet.target.matches('.delete')) {
                view.renderRemoveDoneItem(evnet.target.parentElement)
                this.addNone()
            }
        })
    },
    deleteTimer(timerInterval) {
        myTodo.addEventListener("click", (event) => {
            if (event.target.matches(".delete")) {
                clearInterval(timerInterval);
                event.target.parentElement.remove();
                this.addNone()
            }
        });
    },
    finfshedItem(timerId) {
        const timerDiv = document.querySelector(`[data-timerId="${timerId}"]`);
        if (timerDiv) {
            const intervalId = parseInt(timerDiv.getAttribute("data-intervalId"));
            clearInterval(intervalId);
            timerDiv.remove();
        }
    }
}

controller.addNone()
controller.getCurrentTime()
controller.enterNewItem()
controller.getNewItem()
controller.deleteTimer()
controller.finfshedItem()
controller.removeDoneItem()
