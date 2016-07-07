/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-07
*/



function Position(x,y,fp,hp,type){
    this.x=x;
    this.y=y;
    this.pheromone=[];
    this.type=type;
    this.dom;

    this.pheromone[Position.P_TYPE_FOOD]=fp;
    if(this.pheromone[Position.P_TYPE_FOOD]==null){
        this.pheromone[Position.P_TYPE_FOOD]=0;
    }
    this.pheromone[Position.P_TYPE_HOME]=hp;
    if(this.pheromone[Position.P_TYPE_HOME]==null){
        this.pheromone[Position.P_TYPE_HOME]=0;
    }
    if(this.type==null){
        this.type=Position.TYPE_NORMAL;
    }
}
Position.TYPE_HOME=2;
Position.TYPE_FOOD=1;
Position.TYPE_NORMAL=0;
Position.TYPE_BARRIER=-1;
Position.P_TYPE_FOOD=1001;
Position.P_TYPE_HOME=1002;

Position.prototype.getP=function(pType){
    return this.pheromone[pType];
};
Position.prototype.move=function(direction,map){
    var x=this.x+direction[0];
    var y=this.y+direction[1];
    if(x<0 || y<0 || x>=map.length || y>=map[0].length){
        return null;
    }
    return map[this.x+direction[0]][this.y+direction[1]];
}
Position.prototype.volatitlePheromone=function(volatite){
    this._volatitlePheromone(volatite,Position.P_TYPE_FOOD);
    this._volatitlePheromone(volatite,Position.P_TYPE_HOME);

}
Position.prototype._volatitlePheromone=function(volatite,pType){
    if(this.pheromone[pType]-volatite<0){
        this.pheromone[pType]=0;
    }
    else{
        this.pheromone[pType]-=volatite;
    }
}
Position.prototype.leavePheromone=function(fp,pType){
    this.pheromone[pType]+=fp;
}
Position.prototype.showFood=function(){
    if(this.type==Position.TYPE_FOOD){
        this.dom=$('<div></div>');
        this.dom.css({
            left:this.x*20,
            top:this.y*20
        });
        $("body").append(this.dom);
        this.dom.addClass("food");
    }
}
Position.prototype.showHome=function(){
    if(this.type==Position.TYPE_HOME){
        this.dom=$('<div></div>');
        this.dom.css({
            left:this.x*20,
            top:this.y*20
        });
        $("body").append(this.dom);
        this.dom.addClass("home");
    }
}
module.exports=Position;