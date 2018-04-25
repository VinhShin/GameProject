const {ccclass, property} = cc._decorator;

@ccclass
export default class Block {

   posX: number;
   widthB: number;
    posY: number;
    constructor()
    {
        this.posX = 0;
        this.widthB = 0;
        this.posY = 0 ;
    }
   setBlock(x,y,widthB)
   {
       this.posX = x;
       this.widthB = widthB;
       this.posY = y;
   }
    onLoad() {
        // init logic
        
    }
}
