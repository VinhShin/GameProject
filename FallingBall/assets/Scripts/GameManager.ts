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

    //UI
    @property(cc.Label) comboLabel: cc.Label = null;
    @property(cc.Label) title: cc.Label = null;
    @property(cc.Node) labelScore: cc.Node = null;
    @property(cc.Button) playBtn: cc.Button = null;
    @property(cc.Node) gameOverPanel: cc.Node = null;
    @property(cc.Node) tutorial: cc.Node = null;

    //Wall
    @property(cc.Node) wallLeft: cc.Node = null;
    @property(cc.Node) wallRight: cc.Node = null;

    //Sounds
    @property(cc.AudioClip) menuSound: cc.AudioClip = null;
    @property(cc.AudioClip) gameSound: cc.AudioClip = null;
    @property(cc.AudioClip) scoreSound: cc.AudioClip = null;
    @property(cc.AudioClip) blockSound: cc.AudioClip = null;

    @property speed: number = 0;
    @property speedRotation: number = 0;

    rotation: Rotation;
    distance: number;
    scaleButton: number;

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
    }

    initMap() {
        //init Map

        if (this.block1 != null) {
            this.block1.destroy();
            this.block2.destroy();
        }

        this.block1 = cc.instantiate(this.block);
        this.canvas.node.addChild(this.block1);
        this.block1.setPosition(0, 200);
        this.block1.getComponent(cc.BoxCollider).enabled = false;
    
        this.block2 = cc. instantiate(this.block);
        this.canvas.node.addChild(this.block2);
        this.block2.setPosition(cc.randomMinus1To1() * (cc.rand() % this.canvas.node.width / 2 - this.block1.width / 2), -(cc.rand() % 400));

        this.posXBlock1 = this.block1.getPositionX();
        this.posYBlock2 = this.block2.getPositionY();

        this.comboBlock.setPosition(this.block2.getPosition());

        this.comboLabel.node.setPosition(-this.canvas.node.width / 2 + 30, this.canvas.node.height / 2 - 150);
        this.title.node.setPosition(0, this.canvas.node.height / 2 + 100);
    }

    start() {
        this.player.getComponent("Player").callbackCollider = this.changeBlock.bind(this);
        this.comboBlock.getComponent("Combo").callbackCollider = this.gainCombo.bind(this);

        cc.audioEngine.playEffect(this.menuSound, true);

        this.actionBegin();

        this.scaleButton = 0.0015;

        this.distance = 232;
        this.hold = false;

        this.wallLeft.setPosition(-this.canvas.node.width / 2 - this.wallLeft.width / 2, 0);
        this.wallRight.setPosition(this.canvas.node.width / 2 + this.wallRight.width / 2, 0);

        this.state = State.MENU;
        this.comboBlock.zIndex = 1;
    }

    initGame() {
        this.score = 0;
        this.combo = 0;
        this.preCom = 0;

        this.labelScore.getChildByName("score").getComponent(cc.Label).string = this.score.toString();
    }

    actionBegin() {
        this.initGame();
        

        this.state = State.MENU;
        this.title.node.runAction(cc.moveBy(1, cc.p(0, -300)).easing(cc.easeBackOut()));
        this.playBtn.node.opacity = 0;
        this.playBtn.node.active = true;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        this.gameOverPanel.getComponent("GameOverMenu").reset();
    }

    PlayButton() {
        this.initMap();

        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.gameSound, true);
        this.state = State.TUTORIAL;
        this.title.node.runAction(cc.moveBy(1, cc.p(0, 300)));        
        this.playBtn.node.active = false;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;

        this.player.active = true;
        this.tutorial.active = true;
        this.labelScore.active = true;
    }

    PlayAgainButton() {
        this.state = State.TUTORIAL;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        if (this.speedRotation < 0) {
            this.speedRotation = -this.speedRotation;
        }
        this.gameOverPanel.getComponent("GameOverMenu").reset();
        this.initMap();

        this.trap.setPosition(-1000, -1000);

        this.initGame();
        
        this.tutorial.active = true;
        this.player.setPosition(0, 250);
        this.player.active = false;
        this.player.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);

        cc.audioEngine.playEffect(this.gameSound, true);
    }

    HomeButton() {
        cc.director.loadScene("Game");
    }




    isTouchStart(touch) {
        if (this.state == State.INGAME || this.state == State.TUTORIAL) {
            if (this.state == State.TUTORIAL) {
                this.tutorial.active = false;
                this.state = State.INGAME;
                this.player.active = true;
            }
            else {
                this.hold = true;
                this.speedRotation = -this.speedRotation;
            }
            
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
        if (this.player.getPositionX() < this.block2.getPositionX()) {
            this.speedRotation = -150;
        }
        else {
            this.speedRotation = 150;
        }
        var t = this.block1;

        this.block1 = this.block2;

        this.block2 = t;

        this.block2.setPosition(cc.randomMinus1To1() * (cc.rand() % this.canvas.node.width / 2 - this.block1.width / 2), -(cc.rand() % 400));

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
                if (this.block1.getPositionY() - this.block2.getPositionY() > 400) {
                    this.trap.active = true;
                    this.trap.setPosition(this.posXBlock1 + this.block1.width * cc.randomMinus1To1(), cc.rand() % this.block2.getPositionY() - 150);
                    if (this.trap.getPositionY() >= this.block1.getPositionY() - 200) {
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
                if (this.playBtn.node.opacity < 255)
                this.playBtn.node.opacity += 5;

                if (this.playBtn.node.opacity == 255) {
                    this.playBtn.node.scale += this.scaleButton;
                    if (this.playBtn.node.scale >= 1.1 || this.playBtn.node.scale <= 1) 
                        this.scaleButton = -this.scaleButton;
                }

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

                if (this.player.getPositionY() < -this.canvas.node.height / 2) {
                    this.state = State.GAMEOVER;
                    cc.audioEngine.stopAll();
                }
                break;

            case State.GAMEOVER: 

                this.gameOverPanel.active = true;
                if (this.gameOverPanel.opacity != 255) {
                    this.gameOverPanel.opacity += 51;
                }
                if (this.gameOverPanel.opacity >= 255) {
                    this.gameOverPanel.getComponent("GameOverMenu").isPlay = true;
                }
                break;

        }
        
           

    }
}
