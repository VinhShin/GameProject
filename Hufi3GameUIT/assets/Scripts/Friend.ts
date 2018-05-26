const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property speedRotation: number = 0;

    callbackCollider: () => void = null;

    isLive: boolean;

    onLoad() {
        // init logic
        this.node.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeElasticOut(1)));  

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;   
        
        this.isLive = true;
    }

    onCollisionEnter(other) {
        if (this.callbackCollider != null) {
            if (other.node.group == "player") {
                this.isLive = false;
                this.getComponent(cc.CircleCollider).enabled = false;
                this.callbackCollider();
            }
        }
    }

    actionOut() {
        this.node.runAction(cc.sequence(cc.moveTo(0.5, 470, 900), cc.scaleTo(0.5, 0, 0), cc.callFunc(()=>{
            this.node.destroy();
        })));
    }
    

    update(dt) {
        this.node.rotation += this.speedRotation * dt;
        if (!this.isLive) {
            this.actionOut();
            this.isLive = true;
        }
        
    }
}
