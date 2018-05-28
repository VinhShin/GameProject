const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    timer: number;

    onLoad() {
        // init logic
        this.timer = 0;
    }

    update(dt) {
        this.timer += dt;
        if (this.timer > 1) {
            cc.director.loadScene("Game");
        }
    }
}
