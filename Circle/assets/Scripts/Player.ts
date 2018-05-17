const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    @property(cc.Node) game: cc.Node = null;

    callbackCollider: () => void = null;

    onLoad() {
        // init logic
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }

    start() {

    }

    onCollisionExit(other) {
        if (this.callbackCollider != null) {
            this.callbackCollider();
        }
    }

    update(dt) {

    }
}
