/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-04
*/

var World=require("./World.js");
var Position=require("./Position.js");
var Direction=require("./Direction.js");

function Ant(word){
    this._word=word;
    this.checkList=[];
    this.direction;
    this.status;
    this.dom;

    this._init();
}
Ant.PHEROMONE=0.1;
Ant.VOLATILE=0.1;
Ant.STATUS_FIND_FOOD=1;
Ant.STATUS_CARRY_FOOD=2;
Ant.CHECK_NOMARL=101;
Ant.CHECK_BARRIER=102;
Ant.CHECK_FOOD=103;

Ant.prototype._init=function(){
    console.log(Direction.M);
    this.direction=Direction.M[Math.floor(Math.random()*Direction.M.length)];
    this.status=this.STATUS_FIND_FOOD;
    this.dom=$('<div class="ant"><div>');
    $("body").append(this.dom);
}
Ant.prototype._volatitlePheromone=function(){
    for(var i=0;i<this.checkList.length;i++){
        this._word.map[checkList[i].x][checkList[i].y]-=Ant.VOLATILE;
    }
}
Ant.prototype._leavePheromone=function(position){
    this._word[position.x][position.y]+=Ant.PHEROMONE*this.status;
}
Ant.prototype._check=function(position){
    if(position.x<0 || position.y<0 || position.x>=this._word.xl || position.y>=this._word.yl){
        return Ant.CHECK_BARRIER;
    }
    if(this._word[position.x][position.y]==Position.TYPE_BARRIER){
        return Ant.CHECK_BARRIER;
    }
    else if (this._word[position.x][position.y]==Position.TYPE_NORMAL) {
        return Ant.CHECK_NOMARL;
    }
    return Ant.CHECK_FOOD;

}
Ant.prototype.move=function(){
    // 当前蚂蚁的信息素自然挥发
    this._volatitlePheromone();

    if(this.status==Ant.STATUS_FIND_FOOD){
        var lastPosition=this.checkList[this.checkList.length-1];
        var newPosition=lastPosition.move(this.direction);
        switch (newPosition) {
            case Ant.CHECK_BARRIER:
                break;
            case Ant.CHECK_NOMARL:
                this.checkList.push(newPosition);
                this._leavePheromone(newPosition);
                break;
            case Ant.CHECK_FOOD:
                break;
        }
    }
    else if(this.status==Ant.STATUS_CARRY_FOOD){

    }
}
module.exports=Ant;