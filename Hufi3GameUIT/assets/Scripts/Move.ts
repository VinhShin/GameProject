const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    jump: number;
    onLoad() {
        // init logic
        this.jump = cc.rand() % 50 + 20;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.p(0, this.jump)).easing(cc.easeCubicActionIn()), 
        cc.moveBy(0.5, cc.p(0, -this.jump)).easing(cc.easeCubicActionOut()))));
    }
}
