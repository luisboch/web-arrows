
/**
 * @returns {Pursuit}
 */
function Pursuit() {

    var from;
    var evader;

    /**
     * @param {Phaser.Sprite} a
     * @returns {Pursuit} 
     */
    this.fromSpr = function (a) {
        from = a;
        return this;
    };

    /**
     * @param {Phaser.Sprite} a
     * @returns {Pursuit} 
     */
    this.to = function (a) {
        evader = a;
        return this;
    };

    /**
     * @returns {Vec2f}
     */
    this.calculate = function () {

        var toEvader = new Vec2f(evader.position.x, evader.position.y).subtract(new Vec2f(from.position.x, from.position.y));
        var fromVel = new Vec2f(from.body.velocity.x, from.body.velocity.y);

        var evaderVel = new Vec2f(evader.body.velocity.x, evader.body.velocity.y);
        var evaderPos = new Vec2f(evader.position.x, evader.position.y);
        var relativeDir = new Vec2f(from.body.velocity.x, from.body.velocity.y).dot(evaderVel);

        if (toEvader.dot(fromVel) > 0
                && relativeDir < Math.toRadians(18)) {
            return Seek().fromSpr(from).to(evader.position).calculate();
        }

        lookAheadTime = toEvader.length() / (ou(from.maxVelocity, 0.0) + evaderVel.length());
        lookAheadTime = !isFinite(lookAheadTime) || isNaN(lookAheadTime) ? 1 : lookAheadTime;
        return new Seek().to(evaderPos.add(evaderVel.multiply(lookAheadTime))).fromSpr(from).calculate();

    };

    return this;
}

/**
 * @returns {Seek}
 */
function Seek() {

    var from;
    var evader;

    /**
     * 
     * @param {Phaser.Sprite} spr
     * @returns {Pursuit} 
     */
    this.fromSpr = function (spr) {
        from = spr;
        return this;
    };

    /**
     * 
     * @param {Vec2f} p
     * @returns {Pursuit} 
     */
    this.to = function (p) {
        evader = p;
        return this;
    };

    /**
     * 
     * @returns {Vec2f}
     */
    this.calculate = function () {

        /** @type Vec2f */
        var desired = new Vec2f(evader.x, evader.y).subtract(new Vec2f(from.position.x, from.position.y));

        desired.normalize();
        desired.multiply(ou(from.maxVelocity, 1.0));
        return desired.subtract(new Vec2f(from.body.velocity.x, from.body.velocity.y));
    };

    return this;
}