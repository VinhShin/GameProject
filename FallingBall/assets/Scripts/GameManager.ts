const {ccclass, property} = cc._decorator;

enum Rotation {NONE, LEFT, RIGHT};

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Prefab) block: cc.Prefab = null;

    @property speed: number = 0;
    @property speedRotation: number = 0;

    rotation: Rotation;

    prePosY: number;

    distance: number;

    hold: boolean;

    //blocks
    block1: cc.Node;
    block2: cc.Node;

    onLoad() {
        // init logic
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.isTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.isTouchEnd.bind(this));

        this.block1 = cc.instantiate(this.block);
        this.canvas.node.addChild(this.block1);
        this.block1.setPosition(0, 200);
        this.block1.getComponent(cc.BoxCollider).enabled = false;
    
        this.block2 = cc. instantiate(this.block);
        this.canvas.node.addChild(this.block2);
        this.block2.setPosition(cc.randomMinus1To1() * (cc.rand() % cc.director.getWinSize().width - this.block1.width / 2), -(cc.rand() % 400));

        
    }

    start() {
        this.player.getComponent("Player").callbackCollider = this.changeBlock.bind(this);

        this.distance = 232;
        this.hold = false;
    }

    isTouchStart(touch) {
        this.hold = true;
        this.speedRotation = -this.speedRotation;
    }

    isTouchEnd(touch) {
        if(this.hold) {
            this.speedRotation = -this.speedRotation;
        }
    }

    isTouchMove(touch) {

    }

    changeBlock() {
        if (this.player.getPositionX() <= this.block2.getPositionX()) {
            this.speedRotation = -100;
        }
        else {
            this.speedRotation = 100;
        }
        var t = this.block1;

        this.block1 = this.block2;

        this.block2 = t;

        this.block2.setPosition(cc.randomMinus1To1() * (cc.rand() % cc.director.getWinSize().width - this.block1.width / 2), -(cc.rand() % 400));
        this.hold = false;
        this.block2.getComponent(cc.BoxCollider).enabled = true;
        this.block2.rotation = 0;
    }

    update(dt) {
        this.block2.x += this.speed * dt;

        this.block1.rotation += this.speedRotation * dt;

        if (this.block2.x >= this.canvas.node.width / 2 - this.block2.width / 2) {
            this.block2.setPositionX(this.canvas.node.width / 2 - this.block2.width / 2 - 1);
            this.speed = -this.speed;
        }
        if (this.block2.x <= -this.canvas.node.width / 2 + this.block2.width / 2) {
            this.block2.setPositionX(-this.canvas.node.width / 2 + this.block2.width / 2 + 1);
            this.speed = -this.speed;
        }

        if (this.player.getPositionY() > this.block2.getPositionY()) {
            if (Math.floor(this.player.getPositionY()) < this.distance) {
                this.block1.y += Math.floor(this.distance - this.player.getPositionY());
                this.block2.y += Math.floor(this.distance - this.player.getPositionY());
                this.player.y += Math.floor(this.distance - this.player.getPositionY())
            }
            else if (this.player.getPositionY() > this.distance) {
                this.block1.y -= Math.floor(this.player.getPositionY() - this.distance);
                this.block2.y -= Math.floor(this.player.getPositionY() - this.distance);
                this.player.y -= Math.floor(this.player.getPositionY() - this.distance);
            }    
        }
           

    }
}
