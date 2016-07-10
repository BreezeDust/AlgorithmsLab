/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-10
*/



function Position(world,x,y,fp,hp,type){
    this._world=world;
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
    this._init();
}

Position.TYPE_HOME=2;
Position.TYPE_FOOD=1;
Position.TYPE_NORMAL=0;
Position.TYPE_BARRIER=-1;
Position.P_TYPE_FOOD=1001;
Position.P_TYPE_HOME=1002;
Position.prototype._init=function(){
    this.dom=$('<div></div>');
    this.dom.css({
        left:this.x*20,
        top:this.y*20
    });
    $("body").append(this.dom);
    this.dom.addClass("normal");
    var that=this;
    $(this.dom).click(function(){
        console.log(
            that.x,
            that.y,
            that.pheromone[Position.P_TYPE_FOOD].toFixed(2),
            that.pheromone[Position.P_TYPE_HOME].toFixed(2));
        that._world.clickPosition(that);
    });
}
Position.prototype.getP=function(pType){
    return this.pheromone[pType];
};
Position.prototype.move=function(direction,map,deep){
    if(deep==null){
        deep=1;
    }
    var x=this.x+direction[0]*deep;
    var y=this.y+direction[1]*deep;
    if(x<0 || y<0 || x>=map.length || y>=map[0].length){
        return null;
    }
    return map[x][y];
}
Position.prototype.volatitlePheromone=function(volatite){
    this._volatitlePheromone(volatite,Position.P_TYPE_FOOD);
    this._volatitlePheromone(volatite,Position.P_TYPE_HOME);

}
Position.prototype._volatitlePheromone=function(volatite,pType){
    if(this.type==Position.TYPE_NORMAL){
        if(this.pheromone[pType]-volatite<0){
            this.pheromone[pType]=0;
        }
        else{
            this.pheromone[pType]-=volatite;
        }
        return this.pheromone[pType];
    }
    return 0;

}
Position.prototype.leavePheromone=function(fp,pType){
    if(this.type==Position.TYPE_NORMAL){
        this.pheromone[pType]+=fp;
    }
}
Position.prototype.changeType=function(type){
    if(this.type==Position.TYPE_BARRIER){
        this.dom.removeClass("barrier");
    }
    if(this.type==Position.TYPE_HOME){
        this.dom.removeClass("home");
    }
    if(this.type==Position.TYPE_FOOD){
        this.dom.removeClass("food");
    }
    this.type=type;
    this.dom.removeClass("pheromone");
    this.dom.css({
        "opacity":1
    });
    if(type==Position.TYPE_BARRIER){
        this.pheromone[Position.P_TYPE_FOOD]=0;
        this.pheromone[Position.P_TYPE_HOME]=0;
        this.showBarrire();
    }
    if(type==Position.TYPE_FOOD){
        this.pheromone[Position.P_TYPE_FOOD]=Number.MAX_VALUE;
        this.pheromone[Position.P_TYPE_HOME]=0;
        this.showFood();
    }
};
Position.prototype.showBarrire=function(){
    if(this.type==Position.TYPE_BARRIER){
        this.dom.addClass("barrier");
    }
}
Position.prototype.showFood=function(){
    if(this.type==Position.TYPE_FOOD){
        this.dom.addClass("food");
    }
}
Position.prototype.showHome=function(){
    if(this.type==Position.TYPE_HOME){
        this.dom.addClass("home");
    }
}
Position.prototype.showPheromone=function(max,showType){
    var a=(max-this.pheromone[showType])/max;
    if(this.type==Position.TYPE_NORMAL){
        var r=38;
        var g=72;
        var b=99;
        if(a>=1){
            a=1;
        }
        if(a<=0){
            a=0;
        }
        a=1-a;
        this.dom.addClass("pheromone");

        this.dom.css({
            "opacity":a
        });
    }
}
module.exports=Position;