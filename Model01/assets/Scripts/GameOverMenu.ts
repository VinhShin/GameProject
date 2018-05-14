const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) playAgain: cc.Node = null;
    @property(cc.Node) home: cc.Node = null;

    isPlay: boolean;

    onLoad() {
        // init logic
        this.isPlay = false;
    }

    reset() {
        this.playAgain.scale = this.home.scale = 0;
    }

    update(dt) {
        // if (this.node.opacity >= 255) {
        //     this.isPlay = true;
        // }
        

        if (this.isPlay) {
            this.playAgain.scale += 0.1;
            this.home.scale += 0.1;
            if (this.playAgain.scale >= 1.25) {
                this.playAgain.scale = this.home.scale = 1.25;
                this.isPlay = false;
            }
        }
    }
}
