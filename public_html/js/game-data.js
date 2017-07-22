/* global Storage */

GameData = function () {

    this.record = 0;
    this.current = 0;

    this.increase = function () {
        this.current++;
        if (this.current > this.record) {
            this.record = this.current;
        }

        this.save();
    };

    this.die = function () {
        this.current = 0;
        this.save();
    };
    this.save = function () {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem('arrow.game.record', this.record);
            localStorage.setItem('arrow.game.current', this.current);
        }
    };

    this.load = function () {
        if (typeof (Storage) !== "undefined") {
            this.record = parseInt(localStorage.getItem('arrow.game.record'));
            this.current = parseInt(localStorage.getItem('arrow.game.current'));
            this.record = isNaN(this.record) ? 0 : this.record;
            this.current = isNaN(this.record) ? 0 : this.current;
        }
    };
    this.load();
};

/**
 * 
 * @type GameData
 */
GameData.instance = new GameData();