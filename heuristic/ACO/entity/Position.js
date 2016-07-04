/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-04
*/



function Position(x,y){
    this.x=x;
    this.y=y;
}
Position.TYPE_NORMAL=0;
Position.TYPE_BARRIER=-1;

Position.prototype.move=function(direction){
    return new Position(x+direction.x,y+direction.y);
}
module.exports=Position;