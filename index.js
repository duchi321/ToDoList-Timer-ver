const currentTime = document.querySelector('#currentTime')
const newTodo = document.querySelector('#new-todo')
const addBtn = document.querySelector('#add-btn')
const myTodo = document.querySelector('#my-todo')
const myDone = document.querySelector('#done')
const checkList = document.querySelector('#checkList')


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
        myTodo.prepend(warning)
    },
    renderRemoveNone() {
        let warning = document.querySelector('.warning')
        warning.remove()
    },
    renderNewItem(text) {
        let newItem = document.createElement('li')
        newItem.innerHTML = `
        <label for="my-todo">${text}</label>
        <i class="delete">X</i>
        `
        myTodo.appendChild(newItem)
    },
    renderRemoveItem(click) {
        click.remove()
    }
}

const controller = {
    getCurrentTime() {
        setInterval(view.renderCurrentTime, 1000)
        view.renderCurrentTime()
    },
    addNone() {
        if (myTodo.childElementCount === 0) {
            view.renderNone()
        }
    },
    removeNone() {
        let childElements = myTodo.querySelectorAll("*");
        // 遍歷每個子元素，檢查是否與指定的 CSS 選擇器匹配
        for (let i = 0; i < childElements.length; i++) {
            let childElement = childElements[i];
            if (childElement.matches(".warning")) {
                view.renderRemoveNone()
            }
        }
    },
    getNewItem() {
        addBtn.addEventListener('click', () => {
            let getText = newTodo.value.trim()
            if (getText.length > 0) {
                this.removeNone()
                view.renderNewItem(getText)
                newTodo.value = ''
            } else {
                alert('請輸入內容')
            }
        })
    },
    removeItem() {
        checkList.addEventListener('click', (evnet) => {
            if (evnet.target.matches('.delete')) {
                view.renderRemoveItem(evnet.target.parentElement)
                this.addNone()
            }
        })
    }
}

controller.addNone()
controller.getCurrentTime()
controller.getNewItem()
controller.removeItem()
