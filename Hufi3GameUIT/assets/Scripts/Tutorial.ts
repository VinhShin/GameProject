const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) enemy: cc.Prefab = null;
    @property(cc.Prefab) friend: cc.Prefab = null;
    @property(cc.Node) finger: cc.Node = null;
    @property(cc.Node) tap: cc.Node = null;

    @property(cc.Node) teacher: cc.Node = null;
    @property(cc.Node) character: cc.Node = null;
    check: boolean;

    container: cc.Node[] = [];
    timer: number;
    pos: cc.Vec2;
    onLoad() {
        // init logic
        for (let i = 0; i < 12; i++){
            for (let j = 1; j < 7; j++) {
                var e = cc.instantiate(this.enemy);
                this.node.addChild(e);
                e.setPosition(j * 80, i * 80 - 200 + (cc.randomMinus1To1() * 20));

                var f = cc.instantiate(this.friend);
                this.node.addChild(f);
                f.setPosition(j * -80, i * 80 - 200 + (cc.randomMinus1To1() * 20));
                this.container.push(e);
            }
        }
        this.pos = this.teacher.getPosition();
        this.check = false;
        this.teacher.active = false;
        this.finger.active = false;
        this.tap.active = false;
        this.timer = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, this.isTouchStart.bind(this));
        cc.director.getPhysicsManager().debugDrawFlags = 0;
    }

    //339, -844
    isTouchStart(touch) {
        if (touch.getLocationX() - this.node.width / 2  >= 339 - 109 
        && touch.getLocationX() - this.node.width / 2 <= 339 + 109
        && touch.getLocationY() - this.node.height / 2 >= -731 - 109
        && touch.getLocationY() - this.node.height / 2 <= -731 + 109) {
            this.teacher.active = true;
            this.character.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(1000, 0);
            this.finger.active = false;
            this.tap.active = false;
        }
    }

    update(dt) {
        if (this.character.x >= 0 && !this.check) {
            this.character.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            this.check = true;
            this.finger.active = true;
            this.tap.active = true;
        }
        if (this.tap.active) {
            this.tap.opacity += 20;
        }
        if (this.character.y >= -260) {
            this.character.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            this.timer += dt;
            if (this.timer >= 1) {
                for (let a of this.container) {
                    a.stopAllActions();
                    a.runAction(cc.moveBy(1, cc.p(0, -2000)).easing(cc.easeCubicActionOut()));
                }
                this.timer = -10000;
            }
            
        }
    }
}
