jugador = {
    x: 200, y: 200,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    ang: 0,
    vang: 0,
    aang: 0,
    masa: 3, tamanio: 50
}

obstaculo = {
    x: 200, y: 200, tamanio: 30
}

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    dt = deltaTime / 1000


    fill("red")
    rect(jugador.x, jugador.y, jugador.tamanio)

    fill("blue")
    rect(obstaculo.x, obstaculo.y, obstaculo.tamanio)


    aplicarFuerza(jugador, 0, jugador.masa * 100)

    if (jugador.y >= 350) {
        jugador.vy = 0
        jugador.y--
    }
    if (jugador.y <= 0) {
        jugador.vy = 0
        jugador.y++
    }
    if (jugador.x >= 350) {
        jugador.vx = 0
        jugador.x--
    }
    if (jugador.x <= 0) {
        jugador.vx = 0
        jugador.x++
    }


    if (recB.x + recB.w < recA.x 
       recB.y + recB.h < recA.y
    recB.x > recA.x + recA.w ||
        recB.y > recA.y + recA.h )


    {

        calcularFisicas(jugador, dt)


    }

    function mouseClicked() {
        var dir = createVector(jugador.x + jugador.tamanio / 2 - mouseX, jugador.y + jugador.tamanio / 2 - mouseY).normalize();

        jugador.vy -= dir.y * 300
        jugador.vx -= dir.x * 300

    }

    function calcularFisicas(cuerpo, dt) {
        cuerpo.x += cuerpo.vx * dt
        cuerpo.y += cuerpo.vy * dt
        cuerpo.vx += cuerpo.ax * dt
        cuerpo.vy += cuerpo.ay * dt


        cuerpo.vang += cuerpo.aang * dt
        cuerpo.ang += cuerpo.vang * dt

        cuerpo.ax = 0
        cuerpo.ay = 0
    }

    function aplicarFuerza(cuerpo, fx, fy) {
        cuerpo.ax += fx / cuerpo.masa
        cuerpo.ay += fy / cuerpo.masa
    }