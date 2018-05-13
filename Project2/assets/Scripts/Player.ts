const {ccclass, property} = cc._decorator;
import game from './GameManager'
enum States {Default, Left, Right};
@ccclass
export default class NewClass extends cc.Component {

    @property speed = 0;
    @property(cc.Canvas) canvas: cc.Canvas = null;

    states: States;

    isPlay: boolean;

    onLoad() {
        // init logic
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));        
        this.states = States.Default;
        this.isPlay = true;

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }

    isTouchStart(touch) {
        if (this.isPlay) {
            if (touch.getLocationX() > this.canvas.node.width / 2) {
                this.moveRight();
            }
            else {
                this.moveLeft();
            }
        }       
    }

    onCollisionEnter(other) {
        if (other.node.group == "spikes") {
            this.isPlay = false;
            game.prototype.gameOver();
            if (this.states == States.Left) {
                this.states = States.Right;
            }
            else {
                this.states = States.Left;
            }
        }
    }

    moveLeft() {
        this.states = States.Left;
        this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 500);
    }

    moveRight() {
        this.states = States.Right;
        this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 500);
    }

    update(dt) {
        switch(this.states) {
            case States.Left: 
                this.node.x -= this.speed * dt;
                break;
            case States.Right:
                this.node.x += this.speed * dt;
                break;
        }
    }
}
