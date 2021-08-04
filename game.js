
win = {
        element: document.querySelector('#win'),
        size: {
            x: 300,
            y: 400,
        }
    };
ctx = win.element.getContext('2d');
win.element.height = win.size.y;
win.element.width = win.size.x;
win.element.style.backgroundColor = 'skyblue';
win.element.style.border = '2px solid gray';

//pipe
obstacles = [];
function pipe(isBottom = true){
    this.locX = win.size.x + (obstacles.length * (win.size.x/2.2))
    this.locY = 0
    this.width = 50
    this.height = 50
    this.draw = function(){
        ctx.fillStyle = 'green'
        ctx.fillRect(this.locX, this.locY, this.width, this.height)
    }
    
    if(isBottom) this.locY = (win.size.y - this.height)
    else if(isBottom == false) this.locY = 0
}


function pairOfPipes(){
    this.index = obstacles.length
    this.pipeTop = new pipe(false)
    this.pipeBottom = new pipe(true)

    this.updateLocX = function(){
        if (this.pipeTop.locX < (0 - this.pipeTop.width)){
            this.pipeTop.locX = win.size.x + this.pipeTop.width
            this.pipeBottom.locX = win.size.x + this.pipeBottom.width
            randomPipeHeight(this.index)
        }
        else{
            this.pipeTop.locX -= 0.5
            this.pipeBottom.locX -= 0.5
        }
    }
}

function randomPipeHeight(index){
        let pipeBottomHeight = Math.random() * (win.size.y - 120);
        obstacles[index].pipeTop.height = win.size.y - (pipeBottomHeight + 100)
        obstacles[index].pipeBottom.height = pipeBottomHeight
        obstacles[index].pipeBottom.locY = (win.size.y - obstacles[index].pipeBottom.height)
}

//player
function player(){
    this.size = {x: 20, y: 20}
    this.locX = (win.size.x/2) - (this.size.x/2)
    this.locY = (win.size.y/2) - (this.size.y/2)
    
    this.draw = function(){
        ctx.strokeStyle = 'gray'
        ctx.strokeRect(this.locX, this.locY, this.size.x, this.size.y)
        ctx.fillStyle = 'white'
        ctx.fillRect(this.locX, this.locY, this.size.x, this.size.y)
    }
}
myPlayer = new player() //add player

//game logic
let inGame = false
let mouseDown = false
let spots = 0

window.addEventListener('click', e => {
    if(inGame == false) {
        inGame = true
        start()
    }
})
window.addEventListener('mousedown', e => {
    mouseDown = true
})
window.addEventListener('mouseup', e => {
    mouseDown = false
})

for (let i = 0; i < 3; i++){ //add obstacles
    obstacles.push(new pairOfPipes())
    randomPipeHeight(i)
}

function checkSpots(){
    obstacles.forEach(e => {
        if (e.pipeTop.locX == (win.size.x/2) - e.pipeTop.width) spots++
    })
}

function checkColision(){
    obstacles.forEach(e => {
        if(myPlayer.locX >= (e.pipeBottom.locX - myPlayer.size.x) && 
            myPlayer.locX <= e.pipeBottom.locX + e.pipeBottom.width &&
                (myPlayer.locY + (myPlayer.size.x)) >= e.pipeBottom.locY) endGame()
        if(myPlayer.locX >= (e.pipeTop.locX - myPlayer.size.x) && 
            myPlayer.locX <= e.pipeTop.locX + e.pipeTop.width &&
                myPlayer.locY <= e.pipeTop.height) endGame()
    })
}


function updateObstaclesPosition(){
    obstacles.forEach(e => {e.updateLocX()})
}

function clear(){
    ctx.clearRect(0,0,win.size.x, win.size.y)
}

function draw(){
    //draw pipes
    obstacles.forEach(e => {
        e.pipeTop.draw()
        e.pipeBottom.draw()
    })
    
    //draw player
    myPlayer.draw()
    
    //player info
    ctx.fillStyle = 'white'
    ctx.fillText('Use click top move', 2,10)
    ctx.fillText(spots, win.size.x - 20, 10)
}

function main(){
    //temporary move
    if(mouseDown == true && myPlayer.locY > 0) myPlayer.locY -= 2
    else if(mouseDown == false && myPlayer.locY < (win.size.y - myPlayer.size.y)) myPlayer.locY += 2.2
    
    checkSpots()
    checkColision()
    updateObstaclesPosition()
    clear()
    draw()
}

function endGame(){
    window.clearInterval(loop)
    ctx.globalAlpha = 0.4
    ctx.fillRect(0,0,win.size.x, win.size.y)
}

ctx.fillText('Use Click for init game and to play', 70, 180)
let loop

function start(){
    loop = window.setInterval(() =>{
        main()
    },10)
}
