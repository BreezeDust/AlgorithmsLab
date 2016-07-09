/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-09
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
World.VOLATILE=0;
World.BASE_HOME_PHEROMONE=0;
World.BASE_FOOD_PHEROMONE=0;

World.MIN_PHEROMONE=0;
World.BASE_PHEROMONE=0.1;



World.prototype._init=function(){
    var maxLength=this.xl*this.xl +this.yl*this.yl;
    World.BASE_HOME_PHEROMONE=maxLength*World.BASE_PHEROMONE;
    World.BASE_FOOD_PHEROMONE=maxLength*World.BASE_PHEROMONE;

    World.MIN_PHEROMONE=World.BASE_PHEROMONE;
    World.VOLATILE=World.BASE_PHEROMONE*5;

    console.log("World.VOLATILE",World.VOLATILE);
    console.log("World.BASE_HOME_PHEROMONE",World.BASE_HOME_PHEROMONE);
    console.log("World.BASE_FOOD_PHEROMONE",World.BASE_FOOD_PHEROMONE);
    console.log("World.MIN_PHEROMONE",World.MIN_PHEROMONE);


    for(var i=0;i<this.xl;i++){
        this.map[i]=[];
        for(var j=0;j<this.yl;j++){
            this.map[i][j]=new Position(this,i,j);
        }
    }

    var foodX=2;
    var foodY=5;
    this.map[foodX][foodY]=new Position(this,foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    this.map[foodX][foodY].showFood();

    // foodX=4;
    // foodY=12;
    // this.map[foodX][foodY]=new Position(foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
    // this.map[foodX][foodY].showFood();

    // foodX=parseInt(this.xl/2);
    // foodY=0;
    // this.map[foodX][foodY]=new Position(foodX,foodY,Number.MAX_VALUE,0,Position.TYPE_FOOD);
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
    for(var i=0;i<this.checkList.length;i++){
        var position=this.map[this.checkList[i].x][this.checkList[i].y];
        position.volatitlePheromone(World.VOLATILE);
        position.showPheromone(World.BASE_HOME_PHEROMONE);
    }
}
World.prototype.getPosition=function(x,y){
    return this.map[x][y];
}
module.exports=World;
