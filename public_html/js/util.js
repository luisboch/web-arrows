Math.toRadians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.toDegrees = function (radians) {
    return radians * 180 / Math.PI;
};



var MathUtils = {};
MathUtils.radiansToDegrees = 180.0 / Math.PI;
MathUtils.radDeg = MathUtils.radiansToDegrees;
MathUtils.degreesToRadians = Math.PI / 180;
MathUtils.degRad = MathUtils.degreesToRadians;

/**
 * @returns the first not empty
 */
function ou() {
    for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (a !== null && (typeof a) !== 'undefined') {
            return a;
        }
    }

    return arguments[arguments.length - 1];
}