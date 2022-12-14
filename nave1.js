var nave = {
    x: 500, y: 500,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 3, vivo: true
}
var multiplicadorCohete = 300
var multiplicadorDisparo = 7000
var torqueGiro = 7000
var multiplicadorFriccion = 0
var multiplicadorFriccionGiro = 1500
var bullets = [];
var meters = [];
var holes = [];
var estrellas = []
var meterSpawnTime = 60;
var meterSpawnTimeCounter = 0;
var holeSpawnTime = 120;
var holeSpawnTimeCounter = 0;
var holeGrowTime = 30;
var holeGrowTimeCounter = 0;
var splotionSecsLeft = 0
var tempSplotionX = 0
var tempSplotionY = 0
var pressedSegs = 0
var puntaje = 0
var metersSpawneados = 0
var debug = true

/*
# TODO 
 eliminar estrella al implosionar
 disparo de antimateria -> al reducir radio de agujero negro a 0 transformar a agujero blanco -> al disparar lo suficiente al agujero blanco desaparecer
 colision de asteroides
 agujero negro come a asteroides o nave al ser mas grande que estos
*/
const H = 900; const W = 900
function setup() {
    createCanvas(H, W);
    for (let i = 0; i < W; i++) {
        let r = getRandomInt(H)
        if (r % 2 == 0 && i % 2 == 0) estrellas.push({ i, r })

    }

    //holes.push(new Hole(500, 300, 150, 255))
    //holes.push(new Hole(600, 600, 150, 255))
    //holes.push(new Hole(500, 500, 150, 0))
}
let fuerzaCohete = { x: 0, y: 0 }
let dt = 0
let spawned = false

function draw() {
    background(20); // sacar para hyperspacio

    let data = []
    dt = deltaTime / 1000

    meterSpawnTimeCounter++
    holeSpawnTimeCounter++
    holeGrowTimeCounter++
    if (holeGrowTime == holeGrowTimeCounter && nave.vivo) {
        for (const hole of holes) {
            hole.r += 1
        }
        holeGrowTimeCounter = 0
    }

    if (meterSpawnTime == meterSpawnTimeCounter && nave.vivo) {
        meterSpawnTimeCounter = 0
        var vtmp
        var ctmp
        let r = getRandomInt(4)
        metersSpawneados++
        if (metersSpawneados % 5 == 0) {
            vtmp = 2
            ctmp = "red"
        } else {
            vtmp = 1
            ctmp = "rgb(163,158,158)"
        }
        switch (r) {
            case 0:
                // left wall
                meters.push(new Meteorito(nave.x, nave.y, 0, random(H), vtmp, ctmp))
                break;
            case 1:
                // right wall
                meters.push(new Meteorito(nave.x, nave.y, W, random(H), vtmp, ctmp))
                break;
            case 2:
                // top wall
                meters.push(new Meteorito(nave.x, nave.y, random(W), 0, vtmp, ctmp))
                break;
            case 3:
                // bottom wall
                meters.push(new Meteorito(nave.x, nave.y, random(W), H, vtmp, ctmp))
                break;
            default:
                break;
        }
    }

    if (holeSpawnTime == holeSpawnTimeCounter && nave.vivo && !spawned) {
        holeSpawnTimeCounter = 0

        let r = getRandomInt(estrellas.length)

        for (const star of estrellas) {
            if (!spawned && r % 3 == 0) {
                holes.push(new Hole(estrellas[r].i, estrellas[r].r, 10, r % 2 == 0 ? 0 : 255))
                tempSplotionX = estrellas[r].i
                tempSplotionY = estrellas[r].r
                splotionSecsLeft = 20
                spawned = true
            }
        }
        spawned = false
    }

    if (splotionSecsLeft > 0) {
        fill("red")
        circle(tempSplotionX, tempSplotionY, (50 - splotionSecsLeft) * 6)
        splotionSecsLeft--
    }

    if (nave.x < 0 || nave.x > W || nave.y < 0 || nave.y > H) {
        textSize(32)
        fill("red")
        text("Volaste fuera del espacio!", 450, 400)
        text("PERDISTE R para reinicar", 450, 450)
        nave.vivo = false
        meterSpawnTimeCounter = 0
        metersSpawneados = 0
    }
    textSize(50)
    fill("grey")
    text(puntaje, 800, 100)
    textSize(12)

    if (!keyIsDown(UP_ARROW)) pressedSegs = 0
    // Si tengo presionada la tecla de arriba...
    if (keyIsDown(UP_ARROW) && nave.vivo) {
        pressed = true
        pressedSegs += 1
        // Obtengo la direcci??n de la nave con trigonometr??a.
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
        // Obtengo la direcci??n de la nave con trigonometr??a.
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

    data.push(["x", nave.x])
    data.push(["y", nave.y])
    data.push(["vx", nave.vx])
    data.push(["vy", nave.vy])
    data.push(["ax", nave.ax])
    data.push(["ay", nave.ay])

    data.push(["masa", nave.masa])
    data.push(["dt", dt])


    // Aplico una fricci??n proporcional y opuesta a la velocidad de la nave
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
    data.push(["timer", meterSpawnTimeCounter])
    data.push(["holeSpawnTimeCounter", holeSpawnTimeCounter])
    nave.aang = 0
    mostrarText(data)

    for (let estrella = 0; estrella < estrellas.length; estrella++) {
        const es = estrellas[estrella];
        fill("white")
        circle(es.i, es.r, 3)
    }

    for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];

        hole.show()
        hole.appFuerzaHoles()
    }

    // Dibujado de la nave
    translate(nave.x, nave.y)
    rotate(nave.ang)
    rectMode(CENTER)

    fill("#2196F3")
    if (pressedSegs > 0) rect(-30, 0, 10, -25)
    fill("#03A9F4")
    if (pressedSegs > 30) rect(-35, 0, 8, -20)
    fill("#00BCD4")
    if (pressedSegs > 60) rect(-40, 0, 6, -15)

    fill("gray")
    circle(0, 0, 50)

    circle(12, 0, 40)
    fill("cyan")
    circle(12, 0, 30)
    fill("gray")
    //rect(0, 0, 40, 40)
    rect(-20, 0, 10, 30)

    //circle(-12,0,40)
    //circle(19,0,40)



    resetMatrix() // vuelvo la hoja a su lugar

    for (let i = 0; i < bullets.length; ++i) {
        const b = bullets[i]
        if (nave.vivo) b.toMouse();
        b.show();
        if (b.x > W + 10 || b.x < -10 || b.y > H + 10 || b.y < -10) {
            let index = bullets.indexOf(b)
            if (index > -1) bullets.splice(index, 1)
        }
    }

    for (let i = 0; i < meters.length; ++i) {
        const m = meters[i];

        if (m.x > W + 10 || m.x < -10 || m.y > H + 10 || m.y < -10) {
            let index = meters.indexOf(m)
            if (index > -1) meters.splice(index, 1)
        }

        dC0 = dist(m.x, m.y, nave.x, nave.y) < ((m.r / 2) + (26))
        //dC1 = dist(m.x, m.y, nave.x + 19, nave.y) < ((m.r / 2) + (20))

        if (dC0 && !debug) {
            fill("red")
            textSize(32)
            text("PERDISTE! R para reinicar", 450, 450)
            nave.vivo = false
            meterSpawnTimeCounter = 0
        }

        for (let j = 0; j < bullets.length; j++) {
            const b = bullets[j];

            bullMeterColl = dist(m.x, m.y, b.x, b.y) < ((m.r / 2) + (b.r))
            if (!bullMeterColl) continue


            let mindex = meters.indexOf(m)
            let bindex = bullets.indexOf(b)

            if (mindex > -1 && bindex > -1) {
                if (m.vida == 2) {
                    m.vida--
                    bullets.splice(bindex, 1)
                    continue
                }
                meters.splice(mindex, 1)
                bullets.splice(bindex, 1)
                puntaje += 1


            }
        }

        for (let j = 0; j < meters.length; j++) {
            const m1 = meters[j];

            meterColl = dist(m.x, m.y, m1.x, m1.y) < ((m.r / 2) + (m1.r / 2))
            if (!meterColl) continue

            // rebote de asteroides
            let dx = m1.x - m.x
            let dy = m1.y - m.y
            let minDist = m1.r / 2 + m.r / 2
            // calcula el angulo en el que chocan
            let angle = atan2(dy, dx)
            // calcula el nuevo angulo de los asteroides
            let targetX = m.x + cos(angle) * minDist
            let targetY = m.y + sin(angle) * minDist
            // calcula y aplica la nueva velocidad
            let ax = (targetX - m1.x) * 5
            let ay = (targetY - m1.y) * 5
            m.vx -= ax
            m.vy -= ay
            m1.vx += ax
            m1.vy += ay
        }

        if (nave.vivo) m.move();
        m.show();
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
        nave.ax = 0
        nave.ay = 0
        nave.ang = 0
        nave.vang = 0
        nave.vivo = true
        bullets = []
        meters = []
        holes = []
        puntaje = 0
        holeGrowTimeCounter = 0
        holeSpawnTimeCounter = 0
    }


}

function Hole(X, Y, R, C) {

    this.x = X
    this.y = Y
    this.r = R
    this.color = C // 0 for black 255 for white

    this.show = function () {
        fill(this.color)
        circle(this.x, this.y, this.r)
    }

    this.appFuerzaHoles = function () {
        for (const hole of holes) {

            let holeDir = createVector(hole.x - nave.x, hole.y - nave.y).normalize();
            let f = ((hole.r + 250) - dist(nave.x, nave.y, hole.x, hole.y)) * (hole.r / 100)
            if (f < 0 || debug) return

            if (hole.color == 0){
                console.log("black")
                aplicarFuerza(nave, holeDir.x * f, holeDir.y * f)
            }
            if (hole.color == 255){
                console.log("white")
                aplicarFuerza(nave, -(holeDir.x * f), -(holeDir.y * f))
            }
        }
    }
}

function Bullet(X, Y, PX, PY) {
    this.speed = 5;
    this.x = PX;
    this.y = PY;
    this.dir = createVector(X - PX, Y - PY).normalize()
    this.r = 5;

    this.show = function () {
        fill("red")
        circle(this.x, this.y, this.r);
    }
    this.toMouse = function () {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }
}

function Meteorito(X, Y, PX, PY, vida, color) {
    this.speed = 2;
    this.x = PX;
    this.y = PY;
    this.dir = createVector(X - PX, Y - PY).normalize();
    this.vx = 0
    this.vy = 0
    this.ax = 0
    this.ay = 0
    this.masa = 3

    this.vang = 0
    this.ang = 0
    this.aang = 0

    this.r = 30;
    this.vida = vida;

    fuerzaMet = {
        // reemplazar con valor aleatorio entre 20 y 30k para velocidades distintas
        x: this.dir.x * 25000,
        y: this.dir.y * 25000
    }
    aplicarFuerza(this, fuerzaMet.x, fuerzaMet.y)

    this.show = function () {
        fill(color)
        circle(this.x, this.y, this.r)

    }
    this.move = function () {
        calcularFisicas(this, dt)
        for (const hole of holes) {
            let holeDir = createVector(hole.x - this.x, hole.y - this.y).normalize();
            let f = ((hole.r + 250) - dist(this.x, this.y, hole.x, hole.y)) * (hole.r / 200)
            
            if (f < 0) return

            if (hole.color == 0) aplicarFuerza(this, holeDir.x * f, holeDir.y * f)
            if (hole.color == 255) aplicarFuerza(this, -(holeDir.x * f), -(holeDir.y * f))
        }

    }
}

function calcularFisicas(cuerpo, dt) {
    // a -> v -> x
    cuerpo.vx += cuerpo.ax * dt
    cuerpo.vy += cuerpo.ay * dt
    cuerpo.x += cuerpo.vx * dt
    cuerpo.y += cuerpo.vy * dt

    cuerpo.vang += cuerpo.aang * dt
    cuerpo.ang += cuerpo.vang * dt

    cuerpo.ax = 0
    cuerpo.ay = 0
}

function aplicarFuerza(cuerpo, fx, fy) {
    cuerpo.ax += fx / cuerpo.masa
    cuerpo.ay += fy / cuerpo.masa
}

function aplicarTorque(cuerpo, t) {
    cuerpo.aang += t / (cuerpo.masa * 500)
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

const delay = ms => new Promise(res => setTimeout(res, ms))