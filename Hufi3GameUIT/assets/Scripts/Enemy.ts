const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property speedRotation: number = 0;

    callbackCollider: () => void = null;

    onLoad() {
        // init logic
        this.node.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeElasticOut(0.3)));
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    } 

    onCollisionEnter(other) {
        if (this.callbackCollider != null) {
            if (other.node.group == "player") {
                this.callbackCollider();
            }
        }
    }

    update(dt) {
        this.node.rotation += this.speedRotation * dt;
    }
}
