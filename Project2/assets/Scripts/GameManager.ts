const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) player: cc.Node = null;

    onLoad() {
        // init logic
    }

    start() {

    }

    
    

    gameOver() {
        
    }
}
