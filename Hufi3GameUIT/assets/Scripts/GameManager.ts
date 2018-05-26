const {ccclass, property} = cc._decorator;

enum State {MENU, INGAME, GAMEOVER};

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) player: cc.Node = null;
    @property(cc.Node) circleSet: cc.Node = null;
    @property(cc.Prefab) block: cc.Prefab = null;
    @property(cc.Prefab) enemy: cc.Prefab = null;
    @property(cc.Prefab) friend: cc.Prefab = null;
    @property(cc.Node) gameFail: cc.Node = null;
    blockContainer: cc.Node[] = [];

    arr1: number[] = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
    arr2: number[] = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5];

    level: number;

    score: number;

    dir: number;

    enemyContainer: cc.Node[] = [];
    friendContainer: cc.Node[] = [];

    state: State;

    preLinearVelocity: cc.Vec2;

    onLoad() {
        // init logic
        cc.director.getPhysicsManager().debugDrawFlags = 0;

        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.isTouchEnd.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.isTouchMove.bind(this));
    }

    start() {
        this.level = 0;
        this.dir = 0;

        this.spawnMap();
        this.state = State.INGAME;
    }

    isTouchStart(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        this.circleSet.active = true;
        this.circleSet.setPosition(touch.getLocationX() - this.canvas.node.width / 2, touch.getLocationY() - this.canvas.node.height / 2);

        if (cc.pDistance(this.player.getPosition(), this.circleSet.getPosition()) <= this.player.width / 2 + this.circleSet.width / 2) {
            this.circleSet.color = cc.Color.RED;
        }
        else {
            this.circleSet.color = cc.Color.GREEN;
        }
        for (let s of this.listSprite) {
        
            if (cc.pDistance(this.circleSet.getPosition(), s) <= this.circleSet.width / 2 + 40) {
                this.circleSet.color = cc.Color.RED;
                return;
            }
        }
    }

    isTouchMove(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        this.circleSet.setPosition(touch.getLocationX() - this.canvas.node.width / 2, touch.getLocationY() - this.canvas.node.height / 2);

        if (cc.pDistance(this.player.getPosition(), this.circleSet.getPosition()) <= this.player.width / 2 + this.circleSet.width / 2) {
            this.circleSet.color = cc.Color.RED;
        }
        else {
            this.circleSet.color = cc.Color.GREEN;
        }
        for (let s of this.listSprite) {
        
            if (cc.pDistance(this.circleSet.getPosition(), s) <= this.circleSet.width / 2 + 50) {
                this.circleSet.color = cc.Color.RED;
                return;
            }
        }
    }

    isTouchEnd(touch) {
        if (this.blockContainer.length == 3) {
            return;
        }
        if (this.circleSet.color.toString() == cc.Color.RED.toString()) {
            this.circleSet.active = false;
            return;
        }
        var b = cc.instantiate(this.block);
        setTimeout(this.destroyBlock.bind(this), 3000);
        this.canvas.node.addChild(b);
        b.setPosition(this.circleSet.getPosition());
        this.circleSet.active = false;
        this.blockContainer.push(b);
    }

    destroyBlock() {
        this.blockContainer[0].destroy();
        this.blockContainer.reverse();
        this.blockContainer.pop();
        this.blockContainer.reverse();
    }

    listSprite: cc.Vec2[] = [];

    spawnMap() {
        // var numberEnemy = 0;
        // while (numberEnemy != this.arr2[this.level]) {
        //     var e = cc.instantiate(this.enemy);
        //     this.canvas.node.addChild(e);
        //     e.setPosition(cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.width / 2 - e.width)), cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.height / 2 - e.height)));
        //     numberEnemy++;
        //     this.enemyContainer.push(e);
        // }

        // var numberFriend = 0;
        // while (numberFriend != this.arr1[this.level]) {
        //     var f = cc.instantiate(this.friend);
        //     this.canvas.node.addChild(f);
        //     f.setPosition(cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.width / 2 - f.width)), cc.randomMinus1To1() * (cc.rand() % (this.canvas.node.height / 2 - f.height)));
        //     numberFriend++;
        // }  
        for (let b of this.blockContainer) {
            b.destroy();
        }
        this.listSprite.splice(0,this.listSprite.length - 1);  
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
        if (this.dir == this.arr1[this.level]) {
            if (this.level != this.arr1.length - 1) {
                this.level++;
            }
            for (let i of this.enemyContainer) {
                i.destroy();
            }
            
            this.dir = 0;
            this.spawnMap();
        }
    }

    gameOver() {
        this.preLinearVelocity = this.player.getComponent(cc.RigidBody).linearVelocity;
        this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.gameFail.active = true;

    }
    restartGame(){
        this.gameFail.active = false;
        cc.director.loadScene("Game")
    }
    update(dt) {
        switch (this.state) {
            case State.MENU:
                break;
            
            case State.INGAME:
            

            
                break;
            
            case State.GAMEOVER:
                break;
                
        }
    }

}
