// Basic setup
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
 type = "canvas";
}

PIXI.utils.sayHello(type);
let canvasSize = {width: window.innerWidth, height: window.innerHeight};
let app = new PIXI.Application({width: canvasSize.width, height: canvasSize.height, antialias: true});
document.body.appendChild(app.view);


// Variables
let circle, state;
let circleSize = 5;


// Game methods
function setup() {
    //Set the game state
    // state = move;
    state = createAgents(500);
    console.log(state)
    
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
    //Update the current game state:
    state.forEach((agent) => {
        agent.updateState();
        agent.performAction(state); 
    });
    
    move(delta);
}

function move(delta) {
    // console.log(state);
    //Use the circle's velocity to make it move
    state.forEach(agent => {
        let node = agent.entity;
        if (node.x + node.vx <= canvasSize.width - circleSize && node.x + node.vx >= circleSize) node.x = node.x + node.vx;
        if (node.y + node.vy <= canvasSize.height - circleSize && node.y + node.vy >= circleSize) node.y = node.y + node.vy;
    });
}

// Help Functions
function createAgents(agentsNumber) {
    let environment = [];
    
    for (let i = 0; i < agentsNumber; i++) {
        //Create the `circle` sprite 
        circle = new PIXI.Graphics()
        circle.beginFill(0x7fffd4);
        circle.drawCircle(0, 0, circleSize);
        circle.endFill();
        
        let mx = 10
        let vx = getRandomInt(0, mx);
        // let vx = mx;
        let vy = mx*mx - vx*vx;
        
        let state = {
            type: 0,
            width: circleSize*2,
            height: circleSize*2,
            // x: canvasSize.width/2,
            // y: canvasSize.height/2,
            x: getRandomInt(circleSize*2, canvasSize.width - circleSize*2),
            y: getRandomInt(circleSize*2, canvasSize.height - circleSize*2),
            vx: vx,
            vy: vy,
            canvasSize: canvasSize
        }
        
        circle.x = state.x;
        circle.y = state.y;
        circle.vx = state.vx;
        circle.vy = state.vy;
        app.stage.addChild(circle);
        
        let agent = new Agent(circle, state, 
            [
            (state, environment) => {
                return state;
            },
            // (state, environment) => {
            //   state.vx *= -1;
            //   state.vy *= -1;
            //   return state;
            // },
            (state, environment) => {
                let x = state.vx;
                let y = state.vy;
                let t = Math.PI/18;
                state.vx = x*Math.cos(t) - y*Math.sin(t);
                state.vy = x*Math.sin(t) + y*Math.cos(t);
                
                return state;
            },
            (state, environment) => {
                let x = state.vx;
                let y = state.vy;
                let t = -Math.PI/18;
                
                state.vx = x*Math.cos(t) - y*Math.sin(t);
                state.vy = x*Math.sin(t) + y*Math.cos(t);
                
                return state;
            }
            ], 
            (state, environment) => {
                let env = environment.filter((node) => node.state.type == 0);
                let e = environment.map((agent) => {
                    let x = state.x + state.vx;
                    let y = state.y + state.vy;
                    let dx = x - (agent.state.x);
                    let dy = y - (agent.state.y);
                    
                    let v = Math.sqrt(dx*dx + dy*dy);
                    // let v = dx;
                    return v;
                });
                
                let s = e.reduce((agregation, value) => {
                    return agregation + value;
                });
                
                let x = Math.sqrt((state.x - canvasSize.width/2)*(state.x - canvasSize.width/2) + (state.y - canvasSize.height/2)*(state.x - canvasSize.height/2));
                
                let gaussian = (x, s, u) => {return Math.exp(-0.5*((x-u)/s)*((x-u)/s))/(s*Math.sqrt(2*Math.PI))}
                
                let res = gaussian(x, 1, 10);
                
                // Compute the midle line heuristic
                
                // return Math.sin(s);
                // return Math.log(res) + Math.sin(s);
                return 1/s;
                // s /= e.length;
                // if (s < 130 && s > 0) return -s;
                // if (s < 460 && s > 400) return -s;
                // return s;
            }
        );
        
        environment.push(agent);
    }
    
    return environment;
}

/*
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function calls
setup();