const {ccclass, property} = cc._decorator;

enum State {isBegin, isPlay, isOver};

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Button) playButton: cc.Button = null;
    @property(cc.Node) title: cc.Node = null;
    @property(cc.Node) gameOverPanel: cc.Node = null;

    scaleButton: number;

    state: State;

    onLoad() {
        // init logic
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
    }

    start() {
        this.scaleButton = 0.0015;
        

        this.actionBegin();
    }

    onTouchStart(touch) {
        if (this.state == State.isBegin) {
            this.PlayButton();
        }
        else {
            this.state = State.isOver;
        }
    }

    actionBegin() {
        this.state = State.isBegin;
        this.title.runAction(cc.moveBy(1, cc.p(0, -300)).easing(cc.easeBackOut()));
        this.playButton.node.opacity = 0;
        this.playButton.node.active = true;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        this.gameOverPanel.getComponent("GameOverMenu").reset();
    }

    PlayButton() {
        this.state = State.isPlay;
        this.title.runAction(cc.moveBy(0.5, cc.p(0, 300)));        
        this.playButton.node.active = false;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
    }

    PlayAgainButton() {
        this.state = State.isPlay;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        this.gameOverPanel.getComponent("GameOverMenu").reset();
    }

    gameOver() {
        
    }

    update(dt) {

        switch(this.state) {
            case State.isBegin:
                if (this.playButton.node.opacity < 255)
                this.playButton.node.opacity += 5;

                if (this.playButton.node.opacity == 255) {
                    this.playButton.node.scale += this.scaleButton;
                    if (this.playButton.node.scale >= 1.1 || this.playButton.node.scale <= 1) 
                        this.scaleButton = -this.scaleButton;
                }
                break;
            
            case State.isPlay:
                break;
            case State.isOver:
                this.gameOver();
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
