const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Prefab) block: cc.Prefab = null;
    @property(cc.Node) circleSet: cc.Node = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Label) countBlock: cc.Label = null;

    check: boolean;
    blockContainer: cc.Node[] = [];
    count: number;
    timer: number;
        
    onLoad() {
        // init logic
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.isTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.isTouchEnd.bind(this));
    }

    start() {
        this.circleSet.active = false;
        this.check = false;
        this.timer = 0;
        this.count = 0;
        this.countBlock.string = "0 / 3";
    }

    isTouchStart(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        this.circleSet.active = true;
        this.circleSet.setPosition(touch.getLocationX() - this.canvas.node.width / 2, touch.getLocationY() - this.canvas.node.height / 2);


        cc.log("X: " + touch.getLocationX() + " Y: " + touch.getLocationY());
        
    }

    isTouchMove(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        this.circleSet.setPosition(touch.getLocationX() - this.canvas.node.width / 2, touch.getLocationY() - this.canvas.node.height / 2);
    }

    isTouchEnd(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        if (!this.check) {
            cc.log("error");
            this.circleSet.active = false;
            return;
        }
        var Block = cc.instantiate(this.block);

        setTimeout(this.destroyBlock.bind(this), 3000);

        this.canvas.node.addChild(Block);
        Block.setPosition(this.circleSet.getPosition());
        this.circleSet.active = false;
        this.blockContainer.push(Block);
        this.count += 1;
        this.countBlock.string = this.count.toString() + " / 3";
    }

    update(dt) {
        cc.log(this.blockContainer.length);

        if (cc.pDistance(this.player.getPosition(), this.circleSet.getPosition()) 
        <= this.player.width / 2 + this.circleSet.width / 2) {
            this.check = false;
            this.circleSet.color = cc.Color.RED;
        }
        else {
            this.check = true;
            this.circleSet.color = cc.Color.GREEN;
        }
    }

    destroyBlock() {   
        this.blockContainer[0].destroy();
        this.blockContainer.reverse();
        this.blockContainer.pop();
        this.blockContainer.reverse();
        this.count--;
        this.countBlock.string = this.count.toString() + " / 3";
    }
}
