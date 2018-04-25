const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property speed: number = 0;

    onLoad() {

    }

    start() {
    }

    jumpAction(jump, Distance_X, Distance_Y) {
        this.node.runAction(cc.jumpBy(1, Distance_X, Distance_Y, jump, 1).easing(cc.easeCubicActionInOut()));
    }
}
