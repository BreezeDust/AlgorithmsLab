/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-10
*/


var Position=require("./Position.js");

function World(width,height,distance){
    this.map=[];
    this.width=width;
    this.height=height;
    this.distance=distance;
    this.checkList=[];
    this.selectedPosition=null;
    this.xl=parseInt(width/distance);
    this.yl=parseInt(height/distance);

    this._init();

}
// 静态变量
World.BASE_PHEROMONE=1;
World.CHANGE_MAX_VALUE=0.02;


// 可调参数
World.volatile=0; // 挥发参数
World.baseHomePheromone=0; // 家相关信息素起始值
World.baseFoodPheromone=0; // 食物相关信息素起始值

World.minPheromone=0; // 最小信息素值

World.maxPheromoneValue=0; // 最大信息素值
World.showPheromoneType=0; // 显示那种信息素的分布

World.prototype._init=function(){

    var maxLength=parseInt(Math.sqrt(this.xl*this.xl +this.yl*this.yl));
    World.baseHomePheromone=maxLength*World.BASE_PHEROMONE;
    World.baseFoodPheromone=maxLength*World.BASE_PHEROMONE;

    World.minPheromone=World.BASE_PHEROMONE;
    World.volatile=World.BASE_PHEROMONE/2;
    World.maxPheromoneValue=World.baseHomePheromone;
    World.showPheromoneType=Position.P_TYPE_HOME;

    console.log("World.volatile",World.volatile);
    console.log("World.baseHomePheromone",World.baseHomePheromone);
    console.log("World.baseFoodPheromone",World.baseFoodPheromone);
    console.log("World.minPheromone",World.minPheromone);
    console.log("World.minPheromone",World.showPheromoneType);


    for(var i=0;i<this.xl;i++){
        this.map[i]=[];
        for(var j=0;j<this.yl;j++){
            this.map[i][j]=new Position(this,i,j);
        }
    }

    // var foodX=2;
    // var foodY=5;
    // this.map[foodX][foodY]=new Position(this,foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    // foodX=4;
    // foodY=12;
    // this.map[foodX][foodY]=new Position(foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    // foodX=parseInt(this.xl/2);
    // foodY=0;
    // this.map[foodX][foodY]=new Position(this,foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    var homeX=parseInt(this.xl/2);
    var homeY=parseInt(this.yl/2);
    this.map[homeX][homeY]=new Position(this,homeX,homeY,0,Number.MAX_VALUE,Position.TYPE_HOME);
    this.map[homeX][homeY].showHome();

    var that=this;
    $("#selectPlane").click(function(){
        $("#innerSelectPlane").removeClass("scaleOutAnim");
        $("#selectPlane").css({
            display:"none"
        });
    });
    $("#innerSelectPlane .food").click(function(){
        if(that.selectedPosition!=null){
            that.selectedPosition.changeType(Position.TYPE_FOOD);
        }
    });
    $("#innerSelectPlane .barrier").click(function(){
        if(that.selectedPosition!=null){
            that.selectedPosition.changeType(Position.TYPE_BARRIER);
        }
     });
}
World.prototype.clickPosition=function(position){
    this.selectedPosition=position;
    var height=30;
    var width=60;
    var left=0;
    var top=0;
    if(position.y*20>height*1.5){
        top=position.y*20-height;
    }
    else{
        top=position.y*20+height;
    }
    if(position.x*20>width/2){
        left=position.x*20-width/2+10;
    }
    else if((this.xl-position.x)*20<width/2){
        left=position.x*20-width;
    }
    else{
        left=0;
    }
    $("#selectPlane").css({
        display:"block"
    });
    $("#innerSelectPlane").css({
        top:top,
        left:left
    });
    $("#innerSelectPlane").addClass("scaleOutAnim");
}
World.prototype.addCheckList=function(position){
    var insertIndex=this._getCheckedIndex(position);
    if(insertIndex>=0){
        this.checkList.splice(insertIndex,1);
    }
    this.checkList.push(position);
};
World.prototype._getCheckedIndex=function(position){
    for(var i=0;i<this.checkList.length;i++){
        if(position==this.checkList[i]){
            return i;
        }
    }
    return -1;
};
World.prototype.volatitlePheromone=function(){
    var max=0;
    for(var i=0;i<this.checkList.length;i++){
        var position=this.map[this.checkList[i].x][this.checkList[i].y];
        if(position.type==Position.TYPE_NORMAL && position.getP(World.showPheromoneType)>max){
            max=position.getP(World.showPheromoneType);
        }
        position.volatitlePheromone(World.volatile);
        position.showPheromone(World.maxPheromoneValue,World.showPheromoneType);
    }
    // console.log("====>",max);
    // World.maxPheromoneValue=max;
}
World.prototype.getPosition=function(x,y){
    return this.map[x][y];
}
module.exports=World;
