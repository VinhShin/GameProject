const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) prefabSnake: cc.Prefab = null;

    Snake: cc.Node[] = [];
    timer: number;
    Food: cc.Node[] = [];
    color: cc.Color[] = [cc.Color.RED, cc.Color.BLUE, cc.Color.WHITE, cc.Color.GREEN, cc.Color.ORANGE,
    cc.Color.YELLOW, cc.Color.MAGENTA];
    timeFood: number;
    lifeFood: boolean;
    createFood()
    {
        while(this.Food.length < 5)  {
            var food = cc.instantiate(this.prefabSnake);
            food.setPosition(cc.rand() % 480, cc.rand() % 480);
            food.color = this.color[Math.floor(cc.rand() % this.color.length)];
            this.Food.push(food);
        }
       
    }
    
    onLoad() {
        // init logic
        for (let i = 0; i < 5; i++) {
            var snake = cc.instantiate(this.prefabSnake);
            this.node.addChild(snake);
            snake.setPosition(320 - i * 32, 480);
            snake.color = this.color[Math.floor(cc.rand() % this.color.length)];
            this.Snake.push(snake);
        }
        this.createFood();
    }
    spawnFood(){
            this.Food[0].destroy();
            this.Food.reverse();
            this.Food.pop();
            this.Food.reverse();
            this.createFood();
            this.timeFood = 0;
            this.lifeFood = false;
    }
    start() {
        this.timer = 0;
        this.timeFood = 0;
        this.lifeFood = true;
        this.node.addChild(this.Food[0]);
    }
    update(dt) {
        this.timer += dt;
        if (this.timer >= 0.5) {
            for (let s of this.Snake) {
                s.setPositionX(s.x + 32);
            }
            this.timer = 0;
        }
        this.timeFood += dt;
        if(!this.lifeFood)
        {   
            this.node.addChild(this.Food[0]);
            this.lifeFood = true;
        }
        else if(this.timeFood > 2)
        {
            this.spawnFood();
        }
       
        
    }
}
