const {ccclass, property} = cc._decorator;
import Block from './Block'

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Prefab) block: cc.Prefab = null;
    @property(cc.Graphics) g: cc.Graphics = null;
    jump: number;
    isTouch = false;

    distanceWithBlock_Y: number;
    distanceWithBlock_X: number;
    onLoad() {
        // init logic
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    }

    start() {
        this.jump = 0;
        this.isTouch = false;
        this.distanceWithBlock_X = 0;
        var _block = cc.instantiate(this.block);
        this.g.
        this.canvas.node.addChild(_block);
        _block.setPosition(cc.rand() % (cc.director.getWinSize().width / 3) * cc.randomMinus1To1(), 
        cc.rand() % (cc.director.getWinSize().width / 2) * cc.randomMinus1To1());

        if (this.player.y >= _block.y) {
            if ((this.player.y >= 0 && _block.y >= 0) || (this.player.y < 0 && _block.y < 0)) {
                this.distanceWithBlock_Y = -(Math.abs(this.player.y) - Math.abs(_block.y));
            }
            else {
                this.distanceWithBlock_Y = -(this.player.y - _block.y);
            }
        }
        else {
            if ((this.player.y >= 0 && _block.y >= 0) || (this.player.y < 0 && _block.y < 0)) {
                this.distanceWithBlock_Y = Math.abs(_block.y) - Math.abs(this.player.y);
            }
            else {
                this.distanceWithBlock_Y = _block.y - this.player.y;
            }
        }
    }

    onTouchStart() {
        this.isTouch = true;
        cc.log("Touch");
    }

    onTouchEnd() {
        this.player.getComponent("Player").jumpAction(this.jump, this.distanceWithBlock_X, this.distanceWithBlock_Y);
        this.jump = 0;
        this.isTouch = false;
        cc.log("End");
    }

    update(dt) {
        if (this.isTouch) {
            this.jump += 5;
            this.distanceWithBlock_X += 3;
        }
    }
}
