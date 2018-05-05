const {ccclass, property} = cc._decorator;

enum Direction {UP, DOWN, LEFT, RIGHT};

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Prefab) prefabSnake: cc.Prefab = null;

    Snake: cc.Node[] = [];
    timer: number;

    color: cc.Color[] = [cc.Color.RED, cc.Color.BLUE, cc.Color.WHITE, cc.Color.GREEN, cc.Color.ORANGE,
    cc.Color.YELLOW, cc.Color.MAGENTA];

    touchPre: cc.Vec2;
    direction: Direction;

    //DUC's
    Food: cc.Node[] = [];

    onLoad() {
        // init logic
        for (let i = 0; i < 5; i++) {
            var snake = cc.instantiate(this.prefabSnake);
            this.node.addChild(snake);
            snake.setPosition(cc.director.getWinSize().width / 2 - i * 32, cc.director.getWinSize().height / 2);
            snake.color = this.color[Math.floor(cc.rand() % this.color.length)];
            this.Snake.push(snake);
        }

        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.isTouchEnd.bind(this));
        
    }

    start() {
        this.timer = 0;
        this.direction = Direction.RIGHT;

        this.createFood();
        
        this.setPosFood();
    }

    setPosFood() {
        this.node.addChild(this.Food[0]);
        this.Food[0].setPosition(Math.floor(cc.rand() % 20) * 32, Math.floor(cc.rand() % 20) * 32);

        for (let i = 0; i < this.Snake.length; i++) {
            if (this.Snake[i].getPosition() == this.Food[0].getPosition()) {
                this.Food[0].setPosition(Math.floor(cc.rand() % 20) * 32, Math.floor(cc.rand() % 20) * 32);
                i = -1;
            }
        }
    }

    isTouchStart(touch) {

        for (let s of this.Snake) {
            if (touch.getLocationX() >= s.getPositionX() 
            && touch.getLocationX() <= s.getPositionX() + s.width 
            && touch.getLocationY() >= s.getPositionY() 
            && touch.getLocationY() <= s.getPositionY() + s.height) {
                cc.log("Touch");
                    this.Snake.reverse();
                    if (this.Snake[0].getPositionX() > this.Snake[1].getPositionX()) {
                        this.direction = Direction.RIGHT;
                    }
                    else if (this.Snake[0].getPositionX() < this.Snake[1].getPositionX()) {
                        this.direction = Direction.LEFT;
                    }
                    else if (this.Snake[0].getPositionY() > this.Snake[1].getPositionY()) {
                        this.direction = Direction.UP;
                    }
                    else if (this.Snake[0].getPositionY() < this.Snake[1].getPositionY()) {
                        this.direction = Direction.DOWN;
                    }
                    return;
            }
        }

        if (touch.getLocationX() < cc.director.getWinSize().width / 2  
        && touch.getLocationY() < cc.director.getWinSize().height - 240 
        && touch.getLocationY() > 0 + 240
        && this.direction != Direction.RIGHT) {
            
            this.direction = Direction.LEFT;
        }
        else if (touch.getLocationX() >= cc.director.getWinSize().width / 2  
        && touch.getLocationY() < cc.director.getWinSize().height - 240 
        && touch.getLocationY() > 0 + 240 
        && this.direction != Direction.LEFT) {
            
            this.direction = Direction.RIGHT;
        }
        else if (touch.getLocationY() <= cc.director.getWinSize().height / 2
        && this.direction != Direction.UP) {
            
            this.direction = Direction.DOWN;
        }
        else if (touch.getLocationY() >= cc.director.getWinSize().height / 2
        && this.direction != Direction.DOWN) {
            
            this.direction = Direction.UP;
        }

    }

    
    createFood()
    {
        while(this.Food.length < 5)  {
            var food = cc.instantiate(this.prefabSnake);
            //food.setPosition(-1000, -1000);
            // food.setPosition(Math.floor(cc.rand() % 20) * 32, Math.floor(cc.rand() % 20) * 32);
            food.color = this.color[Math.floor(cc.rand() % this.color.length)];
            this.Food.push(food);
        }
       
    }

    eatFood() {
        this.Food[0].destroy();
        this.Food.reverse();
        this.Food.pop();
        this.Food.reverse();
        
        this.Snake[0].destroy();
        this.Snake.reverse();
        this.Snake.pop();
        this.Snake.reverse();
        

        this.createFood();
        this.setPosFood();
    }

    spawnFood(){
        //this.Food[0].destroy();
        this.Food.reverse();
        this.Snake.push(this.Food.pop());
        this.Food.reverse();
        this.createFood();
        this.setPosFood();
    }

    isTouchEnd(touch) {

    }

    

    update(dt) {
        this.timer += dt;
        if (this.timer >= 0.1) {

            for (let i = this.Snake.length - 1; i > 0; i--) {
                this.Snake[i].setPosition(this.Snake[i - 1].x, this.Snake[i - 1].y);
            }

            switch(this.direction) {
                case Direction.UP:
                        this.Snake[0].setPositionY(this.Snake[0].y + 32);
                    break;
                case Direction.DOWN:
                        this.Snake[0].setPositionY(this.Snake[0].y - 32);  
                    break;
                case Direction.LEFT:
                        this.Snake[0].setPositionX(this.Snake[0].x - 32);        
                    break;
                case Direction.RIGHT:
                        this.Snake[0].setPositionX(this.Snake[0].x + 32);     
                    break;
            }

            if (this.Snake[0].y >= cc.director.getWinSize().height) {
                this.Snake[0].y = 0;
            }
            else if (this.Snake[0].y < 0) {
                this.Snake[0].y = cc.director.getWinSize().height - 32;
            }
            else if (this.Snake[0].x < 0) {
                this.Snake[0].x = cc.director.getWinSize().width - 32;
            }
            else if (this.Snake[0].x >= cc.director.getWinSize().width) {
                this.Snake[0].x = 0;
            }

            

            this.timer = 0;
        }

        if (this.Food[0].getPositionX() == this.Snake[0].getPositionX() 
        && this.Food[0].getPositionY() == this.Snake[0].getPositionY()) {
                cc.log(this.Food[0].color.toString());
                cc.log(this.Snake[0].color.toString());
            if (this.Food[0].color.toString() == this.Snake[0].color.toString()) {
                
                this.eatFood();
            }
            else {
                this.spawnFood();
            }
        }
        this.checIdiot();
    }

    checIdiot() {
        for (let i = 3; i < this.Snake.length; i++) {
            if (this.Snake[0].getPositionX() == this.Snake[i].getPositionX()
            && this.Snake[0].getPositionY() == this.Snake[i].getPositionY()) {
         
            cc.log(this.Snake[i].getPositionX());
                
            }
        }
    }
}
