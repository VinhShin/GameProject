const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    callbackCollider: () => void = null;

    onLoad() {
        // init logic
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }

    onCollisionEnter(other) {
        if (other.node.group != "combo") {
            if (this.callbackCollider != null) {
                this.callbackCollider();
            }
            cc.log("Collision");
    
            other.getComponent(cc.BoxCollider).enabled = false;
            this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
        }
    }
}
