const currentTime = document.querySelector('#currentTime')

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
    }
}

const controller = {
    getCurrentTime() {
        setInterval(view.renderCurrentTime, 1000)
        view.renderCurrentTime()
    },
}
controller.getCurrentTime()
