// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        prefab: {
            default: null,
            type: cc.Prefab,
        },
        spriteRectList: {
            default : [],
            type : [cc.SpriteFrame]
        },
        spriteCicleList: {
            default : [],
            type : [cc.SpriteFrame]
        },
        groud:{
            default: null,
            type: cc.Node
        },
        player:{
            default:null,
            type: cc.Node
        },
        circle:{
            default: null,
            type: cc.Prefab
        },
        screenInfor:{
            default:null,
            type:cc.Node
        },
        screen:{
            default: null,
            type: cc.Node
        },
        option:{
            default: null,
            type:cc.Node
        },
        giftGame:{
            default:null,
            type:cc.Prefab
        },
        giftGame2:{
            default:null,
            type:cc.Prefab
        },
        jumpAudio:{
            default:null,
            url:cc.AudioClip
        },
        scoreSound:{
            default:null,
            url:cc.AudioClip
        },
        gameAudio:{
            default:null,
            type:cc.AudioSource
        },
        
        jumpDistance: 0,
        speed: 0,
        time:0,
        
        blockList:[],
        circleList:[]
        
    },

    onLoad(){
 
        this.readyJump = false;
        this.particleOpen = 0;
        this.score = 0;
        this.currentColor = "#22FE7C"
        this.GroupX = 0;
        this.GroupY = 180;
        this.CurrentX = 0;
        this.CurrentY = 0;
        this.onGame = 0;

        this.speedMove = 3
        //set score
        this.opWidth = 90
        this.mode = cc.sys.localStorage.getItem("option");
        this.setOptionHardly(this.mode);
        //gift
        this.gift = null;
        this.gift2 = null;
        this.timeGift = 0;
        this.timeGift2 = 0;
    },
    start () {
        this.current = cc.audioEngine.play(this.gameAudio, false, 1);
        this.reset();
        //this.screenInfor.active = false
        cc.director.pause();
    },

    update (dt) {
        this.time += dt;
        
        if (this.readyJump){
            this.jumpDistance += this.speed * dt;
        }
        if(this.time>2){
            this.time = 0;
            this.spawnBlock();
        }
        for(let prefab of this.circleList){
            var distanceCircle = cc.pDistance(this.player.position,prefab.position)
            if(distanceCircle<30){
                prefab.destroy();
                cc.audioEngine.playEffect(this.scoreSound, false);
                this.score++;
                this.screenInfor._children[0].getComponent(cc.Label).string = "Score: "+this.score;
                if(this.particleOpen>0){
                    this.score++;
                }
                this.particleOpen = 5;
                break;
            }
        }
        if(this.player.x + this.groud.x < -300){
            this.overGame();
        }
        //gift 1
        if(this.gift!=null && cc.pDistance(this.player.position,this.gift.position)<30)
        {
            this.timeGift = 10;
            this.gift.destroy();
            cc.audioEngine.playEffect(this.scoreSound, false);
        }
        if(this.timeGift >0){
            this.timeGift -= dt;
        }
        //gift 2
        if(this.gift2!=null && cc.pDistance(this.player.position,this.gift2.position)<30)
        {
            this.timeGift2 = 3;
            this.gift2.destroy();
            cc.audioEngine.playEffect(this.scoreSound, false);
            this.player._children[1].stopAllActions();
            let action1 = cc.scaleTo(0.5,0.8,0.8)
            let action2 = cc.scaleTo(1,2,2)
            let action3 = cc.callFunc(()=>{
                setTimeout(()=>{
                    console.log("da vao roi nak ma onasdas")
                    this.player._children[1].runAction(cc.scaleTo(1,1,1))
              
                },10000)

            })
            this.player._children[1].runAction(cc.sequence(action1,action2,action3))
        }
        if(this.timeGift2 > 0){
            this.timeGift2 -= dt;
        }
        else{
        }
        //particle
        if(this.particleOpen>0){
            this.particleOpen -= dt;
            this.player._children[0].active = true
        }
        else{
            this.player._children[0].active = false;
        }
    },
    startGame() {  
        cc.director.resume()
        this.screen.active = false;
        //this.screenInfor.active = true
        this.gameAudio.play();
        this.onGame = true;
    },
    overGame(){
        this.gameAudio.play();
        cc.audioEngine.stop(this.gameAudio);
        cc.director.loadScene('gamePlay2');
        if(this.score>this.highest){
            this.screenInfor._children[1].getComponent(cc.Label).string="Highest: "+this.score;
            if(this.mode == 3){
                cc.sys.localStorage.setItem("score3",this.score);
            }
            else if(this.mode == 2){
                cc.sys.localStorage.setItem("score2",this.score);
            }
            else{
                cc.sys.localStorage.setItem("score1",this.score);
            }
            
        }
        this.onGame = false;
        
    },
    exitGame(){
        cc.game.end();
    },
    setOptionHardly(i){
        this.highest = cc.sys.localStorage.getItem("score1")
        let textMode = "Easy"
        if(i==3){
            textMode = "Hard"
            this.highest = cc.sys.localStorage.getItem("score3")
            this.opWidth = 90;
            this.speedMove = 2;
        }
        else if(i==2){
            textMode = "Normal"
            this.highest = cc.sys.localStorage.getItem("score2")
            this.speedMove = 2.5;
            this.opWidth = 110;
        }
        else{
            this.opWidth = 130
        }
        console.log(this.highest)
        if(this.highest=="null"){
            this.highest=0;
        }
        this.screenInfor._children[2].getComponent(cc.Label).string = textMode
        this.screenInfor._children[1].getComponent(cc.Label).string="Highest: "+this.highest;
        //set hardly
    },
    showOption(){
        this.option.active = true;
        this.screen.active = false;
    },
    setOptionEasy(){
        cc.sys.localStorage.setItem("option",1);
        cc.director.resume()
        cc.director.loadScene('gamePlay2');
    },
    setOptionNormal(){
        cc.sys.localStorage.setItem("option",2);
        cc.director.resume()
        cc.director.loadScene('gamePlay2');
    },
    setOptionHard(){
        cc.sys.localStorage.setItem("option",3);
        cc.director.resume()
        cc.director.loadScene('gamePlay2');
    },
    reset(){
        //init new block
        let block = cc.instantiate(this.prefab);
        block.parent = this.groud;
        let ps = 0;
        block.position = new cc.v2(this.player.x,this.player.y-12);
        var randomInt = Math.floor(cc.random0To1()*(this.spriteRectList.length-1))

        var sprite = this.spriteRectList[randomInt];
        block.getComponent(cc.Sprite).spriteFrame = sprite;
        var sprite = this.spriteCicleList[randomInt];
        this.player._children[1].getComponent(cc.Sprite).spriteFrame = sprite;
        //set width by hardly
        block.setContentSize(this.opWidth,23)

        let isJump = false;
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            //onGame and have at least 1 block
            if(this.onGame&&this.blockList.length>0){
                this.readyJump = true;
                let action = cc.scaleTo(1,1,0.5)
                this.player.runAction(action)
            }
        },this)

        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
                this.readyJump = false;
                if(!isJump&&this.onGame&&this.blockList.length>0){
                    cc.audioEngine.playEffect(this.jumpAudio, false);

                    this.player.stopAllActions();
                    let action = cc.scaleTo(0.4,1,1);
                    isJump = true;//set that to just able just a time in a block
                    let actionJump = cc.jumpTo(0.5,cc.v2(this.player.x+this.jumpDistance,
                        this.blockList[0].y + 10),200,1)
                    let finish = cc.callFunc(()=>{
                        let checkvalue = this.player.x;
                        var prefab = this.blockList[0];
                        if(checkvalue > prefab.x-prefab.width/2 && checkvalue < prefab.x + prefab.width/2){
                            prefab.stopAllActions();
                            isJump = false;
                            var sprite = this.spriteCicleList[randomInt];
                            this.player._children[1].getComponent(cc.Sprite).spriteFrame = sprite;
                     
                            this.blockList.splice(0, 1);
                            this.score++;
                            this.screenInfor._children[0].getComponent(cc.Label).string = "Score: "+this.score;
                           
                        }
                        else{
                            
                            let actionFall = cc.jumpTo(0.3,cc.v2(this.player.x+50,this.player.y-550),20,1)
                            this.player.runAction(cc.sequence(actionFall,cc.callFunc(()=>{
                                this.overGame()
                                isJump = false;
                            })))
                        }
                    
                    })
                    this.player.runAction(action)
                    this.player.runAction(cc.sequence(actionJump,finish))
                }
                this.jumpDistance = 150;
            
            },this)
            this.spawnBlock();

    },
    spawnBlock: function(){

        this.spwanStar()
        let block = cc.instantiate(this.prefab);
        block.parent = this.groud;

        let rdx = cc.random0To1()*150+100;
        let rdy = (cc.random0To1()*150) + 30 ;
        if(this.blockList.length>0){
            block.position = new cc.v2(this.blockList[this.blockList.length-1].x+rdx, - (this.CurrentY+rdy));
        }
        else
        {
            block.position = new cc.v2(this.CurrentX+rdx, - (this.CurrentY+rdy));          
        }
        var randomInt = Math.floor(Math.random() * this.spriteRectList.length)
        this.currentColor = randomInt;
        var sprite = this.spriteRectList[randomInt];
        block.getComponent(cc.Sprite).spriteFrame = sprite;
        if(this.timeGift>0){
            block.setContentSize(this.opWidth*2,23)
        }
        else{
            block.setContentSize(this.opWidth,23)
        }
        

        let action = cc.moveTo(7,cc.v2(700 + block.x,-(this.CurrentY+rdy)),this)
        block.runAction(action);
        this.blockList.push(block)
        this.GroupX = Math.abs(block.x - this.CurrentX) - 100
        this.CurrentX += this.GroupX 
        this.CurrentY += this.GroupY
        this.groud.runAction(cc.moveBy(this.speedMove, -this.GroupX,this.GroupY))

        if (this.blockList.length>3)
        {
            this.blockList.splice(0, 1);
        }

        //add gift
        let yeh = Math.floor(cc.random0To1()*9)
       if(yeh == 1){
            this.spawnGift();
       }
      if(yeh == 2){
           this.spawnGift2();
      }
    },
    spwanStar: function(){
        let circle = cc.instantiate(this.circle);
        let x = cc.random0To1()*200 + this.player.x + 50;
        let y = - cc.random0To1()*this.GroupY + this.player.y + 50;
        circle.position = cc.v2(x,y);
        circle.parent = this.groud;
        this.circleList.push(circle)
        if (this.circleList.length>3)
        {
            this.circleList.splice(0, 1);
       }
 
    },
    spawnGift: function(){
        let temp = cc.instantiate(this.giftGame);
        let x = cc.random0To1()*200 + this.player.x + 50;
        let y = - cc.random0To1()*this.GroupY + this.player.y + 50;
        temp.position = cc.v2(x,y);
        temp.parent = this.groud;
        this.gift = temp;
 
    },
    spawnGift2: function(){
        let temp = cc.instantiate(this.giftGame2);
        let x = cc.random0To1()*200 + this.player.x + 50;
        let y = - cc.random0To1()*this.GroupY + this.player.y + 50;
        temp.position = cc.v2(x,y);
        temp.parent = this.groud;
        this.gift2 = temp;
 
    },

});
