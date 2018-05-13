const {ccclass, property} = cc._decorator;
enum States { Left, Right};
@ccclass
export default class NewClass extends cc.Component {

    
    speed : number
    
    states: States
    vec : number
    fire : number
    onLoad() {
         // init logic
         cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
     }
     start()
     {
         
         this.speed = cc.rand() % 500 +100;
         this.states = States.Left;

         this.vec = 1;
         this.fire = 1;
     }
     onCollisionEnter(other) {
        if (this.states == States.Left) {
            this.states = States.Right;
        }
        else {
            this.states = States.Left;
        }
    }
     
     update(dt)
     {
       this.node.y -= this.speed * dt * this.fire;
       this.node.x += this.speed * dt * this.vec;
       if(this.node.x > cc.director.getWinSize().width /2 -50)
        {
            this.vec = -1
           
        }
        else if(this.node.x < cc.director.getWinSize().width /2 * -1 + 50)
        {
            this.vec = 1;
        }
        if(this.node.y < -cc.director.getWinSize().height /2 +50)
        {
            this.fire = -3;
        }
     }
}
