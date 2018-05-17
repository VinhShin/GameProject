const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Prefab) block: cc.Prefab = null;
    @property(cc.Node) circleSet: cc.Node = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Label) countBlock: cc.Label = null;
    @property(cc.Label) labelScore: cc.Label = null;

    //Wall
    @property(cc.Prefab) wallHor: cc.Prefab = null;
    @property(cc.Prefab) wallVer: cc.Prefab = null;
    @property(cc.Prefab) gateVer: cc.Prefab = null;
    @property(cc.Prefab) gateHor: cc.Prefab = null;

    check: boolean;
    blockContainer: cc.Node[] = [];
    count: number;
    timer: number;
    timerScale: number;
    wallContainer: cc.Node[] = [];
    score: number;
        
    onLoad() {
        // init logic
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.isTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.isTouchEnd.bind(this));

        // init map
        var wall1 = cc.instantiate(this.gateVer);
        this.canvas.node.addChild(wall1);
        wall1.setPosition(this.canvas.node.width / 2 - wall1.getChildByName("top").width / 2, 0);
        wall1.getChildByName("top").active = true;
        wall1.getChildByName("bot").active = true;

        var wall2 = cc.instantiate(this.gateHor);
        this.canvas.node.addChild(wall2);
        wall2.setPosition(0, this.canvas.node.height / 2 - wall2.getChildByName("left").height / 2);
        wall2.getChildByName("left").active = true;
        wall2.getChildByName("right").active = true;

        var wall3 = cc.instantiate(this.gateHor);
        this.canvas.node.addChild(wall3);
        wall3.setPosition(0, -this.canvas.node.height / 2 + wall3.getChildByName("left").height / 2);
        wall3.getChildByName("left").active = true;
        wall3.getChildByName("right").active = true;

        var wall4 = cc.instantiate(this.gateVer);
        this.canvas.node.addChild(wall4);
        wall4.setPosition(-this.canvas.node.width / 2 + wall4.getChildByName("top").width / 2, 0);
        wall4.getChildByName("top").active = true;
        wall4.getChildByName("bot").active = true;

        this.wallContainer.push(wall1);
        this.wallContainer.push(wall2);
        this.wallContainer.push(wall3);
        this.wallContainer.push(wall4);
    }

    start() {
        this.circleSet.active = false;
        this.check = false;
        
        this.timer = 0;
        this.timerScale = 0;

        this.count = 0;
        this.countBlock.string = "0 / 3";
        this.countBlock.node.zIndex = 1;
        this.labelScore.string = "0";
        this.labelScore.node.zIndex = 1;
        this.score = 0;

        this.player.getComponent("Player").callbackCollider = this.gainScore.bind(this);
    }

    isTouchStart(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        this.circleSet.active = true;
        this.circleSet.setPosition(touch.getLocationX() - this.canvas.node.width / 2, touch.getLocationY() - this.canvas.node.height / 2);
        
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
        this.timerScale += dt;
        if (this.timerScale >= 5) {
            this.player.scale += 0.2;
            if (this.player.scale >= 3.4) {
                this.player.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            }
            this.timerScale = 0;
        }

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

    gainScore() {
        this.score++;
        this.labelScore.string = this.score.toString();
        this.timerScale = 0;

        if (this.player.x + this.player.getComponent(cc.CircleCollider).radius >= this.canvas.node.width / 2 - 32) {
            this.player.setPositionX(this.player.getPositionX() - this.canvas.node.width + this.player.getComponent(cc.CircleCollider).radius + 16);
        }
        else if (this.player.x - this.player.getComponent(cc.CircleCollider).radius <= -this.canvas.node.width / 2 + 32) {
            this.player.setPositionX(this.player.getPositionX() + this.canvas.node.width - this.player.getComponent(cc.CircleCollider).radius - 16);
        }
        else if (this.player.y + this.player.getComponent(cc.CircleCollider).radius >= this.canvas.node.height / 2 - 32) {
            this.player.setPositionY(this.player.getPositionY() - this.canvas.node.height + this.player.getComponent(cc.CircleCollider).radius + 16);
        }
        else if (this.player.y - this.player.getComponent(cc.CircleCollider).radius <= -this.canvas.node.width / 2 + 32) {
            this.player.setPositionY(this.player.getPositionY() + this.canvas.node.height - this.player.getComponent(cc.CircleCollider).radius - 16);
        }
    }
}
