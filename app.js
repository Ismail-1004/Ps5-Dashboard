class PS {
    constructor(props) {
        this.dashBoard = props.dashBoard
        this.dashGames = props.dashGames
    }

    dataGames = []

    clockSettings () {
        const dashHours = document.querySelector('.dashboard__header-hours')
        const dashMinutes = document.querySelector('.dashboard__header-minutes')

        const date = new Date()
        const hours = date.getHours()
        const minutes = date.getMinutes()

        dashHours.innerHTML = hours < 10 ? '0' + hours : hours
        dashMinutes.innerHTML = minutes < 10 ? '0' + minutes : minutes


        setInterval(() => this.clockSettings(), 1000)
    }

    async getGames() {
        await fetch('data.json')
            .then(res => res.json())
            .then(data => this.dataGames = data)

        this.appendGamesIntoPage()
        setTimeout(() => this.getUpGames(), 150)
    }

    appendGamesIntoPage() {
        let NODE = this
        const dashSlide = document.createElement('div')
        dashSlide.className = 'dashboard__games-slide' 

        this.dataGames.forEach(function (el) {
            dashSlide.innerHTML += `
                <div class="dashboard__games-game" id="${el.id}">
                    <span class="dashboard__games-title">${el.game}</span>
                    <img src="${el.game_cover}" alt="" class="dashboard__games-img">
                    <button class="dashboard__games-btn">Play now</button>
                </div>
            `
        })

        NODE.dashGames.append(dashSlide)

        this.clickedGameHandler()
    }

    clickedGameHandler() {
        let NODE = this
        const games = document.querySelectorAll('.dashboard__games-img')

        games.forEach(el => {
            el.addEventListener('click', function () {
                NODE.activeClassHandler(games)
                const src = this.getAttribute('src')

                this.parentNode.classList.add('active')
                this.parentNode.querySelector('.dashboard__games-title').classList.add('active__title')
                this.parentNode.querySelector('.dashboard__games-btn').classList.add('active__btn')


                for (let i = 0; i < NODE.dataGames.length; i++) {
                    if (NODE.dataGames[i].game_cover === src) {
                        NODE.backgroundHandler(NODE.dataGames[i].game_bg)
                        NODE.buttonHandler(NODE.dataGames[i].url)
                    }
                }

                NODE.rollGames(this, 0)
            })
        })
    }

    activeClassHandler(gamesList) {
        const title = document.querySelectorAll('.dashboard__games-title')
        const btns = document.querySelectorAll('.dashboard__games-btn')

        for (let i = 0; i < gamesList.length; i++) {
            for (let j = 0; j < gamesList.length; j++) {
                title[i].classList.remove('active__title')
                btns[i].classList.remove('active__btn')
                gamesList[i].parentNode.classList.remove('active')
                gamesList[i].parentNode.classList.remove('active__up')
            }
        }
    }

    buttonHandler(url) {
        const btns = document.querySelectorAll('.dashboard__games-btn')

        btns.forEach(el => {
            el.addEventListener('click', () => {
                return window.location.href = url
            })
        })
    }

    backgroundHandler(src) {
        this.dashBoard.style.background = `url(${src}) no-repeat center center /cover`
    }

    getUpGames() {
        const games = document.querySelectorAll('.dashboard__games-img')

        for (let i = 0; i < games.length; i++) {
            setTimeout(() => {
                games[i].style.transform = `translateY(0%)`
            }, i * 150)
        }
    }

    rollGames(el, space) {
        const dashSlide = document.querySelector('.dashboard__games-slide')
        const currentGame = el.closest('.dashboard__games-game')
        let previousElement;
        let nextElement;    
        const currentGameId = +el.closest('.dashboard__games-game').getAttribute('id')

        if (currentGame.previousElementSibling) {
            previousElement = +currentGame.previousElementSibling.getAttribute('id')
        } else if (currentGame.nextElementSibling) {
            nextElement = +currentGame.nextElementSibling.getAttribute('id')
        }

        if (currentGameId > 3) {
            space = 23
        }


        if (currentGameId > previousElement) {
            dashSlide.style.transform = `translate(-${(currentGameId - 1) * (el.offsetWidth + currentGameId + space)}px)`
        } else {
            dashSlide.style.transform = `translate(${currentGameId - 1}px)`
        }
    }

    init() {
        this.getGames()
        this.clockSettings()
    }
}

const ps = new PS({
    dashBoard: document.querySelector('.dashboard'),
    dashGames: document.querySelector('.dashboard__games')
})

ps.init()