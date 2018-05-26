const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) player: cc.Node = null;
    @property speedRotation: number = 0;

    onLoad() {
        // init logic
        
    }

    update(dt) {
        this.node.rotation += this.speedRotation * dt;
        // if (cc.pDistance(this.player.getPosition(), this.node.getPosition()) <= this.player.width / 2 + this.node.width / 2) {
        //     this.node.color = cc.Color.RED;
        // }
        // else {
        //     this.node.color = cc.Color.GREEN;
        // }
    }
}
