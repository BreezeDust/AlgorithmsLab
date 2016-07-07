/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-07
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
        this.map[i]=[];
        for(var j=0;j<this.yl;j++){
            this.map[i][j]=new Position(i,j);
        }
    }

    var foodX=parseInt(this.xl/2);
    var foodY=0;
    this.map[foodX][foodY]=new Position(foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    this.map[foodX][foodY].showFood();

    var homeX=parseInt(this.xl/2);
    var homeY=parseInt(this.yl/2);
    this.map[homeX][homeY]=new Position(homeX,homeY,0,Number.MAX_VALUE,Position.TYPE_HOME);
    this.map[homeX][homeY].showHome();
}
World.prototype.setBarrier=function(){

}
module.exports=World;
