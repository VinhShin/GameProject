const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) block : cc.Prefab = null
    // @property(cc.Prefab) blockSpec : cc.Prefab =null
    timer : number
    posX : number
    timerspec : number
    start()
    {
        this.timer = 0

    }
    onLoad() {
        // init logic
        
    }
    setPos()
    {
        this.posX = cc.rand() % cc.director.getWinSize().width /2 * cc.randomMinus1To1();
    }
    update(dt)
    {
        this.timer += dt;
        this.timerspec += dt;
        if(this.timer > 3)
        {
            
            
                var _block = cc.instantiate(this.block);
                this.setPos();
                _block.setPosition(this.posX,cc.director.getWinSize().height/2);
                this.node.addChild(_block)
                
                this.timer = 0;
           
        }
        // if(this.timerspec > 5)
        // {
        //     var randPre = cc.rand() % 3;
        //     var _blockSpec = cc.instantiate(this.blockSpec);
        //     this.setPos();
        //     _blockSpec.setPosition(this.posX,cc.director.getWinSize().height/2);
        //     this.node.addChild(_blockSpec);
        //     this.timerspec = 0
        // }
    }
}
