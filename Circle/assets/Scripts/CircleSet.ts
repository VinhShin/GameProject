const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property speedRotation: number = 0;

    onLoad() {
        // init logic
        
    }

    update(dt) {
        this.node.rotation += this.speedRotation * dt;
    }
}
