const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onLoad() {
        this.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,1.05,1.05),cc.scaleTo(1,1,1))))
    }
}
