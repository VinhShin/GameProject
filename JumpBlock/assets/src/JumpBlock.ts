const {ccclass, property} = cc._decorator;
import Block from './Block'

@ccclass
export default class JumpBlock extends cc.Component {

    posX : number;
    posY : number;
    width : number;
    height : number;
    prevB : Block;
    
    @property(cc.Graphics)
    private g: cc.Graphics = null;
    
    getPotison()
    {}
    start()
    {
        this.prevB = new Block();
        this.createBlock();
        // cc.log('xxx '+ this.prevB.posX);
        // this.spamBlock();
        cc.log("pos x "+ this.posX +" pos y"+ this.posY);
    }
    getWidHe()
    {
        this.width = cc.rand() % 120 + 40;
        this.height = 30;
        
        this.posX = (cc.rand() % (cc.director.getWinSize().width/2) + cc.director.getWinSize().width /8 - this.width) * cc.randomMinus1To1();
        this.posY = cc.rand() % (cc.director.getWinSize().height/2)* cc.randomMinus1To1() + cc.director.getWinSize().height /8;
    }
    spamBlock()
    {
        this.createBlock();
    }
    createBlock()
    {
            this.getWidHe();
            this.posX += this.prevB.posX;
            this.g.rect(this.posX, this.posY,this.width,this.height);
            this.g.fillColor = cc.Color.RED;
            this.g.fill();
            this.prevB.posX = this.posX ;
            this.prevB.posY = this.posY;
            this.prevB.widthB = this.width;
            var  Vec2 = cc.v2(this.posX,this.posY);
           
            cc.log(Vec2);
    }

    onLoad() {
        
        
    }
    update(){
       
    }
}
