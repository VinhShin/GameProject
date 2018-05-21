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
        if (other.node.group == "player") {
            if (this.callbackCollider != null) {
                this.callbackCollider();
            }
        }
    }
}
