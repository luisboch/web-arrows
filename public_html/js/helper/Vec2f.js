

/* global MathUtils */

var Vec2f = function (x, y) {
    this.initialize(x, y);
    
    /**
     * @return {Number} the angle in degrees of this vector (point) relative to the
     * x-axis. Angles are towards the positive y-axis (typically
     * counter-clockwise) and between 0 and 360.
     */
    this.angle = function() {
        var a = Math.atan2(y, x) * MathUtils.radiansToDegrees;
        if (a < 0) {
            a += 360;
        }
        return a;
    };
};

Vec2f.fromDegree = function (a) {
    var v = new Vec2f(1, 0.0);
    v = v.rotateDeg(a);
    return v;
};

Vec2f.fromRad = function (a) {
    var v = new Vec2f(1, 0.0);
    v = v.rotateRad(a);
    return v;
};

Vec2f.prototype = {
    initialize: function (x_, y_) {
        this.x = x_;
        this.y = y_;
    },

    setZero: function () {
        this.x = 0.0;
        this.y = 0.0;
    },
    set: function (x_, y_) {
        this.x = x_;
        this.y = y_;
    },
    stV: function (v) {
        this.x = v.x;
        this.y = v.y;
    },
    dot: function(v){
         return this.x * v.x + this.y * v.y;
    },
    negative: function () {
        return new Vec2f(-this.x, -this.y);
    },

    copy: function () {
        return new Vec2f(this.x, this.y);
    },

    add: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    multiply: function (a) {
        this.x *= a;
        this.y *= a;
        return this;
    },

    crossVF: function (s) {
        var tX = this.x;
        this.x = s * this.y;
        this.y = -s * tX;
        return this;
    },

    crossFV: function (s) {
        var tX = this.x;
        this.x = -s * this.y;
        this.y = s * tX;
        return this;
    },

    minV: function (b) {
        this.x = this.x < b.x ? this.x : b.x;
        this.y = this.y < b.y ? this.y : b.y;
        return this;
    },

    maxV: function (b) {
        this.x = this.x > b.x ? this.x : b.x;
        this.y = this.y > b.y ? this.y : b.y;
    },

    abs: function () {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    },
    distance: function(a){
        var me = this.copy();
        return me.subtract(a).length();
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    rotateDeg: function (degrees) {
        return this.rotateRad(degrees * Math.toRadians(degrees));
    },
    rotateRad: function (rad) {
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        var tx = this.x;
        var ty = this.y;
        var v = new Vec2f(this.x, this.y);
        v.x = (cos * tx) - (sin * ty);
        v.y = (sin * tx) + (cos * ty);
        return v;
    },
    
    normalize: function () {
        var length = this.length();
        if (length < Number.MIN_VALUE)
        {
            return 0.0;
        }
        var invLength = 1.0 / length;
        this.x *= invLength;
        this.y *= invLength;

        return this;
    },
    x: 0.0001,
    y: 0.0001
};