var nave = {
    x: 200, y: 200,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 3, vivo: true
}
var multiplicadorCohete = 300
var multiplicadorDisparo = 7000
var torqueGiro = 3000
var multiplicadorFriccion = 0
var multiplicadorFriccionGiro = 1500
var bullets = [];
var meters = [];
var meterSpawnTime = 60;
var meterSpawnTimeCounter = 0;

const H = 900; const W = 900
function setup() {
    createCanvas(H, W);
}
let fuerzaCohete = { x: 0, y: 0 }

function draw() {
    background(220);
    var dt = deltaTime / 1000
    

    meterSpawnTimeCounter++
    if (meterSpawnTime == meterSpawnTimeCounter && nave.vivo) {
        console.log("3 segundos")
        meterSpawnTimeCounter = 0

        let r = getRandomInt(4)
        console.log(r)
        switch (r) {
            case 0:
                // left wall
                meters.push(new Meteorito(nave.x, nave.y, 0, random(H)))
                break;
            case 1:
                // right wall
                meters.push(new Meteorito(nave.x, nave.y, W, random(H)))
                break;
            case 2:
                // top wall
                meters.push(new Meteorito(nave.x, nave.y, random(W), 0))
                break;
            case 3:
                // bottom wall
                meters.push(new Meteorito(nave.x, nave.y, random(W), H))
                break;
            default:
                break;
        }


    }

    if (nave.x < 0 || nave.x > W || nave.y < 0 || nave.y > H) {
        text("PERDISTE r para reinicar", 450, 450)
        nave.vivo = false
        meterSpawnTimeCounter = 0
    }

    // Si tengo presionada la tecla de arriba...
    if (keyIsDown(UP_ARROW) && nave.vivo) {
        // Obtengo la dirección de la nave con trigonometría.
        // Esto me da un vector de longitud 1
        var direccionNave = {
            x: cos(nave.ang),
            y: sin(nave.ang)
        }
        text("direccionNave.x: " + direccionNave.x.toFixed(3), 80, 20)
        text("direccionNave.y: " + direccionNave.y.toFixed(3), 80, 40)
        // Lo multiplico por el multiplicadorCohete
        fuerzaCohete = {
            x: direccionNave.x * multiplicadorCohete,
            y: direccionNave.y * multiplicadorCohete
        }
        //text("fuerzaCohete.y: " + fuerzaCohete.y.toFixed(3), 220, 40)
        //text("fuerzaCohete.x: " + fuerzaCohete.x.toFixed(3), 220, 20)
        // y lo aplico como fuerza
        aplicarFuerza(nave, fuerzaCohete.x, fuerzaCohete.y)
    }
    if (keyIsDown(DOWN_ARROW) && nave.vivo) {
        // Obtengo la dirección de la nave con trigonometría.
        // Esto me da un vector de longitud 1
        var direccionNave = {
            x: cos(nave.ang),
            y: sin(nave.ang)
        }
        text("direccionNave.x: " + direccionNave.x.toFixed(3), 80, 20)
        text("direccionNave.y: " + direccionNave.y.toFixed(3), 80, 40)
        // Lo multiplico por el multiplicadorCohete
        fuerzaCohete = {
            x: direccionNave.x * multiplicadorCohete,
            y: direccionNave.y * multiplicadorCohete
        }
        //text("fuerzaCohete.y: " + fuerzaCohete.y.toFixed(3), 220, 40)
        //text("fuerzaCohete.x: " + fuerzaCohete.x.toFixed(3), 220, 20)
        // y lo aplico como fuerza
        aplicarFuerza(nave, -fuerzaCohete.x, -fuerzaCohete.y)
    }

    let data = []
    data.push(["x", nave.x])
    data.push(["y", nave.y])
    data.push(["vx", nave.vx])
    data.push(["vy", nave.vy])
    data.push(["ax", nave.ax])
    data.push(["ay", nave.ay])

    data.push(["masa", nave.masa])


    // Aplico una fricción proporcional y opuesta a la velocidad de la nave
    var fuerzaFriccion = {
        x: -nave.vx * multiplicadorFriccion,
        y: -nave.vy * multiplicadorFriccion
    }
    aplicarFuerza(nave, fuerzaFriccion.x, fuerzaFriccion.y)

    // Si estoy apretando izquierda o derecha, aplico un torque
    if (keyIsDown(RIGHT_ARROW) && nave.vivo) {
        aplicarTorque(nave, torqueGiro)
    }
    if (keyIsDown(LEFT_ARROW) && nave.vivo) {
        aplicarTorque(nave, -torqueGiro)
    }

    // Calculo las ecuaciones de movimiento
    if (nave.vivo) calcularFisicas(nave, dt)
    data.push(["ang", nave.ang])
    data.push(["vang", nave.vang])
    data.push(["aang", nave.aang])
    nave.aang = 0
    mostrarText(data)

    // Dibujado de la nave
    translate(nave.x, nave.y)
    rotate(nave.ang)
    rectMode(CENTER)
    fill("gray")
    circle(20, 0, 40)
    fill("cyan")
    circle(20, 0, 30)
    fill("gray")
    rect(0, 0, 40, 40)
    rect(-25, 0, 10, 30)
    fill("black")

    // Instrucciones
    resetMatrix() // vuelvo la hoja a su lugar

    for (let i = 0; i < bullets.length; ++i) {
        if (nave.vivo) bullets[i].toMouse();
        bullets[i].show();
    }

    for (let i = 0; i < meters.length; ++i) {
        if (nave.vivo) meters[i].move();
        meters[i].show();
    }
}

function keyPressed() {
    if (keyCode == 32 && nave.vivo) {
        bullets.push(new Bullet(cos(nave.ang) + nave.x, sin(nave.ang) + nave.y, nave.x, nave.y))
        aplicarFuerza(nave, -(cos(nave.ang) * multiplicadorDisparo), -(sin(nave.ang) * multiplicadorDisparo))
    }
    if (keyCode == 82 && !nave.vivo) {
        nave.x = 200
        nave.y = 200
        nave.vx = 0
        nave.vy = 0
        nave.ang = 0
        nave.vang = 0
        nave.vivo = true
        bullets = []
        meters = []
    }

}

function Bullet(X, Y, PX, PY) {
    this.speed = 5;
    this.x = PX;
    this.y = PY;
    this.dir = createVector(X - PX, Y - PY).normalize()
    this.r = 5;

    this.show = function () {
        circle(this.x, this.y, this.r);
    }
    this.toMouse = function () {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }
}

function Meteorito(X, Y, PX, PY) {
    this.speed = 3;
    this.x = PX;
    this.y = PY;
    this.dir = createVector(X - PX, Y - PY).normalize();
    this.r = 30;
    this.show = function () {
        fill("brown")
        circle(this.x, this.y, this.r)
        fill("black")

    }
    this.move = function () {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
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

function aplicarTorque(cuerpo, t) {
    var inercia = cuerpo.masa * 1000// la inercia depende de la masa y de un factor que depende de la forma del objeto. 1000 es un número arbitrario en este caso.
    cuerpo.aang += t / inercia
}

function mostrarText(data) {
    for (let i = 0; i < data.length; i++) {
        const nombre = data[i][0];
        const valor = data[i][1];
        text(nombre + ": " + valor.toFixed(3), 10, (i + 1) * 20)
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

