const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) prefabSnake: cc.Prefab = null;

    Snake: cc.Node[] = [];
    timer: number;

    color: cc.Color[] = [cc.Color.RED, cc.Color.BLUE, cc.Color.WHITE, cc.Color.GREEN, cc.Color.ORANGE,
    cc.Color.YELLOW, cc.Color.MAGENTA];

    onLoad() {
        // init logic
        for (let i = 0; i < 5; i++) {
            var snake = cc.instantiate(this.prefabSnake);
            this.node.addChild(snake);
            snake.setPosition(320 - i * 32, 480);
            snake.color = this.color[Math.floor(cc.rand() % this.color.length)];
            this.Snake.push(snake);
        }
        
    }

    start() {
        this.timer = 0;
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= 0.5) {
            for (let s of this.Snake) {
                s.setPositionX(s.x + 32);
            }

            for (let s = 0;)

            this.timer = 0;
        }
        
    }
}
