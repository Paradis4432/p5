let mBalaVel = 500000
let gravedad = 100
let fin = 0
let ct0 = 0
let ct1 = 0

const WIDTH = 900
const HEIGHT = 900

function setup() {
    createCanvas(WIDTH, HEIGHT);
    bg = loadImage('fondo.jpg');
}

let t0 = {
    x: 100, y: 780,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 10, r: 40
}

let t1 = {
    x: 800, y: 780,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 22,
    vang: 0,
    aang: 0,
    masa: 10, r: 40
}

let bt0 = {
    x: 1000, y: 0,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 30, r: 20
}

let bt1 = {
    x: 1000, y: 0,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 30, r: 20
}

function tocando(ob0, ob1) {
    // toma dos objetos y retorna si estan tocando o no
    // calculando si la distancia entre los dos puntos es menor a la suma de los radios / 2
    return dist(ob0.x, ob0.y, ob1.x, ob1.y) < ((ob0.r / 2) + (ob1.r / 2))
}

function draw() {
    if (fin != 0) {
        clear()
        textSize(32)
        text("jugador " + fin + " gano.", 450, 100)
        return
    }

    background(bg);
    var dt = deltaTime / 1000

    calcularFisicas(bt0, dt)
    aplicarFuerza(bt0, 0, gravedad * bt0.masa)

    calcularFisicas(bt1, dt)
    aplicarFuerza(bt1, 0, gravedad * bt1.masa)

    // cooldowns
    if(ct0 > 0) ct0 -= 0.1
    if(ct1 > 0) ct1 -= 0.1

    textSize(16)
    fill("red")
    text("Cooldown: " + ct0.toFixed(1), 10, 40)

    fill("blue")
    text("Cooldown: " + ct1.toFixed(1), 780, 40)
    

    // colision de balas
    if (tocando(bt0, t1)) fin = 1
    if (tocando(bt1, t0)) fin = 2

    function mostrarTanque(ob, color) {
        translate(ob.x, ob.y)
        fill(color)
        circle(0, 0, ob.r)
        rotate(ob.ang)
        fill("black")
        rect(-7, -7, 50, 15)
        resetMatrix()
    }
    mostrarTanque(t0, "red")
    mostrarTanque(t1, "blue")

    function mostrarBala(ob, color) {
        translate(ob.x, ob.y)
        fill(color)
        circle(0, 0, ob.r)
        resetMatrix()
    }

    mostrarBala(bt0, "yellow")
    mostrarBala(bt1, "purple")

    //floor
    fill("green")
    rect(0, 800, 900, 900)
    resetMatrix() // vuelvo la hoja a su lugar


    // 87w 65a 83s 68d
    // 38ua 37la 40da 39ra
    if (keyIsDown(65)) t0.ang -= 0.01
    if (keyIsDown(68)) t0.ang += 0.01
    if (!tocando(t0, t1)) {
        if (keyIsDown(87) && t0.x < WIDTH - t0.r / 2) t0.x += 1
        if (keyIsDown(83) && t0.x > t0.r / 2) t0.x -= 1
    }   


    if (keyIsDown(37)) t1.ang -= 0.01
    if (keyIsDown(39)) t1.ang += 0.01
    if (!tocando(t0, t1)) {
        if (keyIsDown(38) && t1.x < WIDTH - t0.r / 2) t1.x += 1
        if (keyIsDown(40) && t1.x > t0.r / 2) t1.x -= 1
    }
}

function keyPressed() {
    if (keyCode == 32 && ct0 < 0.1) {
        bt0.vx = 0
        bt0.vy = 0

        bt0.x = t0.x
        bt0.y = t0.y

        balaFuerza = {
            x: cos(t0.ang) * mBalaVel,
            y: sin(t0.ang) * mBalaVel
        }
        aplicarFuerza(bt0, balaFuerza.x, balaFuerza.y)
        ct0 = 36
    }

    if (keyCode == 13 && ct1 < 0.1) {
        bt1.vx = 0
        bt1.vy = 0

        bt1.x = t1.x
        bt1.y = t1.y

        balaFuerza = {
            x: cos(t1.ang) * mBalaVel,
            y: sin(t1.ang) * mBalaVel
        }
        aplicarFuerza(bt1, balaFuerza.x, balaFuerza.y)
        ct1 = 36
    }
}

function calcularFisicas(cuerpo, dt) {
    // a -> v -> x
    cuerpo.vx += cuerpo.ax * dt
    cuerpo.vy += cuerpo.ay * dt
    cuerpo.x += cuerpo.vx * dt
    cuerpo.y += cuerpo.vy * dt

    // aang -> vang -> ang
    cuerpo.vang += cuerpo.aang * dt
    cuerpo.ang += cuerpo.vang * dt

    // reinicio todas las aceleraciones

    cuerpo.ax = 0
    cuerpo.ay = 0
}

function aplicarFuerza(cuerpo, fx, fy) {
    // cuando quiera aplicar una fuerza, la convierto enseguida en una aceleración y la aplico como una aceleración
    cuerpo.ax += fx / cuerpo.masa
    cuerpo.ay += fy / cuerpo.masa
}


function mostrarText(data) {
    for (let i = 0; i < data.length; i++) {
        const nombre = data[i][0];
        const valor = data[i][1];
        text(nombre + ": " + valor.toFixed(3), 10, (i + 1) * 20)
    }
}

