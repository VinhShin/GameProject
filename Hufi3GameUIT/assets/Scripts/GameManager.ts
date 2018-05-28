const {ccclass, property} = cc._decorator;

enum State {MENU, TUTORIAL, INGAME, GAMEOVER,PAUSE};

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Node) circleSet: cc.Node = null;
    @property(cc.Prefab) block: cc.Prefab = null;
    @property(cc.Prefab) enemy: cc.Prefab = null;
    @property(cc.Prefab) friend: cc.Prefab = null;
    @property speed: number = 0;
    @property speedRotation: number = 0;

    //UI
    @property(cc.Node) title: cc.Node = null;
    @property(cc.Button) playButton: cc.Button = null;
    @property(cc.Button) backCreditButton: cc.Button = null;
    @property(cc.Button) creditButton: cc.Button = null;
    @property(cc.Button) shopButton: cc.Button = null;
    @property(cc.Button) soundButton: cc.Button = null;
    @property(cc.Button) soundMuteButton: cc.Button = null;
    @property(cc.Node) gameOverPanel: cc.Node = null;
    @property(cc.Label) labelScore: cc.Label = null;
    @property(cc.Label) bestLabelScore: cc.Label = null;
    @property(cc.Node) credits : cc.Node = null;
    @property(cc.Node) wall : cc.Node = null;
    @property(cc.Node) backgroundMenu : cc.Node = null;
    @property(cc.Node) shopIAP : cc.Node = null;
    @property(cc.Node) BackMenu : cc.Node = null;
    @property(cc.Label) moneyGame: cc.Label = null;
    @property(cc.SpriteFrame) framSprite: cc.SpriteFrame[]=[];  

    //Sound
    @property(cc.AudioClip) menuSound: cc.AudioClip = null;
    @property(cc.AudioClip) gameSound: cc.AudioClip = null;
    @property(cc.AudioClip) scoreSound: cc.AudioClip = null;
    @property(cc.AudioClip) blockSound: cc.AudioClip = null;
    @property(cc.AudioClip) hurtSound: cc.AudioClip = null;


    checkSound: boolean;

    blockContainer: cc.Node[] = [];

    arr1: number[] = [1, 1, 2, 3, 4, 5, 5, 5, 5, 5];
    arr2: number[] = [0, 1, 1, 1, 2, 2, 2, 2, 3, 3];

    level: number;

    dir: number;

    enemyContainer: cc.Node[] = [];
    friendContainer: cc.Node[] = [];

    state: State;

    preLinearVelocity: cc.Vec2;

    count: number;
    timer: number;
    timerScale: number;
    score: number;
    scaleButton: number;
    bestScore:number;
    timeComeBack = 0;
    Money : number;

    isTouch: boolean;
    onLoad() {
        // init logic
        cc.director.getPhysicsManager().debugDrawFlags = 0;

        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.isTouchEnd.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.isTouchMove.bind(this));
     
        this.isTouch = false;
    }

    start() {
        this.checkSound = true;

        this.level = 0;
        this.dir = 0;

        this.state = State.MENU;

        this.scaleButton = 0.0015;

        this.circleSet.active = false;

        this.timer = 0;
        this.timerScale = 0;

        this.count = 0;
        
        this.labelScore.string = "0";
        this.labelScore.node.zIndex = 0;
        this.title.zIndex = 1;
        this.score = 0;

        this.actionBegin();
    }

    actionBegin() {
        this.bestLabelScore.node.active = true;
        this.labelScore.node.zIndex=0;
        this.gameOverPanel.zIndex=10;
        this.state = State.MENU;
        this.title.runAction(cc.moveBy(1, cc.p(0, -600)).easing(cc.easeBackOut()));
        this.playButton.node.opacity = 0;
        this.playButton.node.active = true;

        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        this.gameOverPanel.getComponent("GameOverMenu").reset();

        this.soundButton.node.active = true ;
        this.soundMuteButton.node.active = false ;

        this.bestScore = cc.sys.localStorage.getItem("score")
        if(this.bestScore == null){
            this.bestScore = 0;
        }
        this.bestLabelScore.string = "Best : "+this.bestScore;

        var mn = cc.sys.localStorage.getItem("money")
        if(mn == null){
            this.Money = 0;
        }
        this.Money = mn;
        this.moneyGame.string = this.Money + ""
    }

    PlayButton() {

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                if (keyCode === cc.KEY.back) {
                    this.state = State.PAUSE;
                    this.BackMenu.active = true;
                    cc.director.pause();
                }
                else if (keyCode === cc.KEY.backspace) {
                    // the backspace of PC/Mac is pressed
                }
                else if (keyCode === cc.KEY.escape) {
                    // the escape of PC/Mac is pressed
                }
            }
        }, this.node);


        this.backgroundMenu.active = false;
        this.bestLabelScore.node.active = false;
        cc.audioEngine.stopAll();
        if(this.checkSound)
            cc.audioEngine.playEffect(this.gameSound, true);

        this.spawnMap();
        this.state = State.INGAME;
    
        this.playButton.node.active = false;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        this.player.active = true;
        this.creditButton.node.active = false;
        this.shopButton.node.active = false;

        this.soundButton.node.active = false;
        this.soundMuteButton.node.active = false;


        this.labelScore.node.active = true;

       
    }
    showTutorial(){
        this.title.runAction(cc.moveBy(1, cc.p(0, 600)));    
    }
    resumeGame(){
        cc.director.resume();
        this.BackMenu.active = false;
        cc.director.resume();
        this.state = State.INGAME;
    }
    showMainMenu(){
        this.state = State.MENU;
        this.BackMenu.active = false;
        cc.director.loadScene("Game")
    }
    PlayAgainButton() {

        this.wall.children[4].active = true;
        this.wall.children[5].active = true;
        this.wall.children[6].active = true;
        this.player.groupIndex = 4;
        this.player.opacity = 100;
        this.timeComeBack = 2;
        this.isTouch = false;
        this.state = State.INGAME;
        this.gameOverPanel.active = false;
        this.gameOverPanel.opacity = 0;
        this.gameOverPanel.getComponent("GameOverMenu").reset();

        this.player.active = true;

        this.labelScore.node.active = true;
        this.circleSet.active = false;

        this.player.setPosition(0, -0);
        this.player.scale = 1;

        this.labelScore.node.setPosition(this.labelScore.node.getPositionX(), 600);
        this.labelScore.node.stopAllActions()
        this.labelScore.node.scale = 1;

        
        if (this.checkSound) {
            cc.audioEngine.playEffect(this.gameSound, true);
        }
    }

    HomeButton() {
        cc.director.loadScene("Game");
    }
    InfoButton(){

        this.credits.runAction(cc.moveBy(1, cc.p(0, -1200)).easing(cc.easeBackOut()));

        this.creditButton.enabled = false

        this.backCreditButton.node.active = true ;

        this.playButton.getComponent(cc.Button).enabled = false;
    }

    backCredit(){
        this.credits.runAction(cc.moveBy(1,cc.p(0,1200)).easing(cc.easeBackOut()));
        this.creditButton.enabled = true ;
        this.backCreditButton.node.active = false ;
        this.playButton.getComponent(cc.Button).enabled = true;
    }
    MuteButton()
    {
        if(this.checkSound)
        {
            this.checkSound = false ;
            cc.audioEngine.pauseAll();
            this.soundMuteButton.node.active = true ;
            this.soundButton.node.active = false;
        }
        else{
           this.checkSound = true;
           cc.audioEngine.resumeAll();
           
           this.soundMuteButton.node.active = false ;
           this.soundButton.node.active = true;   
        }
       
    }

    isTouchStart(touch) {
        if (this.state == State.INGAME || this.state == State.TUTORIAL) {
            if (this.state == State.TUTORIAL) {

                this.state = State.INGAME;
            }
            this.isTouch = true;
    
        }
    }

    isTouchMove(touch) {
        
    }

    isTouchEnd(touch) {
        if (this.state == State.INGAME || this.state == State.TUTORIAL) {
            if (this.state == State.TUTORIAL) {
                this.state = State.INGAME;
            }
            this.isTouch = false;
        }  
    }

    destroyBlock() {
        this.blockContainer[0].destroy();
        this.blockContainer.reverse();
        this.blockContainer.pop();
        this.blockContainer.reverse();
        this.count--;

        if(!this.wall.children[6].active){
            this.wall.children[6].active = true;
        }
        else if(!this.wall.children[5].active){
            this.wall.children[5].active = true;
        }
        else if(!this.wall.children[4].active){
            this.wall.children[4].active = true;
        
        }
        
    }

    listSprite: cc.Vec2[] = [];

    spawnMap() {
        
        for (let b of this.blockContainer) {
            b.destroy();
        }
        this.count = 0;

        this.listSprite.splice(0,this.listSprite.length); 
        this.enemyContainer.splice(0, this.enemyContainer.length);
        this.friendContainer.splice(0, this.friendContainer.length);
        var numberEnemy = 0;
        while (numberEnemy != this.arr2[this.level]) {
            var e = cc.instantiate(this.enemy);

            this.canvas.node.addChild(e);
            e.setPosition(this.getRandomeOption(this.listSprite,e));
            e.getComponent("Enemy").callbackCollider = this.gameOver.bind(this);
            numberEnemy++;
            this.enemyContainer.push(e);
            let ps = cc.v2(e.x,e.y);
            this.listSprite.push(ps)
        }

        var numberFriend = 0;
        while (numberFriend != this.arr1[this.level]) {
            var f = cc.instantiate(this.friend);
            this.canvas.node.addChild(f);
            f.setPosition(this.getRandomeOption(this.listSprite,f));
            f.getComponent("Friend").callbackCollider = this.gainScore.bind(this);
            numberFriend++;
            this.friendContainer.push(f);
            let ps = cc.v2(f.x,f.y);
            this.listSprite.push(ps)
        }      

    }
    getRandomeOption(list,e){
        if (list.length>0)
        {
            var distance = 0
            var x = 0;
            var y = 0;
            while(true){
                x = cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.width / 2 - e.width));
                y = cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.height / 2 - e.height));
                var check = 0;
                
                for(let item of list){
                    var ds = cc.pDistance(item,cc.v2(x,y))
                    if(ds<150)
                    {
                        check = 1;
                        break;
                    }
                }
                if(check == 1){
                    continue;
                }
                break;
            }
            return (cc.v2(x,y))

        }
        else{
            return cc.v2(cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.width / 2 - e.width)),
            cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.height / 2 - e.height)))
        }
    }
    gainScore() {
        
        this.dir++;
        this.score++;
        this.Money++;
        this.moneyGame.string = this.Money+"";
        this.labelScore.string = this.score.toString();
        this.timeComeBack = 0;
        if (this.dir == this.arr1[this.level]) {
            if (this.level != this.arr1.length - 1) {
                this.level++;
            }
            for (let i of this.enemyContainer) {
                i.destroy();
            }

            this.dir = 0;
            this.spawnMap();
            this.timeComeBack = 2;
            this.player.groupIndex = 4;
            this.player.opacity = 100;
        }
        this.player.getComponent(cc.Sprite).spriteFrame = this.framSprite[1]
        setTimeout(() => {
            this.player.getComponent(cc.Sprite).spriteFrame = this.framSprite[0]
        }, 1000);
    }

    gameOver() {
        cc.sys.localStorage.setItem("money",this.Money)
        if(this.score>this.bestScore){
            this.bestScore = cc.sys.localStorage.setItem("score",this.score)
        }
        this.state = State.GAMEOVER;
        this.labelScore.node.runAction(cc.moveBy(2, 0, -200));
        this.labelScore.node.runAction(cc.scaleBy(2, 2, 2));
        this.labelScore.node.zIndex = 11;
        cc.audioEngine.stopAll();

    }
    openShop(){
        this.shopIAP.active = true;
        this.shopIAP.children[1].getComponent(cc.Label).string = this.Money+"";
    }
    closeShop(){
        this.shopIAP.active = false;
    }
    update(dt) {
        if(this.timeComeBack>0)
        {
            this.timeComeBack-=dt;
        }
        if(this.timeComeBack<0)
        {
            this.player.groupIndex = 1;
            this.player.opacity = 255;
        }
        switch (this.state) {
            case State.MENU:

                if (this.playButton.node.opacity < 255)
                this.playButton.node.opacity += 5;

                if (this.playButton.node.opacity == 255) {
                    this.playButton.node.scale += this.scaleButton;
                    if (this.playButton.node.scale >= 1.1 || this.playButton.node.scale <= 1) 
                        this.scaleButton = -this.scaleButton;
                }
                break;
            
            case State.TUTORIAL:
                this.player.rotation += this.speedRotation * dt;
            
                if (this.isTouch) {
                    this.player.anchorX += this.speed * dt;
                }
                else {
                    this.player.anchorX -= this.speed * dt;
                }
                if (this.player.anchorX <= 0.5) {
                    this.player.anchorX = 0.5;
                    return;
                }
                if (this.player.anchorX >= 11) {
                    this.player.anchorX = 11;
                    return;
                }
                break;
            
            case State.INGAME:
                this.player.rotation += this.speedRotation * dt;
                this.player.getComponent(cc.CircleCollider).offset.x = -(this.player.width * (this.player.anchorX - 0.5));
            
                if (this.isTouch) {
                    this.player.anchorX += this.speed * dt;
                }
                else {
                    this.player.anchorX -= this.speed * dt;
                }
                if (this.player.anchorX <= 0.5) {
                    this.player.anchorX = 0.5;
                    return;
                }
                if (this.player.anchorX >= 5.5) {
                    this.player.anchorX = 5.5;
                    return;
                }
                break;
            
            case State.GAMEOVER:
                this.preLinearVelocity = this.player.getComponent(cc.RigidBody).linearVelocity;
                this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                this.gameOverPanel.active = true;
                if (this.gameOverPanel.opacity != 255) {
                    this.gameOverPanel.opacity += 51;
                }
                if (this.gameOverPanel.opacity >= 255) {
                    this.gameOverPanel.getComponent("GameOverMenu").isPlay = true;
                }
                cc.audioEngine.stopAll();
                break;
        }
    }

}
