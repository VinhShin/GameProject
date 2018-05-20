const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) target: cc.Node = null;

    camera: cc.Camera;

    onLoad() {
        // init logic
        this.camera = this.getComponent(cc.Camera);
    }

    onEnable() {
        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    }

    onDisable() {
        //cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    }

    lateUpdate() {
        // let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);

        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    }
}
