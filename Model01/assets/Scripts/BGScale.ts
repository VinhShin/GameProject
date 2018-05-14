const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {
        // init logic
        var width = cc.director.getWinSize().width / this.node.width;
        var height = cc.director.getWinSize().height / this.node.height;

        this.node.setScale(width, height);
    }
}
