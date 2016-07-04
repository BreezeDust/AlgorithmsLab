/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-04
*/



function Direction(x,y){
    this.x=x;
    this.y=y;
}
Direction.L=[1,0];
Direction.R=[-1,0];
Direction.D=[0,1];
Direction.U=[0,-1];
Direction.LU=[1,-1];
Direction.RU=[-1,-1];
Direction.LD=[1,1];
Direction.RD=[-1,1];
Direction.M=[Direction.L,Direction.R,Direction.D,Direction.U,Direction.LU,Direction.RU,Direction.LD,Direction.RD];
module.exports=Direction;