var nave
let bullets = []

function setup() {
    createCanvas(900, 900);
    nave = {
        x: 400, y: 400,
        vx: 0, vy: 0,
        ax: 0, ay: 0,
        ang: 0, velAng: 0,
        w: 100, h: 50
    }
}

function draw() {
    background(220);

    var dt = deltaTime / 1000
    nave.velAng = 0
    if (keyIsDown(RIGHT_ARROW)) nave.velAng = 2
    if (keyIsDown(LEFT_ARROW)) nave.velAng = -2
    if (keyIsDown(32)){
        
    }
    if (keyIsDown(UP_ARROW)) {
        var dirx = cos(nave.ang)
        var diry = sin(nave.ang)
        nave.ay = (diry) * 50
        nave.ax = (dirx) * 50
    }

    //MCU
    nave.ang += nave.velAng * dt

    text("vx: " + Math.round(nave.vx * 10) / 10, 10, 20)
    text("vy: " + Math.round(nave.vy * 10) / 10, 10, 40)
    text("ax: " + Math.round(nave.ax * 10) / 10, 10, 60)
    text("ay: " + Math.round(nave.ay * 10) / 10, 10, 80)
    text("ang: " + Math.round(nave.ang * 10) / 10, 10, 100)
    text("velAng: " + Math.round(nave.velAng * 10) / 10, 10, 120)

    //MRUV
    calcularFisicas(nave, dt)

    translate(nave.x, nave.y)
    rotate(nave.ang)

    fill(100)
    rectMode(CENTER)
    rect(0, 0, nave.w, nave.h)

    fill(0, 150, 255)
    rect(29, 0, nave.w / 2.5, nave.h * 0.8)

    resetMatrix()

    textSize(25)

    // velAng speed to rotate ship 
    // ang current angle
    // 32 keycode for space
    
}

function calcularFisicas(cuerpo, dt) {
    cuerpo.vx += cuerpo.ax * dt
    cuerpo.vy += cuerpo.ay * dt

    cuerpo.x += cuerpo.vx * dt
    cuerpo.y += cuerpo.vy * dt

    if (cuerpo.vx >= 0.1) cuerpo.vx -= 0.1
    if (cuerpo.vx <= -0.1) cuerpo.vx += 0.1
    if (cuerpo.vy >= 0.1) cuerpo.vy -= 0.1
    if (cuerpo.vy <= -0.1) cuerpo.vy += 0.1

    cuerpo.ax = 0
    cuerpo.ay = 0
}