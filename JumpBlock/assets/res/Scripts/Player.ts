const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property speed: number = 0;

    camera: cc.Camera;
    anim: cc.Animation;

    onLoad() {

    }

    start() {
        this.anim = this.getComponent(cc.Animation);
    }

    jumpAction(jump, Distance_X, Distance_Y) {
        this.anim.play("PlayerJump");
        this.node.runAction(cc.jumpBy(2, Distance_X, Distance_Y, jump, 1).easing(cc.easeCubicActionInOut()));
        cc.delayTime(2);
        this.anim.play("PlayerIdle");
    }
}
