const {ccclass, property} = cc._decorator;

enum Rotation {NONE, LEFT, RIGHT};
enum State {MENU, TUTORIAL, INGAME, GAMEOVER};

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Prefab) block: cc.Prefab = null;
    @property(cc.Node) trap: cc.Node = null;
    @property(cc.Node) comboBlock: cc.Node = null;
    @property(cc.Label) comboLabel: cc.Label = null;

    //Wall
    @property(cc.Node) wallLeft: cc.Node = null;
    @property(cc.Node) wallRight: cc.Node = null;

    @property(cc.Node) labelScore: cc.Node = null;

    @property speed: number = 0;
    @property speedRotation: number = 0;

    rotation: Rotation;
    distance: number;

    hold: boolean;

    state: State;

    score: number;
    combo: number;
    preCom: number;

    posXBlock1: number;
    posYBlock2: number;

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

        this.posXBlock1 = this.block1.getPositionX();
        this.posYBlock2 = this.block2.getPositionY();

        this.comboLabel.node.setPosition(-this.canvas.node.width / 2 + 30, this.canvas.node.height / 2 - 150);
    }

    start() {
        this.player.getComponent("Player").callbackCollider = this.changeBlock.bind(this);
        this.comboBlock.getComponent("Combo").callbackCollider = this.gainCombo.bind(this);

        this.distance = 232;
        this.hold = false;

        this.wallLeft.setPosition(-this.canvas.node.width / 2 - this.wallLeft.width / 2, 0);
        this.wallRight.setPosition(this.canvas.node.width / 2 + this.wallRight.width / 2, 0);

        this.state = State.MENU;
        this.comboBlock.zIndex = 1;

        this.score = 0;
        this.combo = 0;
        this.preCom = 0;

        this.labelScore.getChildByName("score").getComponent(cc.Label).string = this.score.toString();
    }

    isTouchStart(touch) {
        if (this.state == State.MENU) {
            this.state = State.INGAME;
            this.labelScore.active = true;
        }
        if (this.state == State.INGAME) {
            this.hold = true;
            this.speedRotation = -this.speedRotation;
        }  
    }

    gainCombo() {
        this.combo++;
    }

    isTouchEnd(touch) {
        if (this.state == State.INGAME) {
            if(this.hold) {
                this.speedRotation = -this.speedRotation;
            }
        }
    }

    isTouchMove(touch) {

    }

    changeBlock() {
        this.preCom++;
        if (this.combo < this.preCom) {
            this.combo = 0;
            this.preCom = 0;
        }

        if (this.combo > 1) {
            this.comboLabel.node.opacity = 255;
            this.comboLabel.string = "Combo x" + this.combo.toString();
        }

        this.trap.active = false;
        if (this.player.getPositionX() <= this.block2.getPositionX()) {
            this.speedRotation = -150;
        }
        else {
            this.speedRotation = 150;
        }
        var t = this.block1;

        this.block1 = this.block2;

        this.block2 = t;

        this.block2.setPosition(cc.randomMinus1To1() * (cc.rand() % cc.director.getWinSize().width - this.block1.width / 2), -(cc.rand() % 400));
        this.hold = false;
        this.block2.getComponent(cc.BoxCollider).enabled = true;
        this.block2.rotation = 0;
        if (this.combo >= 10) {
            this.score += 10;
        }
        else if (this.combo > 1) {
            this.score += this.combo;
        }
        else {
            this.score++;
        }
        this.labelScore.getChildByName("score").getComponent(cc.Label).string = this.score.toString();
        this.comboBlock.setPosition(this.block2.getPosition());

        this.posXBlock1 = this.block1.getPositionX();
        this.posYBlock2 = this.block2.getPositionY();

        if (this.score >= 0) {
            if (cc.random0To1() > 0.5) {
                if (this.block1.getPositionY() - this.block2.getPositionY() > 300) {
                    this.trap.active = true;
                    this.trap.setPosition(this.posXBlock1 + this.block1.width * cc.randomMinus1To1(), cc.rand() % this.block2.getPositionY() - 150);
                    if (this.trap.getPositionY() < this.block1.getPositionY()) {
                        this.trap.setPositionY(this.block1.getPositionY() - 200);
                    }
                    cc.log("Spawn");
                }
            }
        }
    }

    update(dt) {
        switch(this.state) {
            case State.MENU:
            break;
            case State.TUTORIAL:
            break;
            case State.INGAME:
                if (this.comboLabel.node.opacity > 0) {
                    this.comboLabel.node.opacity -= 5;
                } else {
                    this.comboLabel.node.opacity = 0;
                }
                
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

                this.comboBlock.setPosition(this.block2.getPosition());

                if (this.player.getPositionY() > this.block2.getPositionY()) {
                    if (Math.floor(this.player.getPositionY()) < this.distance) {
                        this.comboBlock.y += Math.floor(this.distance - this.player.getPositionY());
                        this.trap.y += Math.floor(this.distance - this.player.getPositionY());
                        this.block1.y += Math.floor(this.distance - this.player.getPositionY());
                        this.block2.y += Math.floor(this.distance - this.player.getPositionY());
                        this.player.y += Math.floor(this.distance - this.player.getPositionY())
                        cc.log(this.trap.y);
                    }
                    else if (this.player.getPositionY() > this.distance) {
                        this.comboBlock.y -= Math.floor(this.player.getPositionY() - this.distance);
                        this.trap.y -= Math.floor(this.player.getPositionY() - this.distance);
                        this.block1.y -= Math.floor(this.player.getPositionY() - this.distance);
                        this.block2.y -= Math.floor(this.player.getPositionY() - this.distance);
                        this.player.y -= Math.floor(this.player.getPositionY() - this.distance);  
                    }    
                }
                break;

            case State.GAMEOVER: 
            break;
        }
        
           

    }
}
