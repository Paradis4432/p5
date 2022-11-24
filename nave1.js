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
var torqueGiro = 7000
var multiplicadorFriccion = 0
var multiplicadorFriccionGiro = 1500
var bullets = [];
var meters = [];
var meterSpawnTime = 60;
var meterSpawnTimeCounter = 0;
var estrellas = []
var pressedSegs = 0
var puntaje = 0
var metersSpawneados = 0
const H = 900; const W = 900
function setup() {
    createCanvas(H, W);
    for (let i = 0; i < W; i++) {
        let r = getRandomInt(H)
        if (r % 2 == 0 && i % 2 == 0) estrellas.push({ i, r })

    }
}
let fuerzaCohete = { x: 0, y: 0 }

function draw() {
    background(0); // sacar para hyperspacio

    var dt = deltaTime / 1000
    let data = []

    meterSpawnTimeCounter++
    if (meterSpawnTime == meterSpawnTimeCounter && nave.vivo) {
        meterSpawnTimeCounter = 0
        var vtmp 
        var ctmp
        let r = getRandomInt(4)
        metersSpawneados++
        if(metersSpawneados % 5 == 0){
          vtmp = 2
          ctmp = "red"
        } else {
          vtmp = 1
          ctmp = "rgb(163,158,158)"
        }
        switch (r) {
            case 0:
                // left wall
                meters.push(new Meteorito(nave.x, nave.y, 0, random(H),vtmp,ctmp))
                break;
            case 1:
                // right wall
                meters.push(new Meteorito(nave.x, nave.y, W, random(H),vtmp,ctmp))
                break;
            case 2:
                // top wall
                meters.push(new Meteorito(nave.x, nave.y, random(W),0,vtmp,ctmp))
                break;
            case 3:
                // bottom wall
                meters.push(new Meteorito(nave.x, nave.y, random(W), H,vtmp,ctmp))
                break;
            default:
                break;
        }
    }

    if (nave.x < 0 || nave.x > W || nave.y < 0 || nave.y > H) {
      textSize(32)
      fill("red")
        text("Volaste fuera del espacio!",450, 400)
        text("PERDISTE R para reinicar", 450, 450)
      
        nave.vivo = false
        meterSpawnTimeCounter = 0
      metersSpawneados = 0
    }
  textSize(50)
  fill("grey")
  text(puntaje, 800, 100) 
  textSize(12)
    
    if(!keyIsDown(UP_ARROW)) pressedSegs = 0
    // Si tengo presionada la tecla de arriba...
    if (keyIsDown(UP_ARROW) && nave.vivo) {
      pressed = true
      pressedSegs += 1
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
    data.push(["timer", meterSpawnTimeCounter])
    nave.aang = 0
    mostrarText(data)

    for (let estrella = 0; estrella < estrellas.length; estrella++) {
        const es = estrellas[estrella];
        fill("white")
        circle(es.i, es.r, 3)
    }

    // Dibujado de la nave
    translate(nave.x, nave.y)
    rotate(nave.ang)
    rectMode(CENTER)
  
      fill("#2196F3")
      if(pressedSegs > 0) rect(-30,0,10,-25)
      fill("#03A9F4")
      if(pressedSegs > 30)rect(-35,0,8,-20)
      fill("#00BCD4")
      if(pressedSegs > 60)rect(-40,0,6,-15)
    
    fill("gray")
    circle(0,0,50)
  
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

        if (dC0) {
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

            if (mindex > -1 && bindex > -1){
              if(m.vida == 2){
                m.vida--
                bullets.splice(bindex, 1)
                continue
              }
                meters.splice(mindex, 1)
                bullets.splice(bindex, 1)
            puntaje += 1
                

            }
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
        nave.ang = 0
        nave.vang = 0
        nave.vivo = true
        bullets = []
        meters = []
        puntaje = 0
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
    this.r = 30;
    this.vida = vida;
    this.show = function () {
        fill(color)
        circle(this.x, this.y, this.r)

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
