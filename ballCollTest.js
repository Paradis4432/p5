let balls = []
let dt = 0

function Ball(X, Y, R) {
    this.x = X
    this.y = Y
    this.r = R
    this.vx = 1
    this.vy = 1
    this.ax = 1
    this.ay = 1
    this.ang = 0
    this.aang = 0
    this.vang = 0
    this.masa = 1
    this.dir = createVector(450 - this.x, 450 - this.y).normalize();

    this.move = function () {

        aplicarFuerza(this, this.dir.x * 200, this.dir.y * 200)

        // get dist between all balls with eachother
        // check collition of each ball with other

        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];

            for (let j = 0; j < balls.length; j++) {
                const other = balls[j];

                if (ball == other) continue

                let dx = other.x - ball.x;
                let dy = other.y - ball.y;
                let minDist = other.r / 2 + ball.r / 2;

                if (dist(ball.x, ball.y, other.x, other.y) < minDist) {
                    console.log("entered")

                    let angle = atan2(dy, dx);
                    let targetX = ball.x + cos(angle) * minDist;
                    let targetY = ball.y + sin(angle) * minDist;
                    let ax = (targetX - other.x) * 5;
                    let ay = (targetY - other.y) * 5;
                    ball.vx -= ax;
                    ball.vy -= ay;
                    other.vx += ax;
                    other.vy += ay;
                }
            }
        }
        calcularFisicas(this, dt)

    }
}


function setup() {
    createCanvas(900, 900);
}

function draw() {
    dt = deltaTime / 1000
    background(220);

    for (const ball of balls) {
        fill("red")
        circle(ball.x, ball.y, ball.r)
        ball.move()
    }

}

function mouseClicked() {
    balls.push(new Ball(mouseX, mouseY, 30))
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