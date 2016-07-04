/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-04
*/


var Position=require("./Position.js");

function World(width,height,distance){
    this.map=[];
    this.width=width;
    this.height=height;
    this.distance=distance;
    this.xl=parseInt(width/distance);
    this.yl=parseInt(height/distance);
    this._init();

}
World.prototype._init=function(){
    for(var i=0;i<this.xl;i++){
        for(var j=0;j<this.yl;j++){
            this.map[i]=[];
            this.map[i][j]=Position.TYPE_NORMAL;
        }
    }
}
World.prototype.setBarrier=function(){

}
module.exports=World;
