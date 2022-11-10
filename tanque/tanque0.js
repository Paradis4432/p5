function setup() {
    createCanvas(900, 900);
}

let t0 = {
    x: 100, y: 750,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 10
}

let t1 = {
    x: 800, y: 750,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 22,
    vang: 0,
    aang: 0,
    masa: 10
}

function draw() {
    background(220);

    // t0
    translate(t0.x, t0.y)
    fill("red")
    circle(0, 0, 40)
    rotate(t0.ang)
    fill("black")
    rect(-7,-7,50,15)
    resetMatrix()

    // t1
    translate(t1.x, t1.y)
    fill("blue")
    circle(0, 0, 40)
    rotate(t1.ang)
    fill("black")
    rect(-7,-7,50,15)
    resetMatrix()

    //floor
    fill("green")
    rect(0, 800, 900, 900)

    

    // Instrucciones
    resetMatrix() // vuelvo la hoja a su lugar


    // 87w 65a 83s 68d
    // 38ua 37la 40da 39ra
    if(keyIsDown(65)) t0.ang -= 0.01
    if(keyIsDown(68)) t0.ang += 0.01


    if(keyIsDown(37)) t1.ang -= 0.01
    if(keyIsDown(39)) t1.ang += 0.01

}


function aplicarFuerza(cuerpo, fx, fy) {
    // cuando quiera aplicar una fuerza, la convierto enseguida en una aceleración y la aplico como una aceleración
    cuerpo.ax += fx / cuerpo.masa
    cuerpo.ay += fy / cuerpo.masa
}