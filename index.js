const currentTime = document.querySelector('#currentTime')
const newTodo = document.querySelector('#new-todo')
const addBtn = document.querySelector('#add-btn')
const myTodo = document.querySelector('#my-todo')

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
    renderNewItem(text) {
        let newItem = document.createElement('li')
        newItem.innerHTML = `
        <label for="my-todo">${text}</label>
        <i class="delete">X</i>
        `
        myTodo.appendChild(newItem)
    }
}

const controller = {
    getCurrentTime() {
        setInterval(view.renderCurrentTime, 1000)
        view.renderCurrentTime()
    },
    getNewItem() {
        addBtn.addEventListener('click', () => {
            let getText = newTodo.value.trim()
            if (getText.length > 0) {
                view.renderNewItem(getText)
                newTodo.value = ''
            } else {
                alert('請輸入內容')
            }
        })
    }
}
controller.getCurrentTime()
controller.getNewItem()
