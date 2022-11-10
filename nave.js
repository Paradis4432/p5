var nave = {
    x: 200, y: 200,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 3
}
var multiplicadorCohete = 300
var torqueGiro = 3000
var multiplicadorFriccion = 2
var multiplicadorFriccionGiro = 1500

function setup() {
    createCanvas(900, 900);
}

function draw() {
    background(220);
    var dt = deltaTime / 1000

    // Si tengo presionada la tecla de arriba...
    if (keyIsDown(UP_ARROW)) {
        // Obtengo la dirección de la nave con trigonometría.
        // Esto me da un vector de longitud 1
        var direccionNave = {
            x: cos(nave.ang),
            y: sin(nave.ang)
        }
        text("direccionNave.x: " + direccionNave.x, 10, 20)
        text("direccionNave.y: " + direccionNave.y, 10, 40)
        // Lo multiplico por el multiplicadorCohete
        var fuerzaCohete = {
            x: direccionNave.x * multiplicadorCohete,
            y: direccionNave.y * multiplicadorCohete
        }
        // y lo aplico como fuerza
        aplicarFuerza(nave, fuerzaCohete.x, fuerzaCohete.y)
    }
    text("nave.ang: " + nave.ang, 10, 60)

    // Aplico una fricción proporcional y opuesta a la velocidad de la nave
    var fuerzaFriccion = {
        x: -nave.vx * multiplicadorFriccion,
        y: -nave.vy * multiplicadorFriccion
    }
    aplicarFuerza(nave, fuerzaFriccion.x, fuerzaFriccion.y)

    // Si estoy apretando izquierda o derecha, aplico un torque
    if (keyIsDown(RIGHT_ARROW)) {
        aplicarTorque(nave, torqueGiro)
    }
    if (keyIsDown(LEFT_ARROW)) {
        aplicarTorque(nave, -torqueGiro)
    }

    // Aplico un torque proporcional y opuesto a la velocidad angular de la nave
    var torqueFriccion = -nave.vang * multiplicadorFriccionGiro
    aplicarTorque(nave, torqueFriccion)

    // Calculo las ecuaciones de movimiento
    calcularFisicas(nave, dt)

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

    // Instrucciones
    resetMatrix() // vuelvo la hoja a su lugar
    fill("black")
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
    cuerpo.aang = 0
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