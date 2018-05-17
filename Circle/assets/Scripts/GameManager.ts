const {ccclass, property} = cc._decorator;

enum Dir {LEFT, RIGHT, TOP, DOWN};

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
    score: number;

    wallLeft: cc.Node;
    wallRight: cc.Node;
    wallTop: cc.Node;
    wallBot: cc.Node;
    size: number;
        
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

        this.wallRight = wall1;
        this.wallTop = wall2;
        this.wallBot = wall3;
        this.wallLeft = wall4;
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
        this.size = 16;

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
        if (this.timerScale >= 500) {
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

        for (let b of this.blockContainer) {
            b.active = false;
        }

        var dir: Dir;

        if (this.player.x + this.player.getComponent(cc.CircleCollider).radius >= this.canvas.node.width / 2) {
            this.player.setPositionX(this.player.getPositionX() - this.canvas.node.width + this.player.getComponent(cc.CircleCollider).radius + 16);
            dir = Dir.RIGHT;
        }
        else if (this.player.x - this.player.getComponent(cc.CircleCollider).radius <= -this.canvas.node.width / 2) {
            this.player.setPositionX(this.player.getPositionX() + this.canvas.node.width - this.player.getComponent(cc.CircleCollider).radius - 16);
            dir = Dir.LEFT;
        }
        else if (this.player.y + this.player.getComponent(cc.CircleCollider).radius >= this.canvas.node.height / 2) {
            this.player.setPositionY(this.player.getPositionY() - this.canvas.node.height + this.player.getComponent(cc.CircleCollider).radius + 16);
            dir = Dir.TOP;
        }
        else if (this.player.y - this.player.getComponent(cc.CircleCollider).radius <= -this.canvas.node.height / 2) {
            this.player.setPositionY(this.player.getPositionY() + this.canvas.node.height - this.player.getComponent(cc.CircleCollider).radius - 16);
            dir = Dir.DOWN;
        }

        this.spawnWall(dir);
    }

    spawnWall(dir: Dir) {
        if (dir == Dir.LEFT || dir == Dir.RIGHT) {
            
            if (dir == Dir.RIGHT) {
                this.wallRight.getChildByName("top").active = false;
                this.wallRight.getChildByName("bot").active = false;
                
                this.wallRight.setPosition(this.wallLeft.getPosition());
                
                this.wallRight.getChildByName("top").active = true;
                this.wallRight.getChildByName("bot").active = true;
                this.wallLeft.destroy();
                this.wallLeft = this.wallRight;
                this.wallTop.destroy();
                this.wallBot.destroy();

                var wRight = cc.instantiate(this.gateVer);
                this.canvas.node.addChild(wRight);
                wRight.setPosition(this.canvas.node.width / 2 - this.size, cc.randomMinus1To1() * (cc.rand() % this.canvas.node.height /2));
                wRight.getChildByName("top").active = true;
                wRight.getChildByName("bot").active = true;
                this.wallRight = wRight;
            }
            else {
                this.wallLeft.getChildByName("top").active = false;
                this.wallLeft.getChildByName("bot").active = false;
                
                this.wallLeft.setPosition(this.wallRight.getPosition());
                cc.log(this.wallLeft.getPosition());
                
                this.wallLeft.getChildByName("top").active = true;
                this.wallLeft.getChildByName("bot").active = true;
                this.wallRight.destroy();
                this.wallRight = this.wallLeft;
                this.wallTop.destroy();
                this.wallBot.destroy();

                var wLeft = cc.instantiate(this.gateVer);
                this.canvas.node.addChild(wLeft);
                wLeft.setPosition(-this.canvas.node.width / 2 + this.size, cc.randomMinus1To1() * (cc.rand() % this.canvas.node.height /2));
                wLeft.getChildByName("top").active = true;
                wLeft.getChildByName("bot").active = true;
                this.wallLeft = wLeft;
            }
            
            var wTop = cc.instantiate(this.gateHor);
            this.canvas.node.addChild(wTop);
            wTop.setPosition(cc.randomMinus1To1() * (cc.rand() % this.canvas.node.width / 2), this.canvas.node.height / 2 - this.size);
            wTop.getChildByName("left").active = true;
            wTop.getChildByName("right").active = true;
            this.wallTop = wTop;

            var wBot = cc.instantiate(this.gateHor);
            this.canvas.node.addChild(wBot);
            wBot.setPosition(cc.randomMinus1To1() * (cc.rand() % this.canvas.node.width / 2), -this.canvas.node.height / 2 + this.size);
            wBot.getChildByName("left").active = true;
            wBot.getChildByName("right").active = true;
            this.wallBot = wBot;
        }
        else {
            if (dir == Dir.DOWN) {
                this.wallBot.getChildByName("left").active = false;
                this.wallBot.getChildByName("right").active = false;
                
                this.wallBot.setPosition(this.wallTop.getPosition());
                
                this.wallBot.getChildByName("left").active = true;
                this.wallBot.getChildByName("right").active = true;
                this.wallTop.destroy();
                this.wallTop = this.wallBot;
                this.wallLeft.destroy();
                this.wallRight.destroy();

                var wBot = cc.instantiate(this.gateHor);
                this.canvas.node.addChild(wBot);
                wBot.setPosition(cc.randomMinus1To1() * (cc.rand() % this.canvas.node.width / 2), -this.canvas.node.height / 2 + this.size);
                wBot.getChildByName("left").active = true;
                wBot.getChildByName("right").active = true;
                this.wallBot = wBot;
            }
            else {
                this.wallTop.getChildByName("left").active = false;
                this.wallTop.getChildByName("right").active = false;
                
                this.wallTop.setPosition(this.wallBot.getPosition());
                
                this.wallTop.getChildByName("left").active = true;
                this.wallTop.getChildByName("right").active = true;
                this.wallBot.destroy();
                this.wallBot = this.wallTop;
                this.wallLeft.destroy();
                this.wallRight.destroy();

                var wTop = cc.instantiate(this.gateHor);
                this.canvas.node.addChild(wTop);
                wTop.setPosition(cc.randomMinus1To1() * (cc.rand() % this.canvas.node.width / 2), this.canvas.node.height / 2 - this.size);
                wTop.getChildByName("left").active = true;
                wTop.getChildByName("right").active = true;
                this.wallTop = wTop;
            }

            var wRight = cc.instantiate(this.gateVer);
            this.canvas.node.addChild(wRight);
            wRight.setPosition(this.canvas.node.width / 2 - this.size, cc.randomMinus1To1() * (cc.rand() % this.canvas.node.height /2));
            wRight.getChildByName("top").active = true;
            wRight.getChildByName("bot").active = true;
            this.wallRight = wRight;

            var wLeft = cc.instantiate(this.gateVer);
            this.canvas.node.addChild(wLeft);
            wLeft.setPosition(-this.canvas.node.width / 2 + this.size, cc.randomMinus1To1() * (cc.rand() % this.canvas.node.height /2));
            wLeft.getChildByName("top").active = true;
            wLeft.getChildByName("bot").active = true;
            this.wallLeft = wLeft;
        }
    }
}
