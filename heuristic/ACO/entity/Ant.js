/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-07
*/

var World=require("./World.js");
var Position=require("./Position.js");
var Direction=require("./Direction.js");

function Ant(word){
    this._word=word;
    this.checkList=[];
    this.homePosition;
    this.dp;
    this.status;
    this.dom;
    this.step;

    this._init();
}

// 静态数据
Ant.STATUS_FIND_FOOD=Position.P_TYPE_HOME;
Ant.STATUS_CARRY_FOOD=Position.P_TYPE_FOOD;

Ant.CHECK_NOMARL=101;
Ant.CHECK_BARRIER=102;
Ant.CHECK_FOOD=103;
Ant.CHECK_HOME=104;


// 可调参数
Ant.PHEROMONE=0.1;
Ant.VOLATILE=0.05;
Ant.MAX_VALUE=3;

Ant.BASE_HOME_PHEROMONE=20;
Ant.BASE_FOOD_PHEROMONE=20;

Ant.STEP_VOLATILE=1;




Ant.prototype._init=function(){
    // 初始化不同的方向

    this.step=0;
    this.status=Ant.STATUS_FIND_FOOD;

    this.homePosition=this._word.map[parseInt(this._word.xl/2)][parseInt(this._word.yl/2)];
    this._findPosition(this.homePosition);
    this._addCheckList(this.homePosition);

    if(this.dom==null){
        this.dom=$('<div></div>');
        $("body").append(this.dom);
        this.dom.addClass("ant");
    }
    this.dom.css({
        left:this.homePosition.x*20,
        top:this.homePosition.y*20
    });
}
Ant.prototype._getP=function(){
    var value=0;
    if(this.status==Ant.STATUS_FIND_FOOD){
        value=Ant.BASE_HOME_PHEROMONE-Ant.STEP_VOLATILE*this.step;
    }
    else if(this.status===Ant.STATUS_CARRY_FOOD){
        value=Ant.BASE_FOOD_PHEROMONE-Ant.STEP_VOLATILE*this.step;
    }
    return value<=0? 0:value;
}

Ant.prototype._volatitlePheromone=function(){
    for(var i=0;i<this.checkList.length;i++){
        this._word.map[this.checkList[i].x][this.checkList[i].y].volatitlePheromone(Ant.VOLATILE);
    }
}
Ant.prototype._leavePheromone=function(position){
    position.leavePheromone(this._getP(),Ant.STATUS_FIND_FOOD);
}
Ant.prototype._check=function(position){
    if(position==null){
        return Ant.CHECK_BARRIER;
    }
    if(position.x==this.homePosition.x && position.y==this.homePosition.y){
        return Ant.CHECK_HOME;
    }

    if(position.type==Position.TYPE_BARRIER){
        return Ant.CHECK_BARRIER;
    }
    else if (position.type==Position.TYPE_NORMAL) {
        return Ant.CHECK_NOMARL;
    }
    return Ant.CHECK_FOOD;

}
Ant.prototype.move=function(){
    this.step++;
    // 当前蚂蚁的信息素自然挥发
    this._volatitlePheromone();
    var lastPosition=this.checkList[this.checkList.length-1];

    var newPosition=this._findPosition(lastPosition);
    var check=this._check(newPosition);
    if(check==Ant.CHECK_BARRIER){
        this.dp=Math.floor(Math.random()*Direction.M.length);
    }
    else if(check==Ant.CHECK_NOMARL){
        this._move(newPosition);
    }
    else if(check==Ant.CHECK_FOOD){
        this.status=Ant.STATUS_CARRY_FOOD;
        this._move(newPosition);
    }
    else if(check==Ant.CHECK_HOME){
        if(this.status==Ant.STATUS_FIND_FOOD){
            this._move(newPosition);
        }
        else if(this.status==Ant.STATUS_CARRY_FOOD){
            this._init();
        }
    }
};
Ant.prototype._findPosition=function(lastPosition){

    // 探测信息素
    var findStatus=Ant.STATUS_CARRY_FOOD;
    if(this.status==Ant.STATUS_CARRY_FOOD){
        findStatus=Ant.STATUS_FIND_FOOD;
    }
    var pheromoneList=[];
    for(var i=0;i<Direction.M.length;i++){
        var checkP=lastPosition.move(Direction.M[i],this._word.map);
        var check=this._check(checkP);
        if(check!=Ant.CHECK_BARRIER){
            // 防止小幅度震荡，和上上次做比较
            if(this.checkList.length>=2 && this.checkList[this.checkList.length-2]!=checkP){
                pheromoneList.push(checkP);
            }
            if(this.checkList.length<2){
                pheromoneList.push(checkP);
            }
        }
    }
    pheromoneList.sort(function(a,b){
        return b.getP(findStatus)-a.getP(findStatus);
    });
    if(pheromoneList.length>0 && pheromoneList[0].getP(findStatus)>Ant.PHEROMONE*Ant.MAX_VALUE){
        console.log("选择-->",pheromoneList[0]);
        var newDp=Ant.getNewDirection(lastPosition,pheromoneList[0]);
        console.log(newDp);
        if(newDp!=-1){
            this.dp=newDp;
        }
        return pheromoneList[0];
    }

    // 如果没有进行信息素选择
    if(lastPosition==this.homePosition){
        this.dp=Math.floor(Math.random()*Direction.M.length);
        this.dp=Direction.getDP(Direction.U);
    }
    // if(this.status==Ant.STATUS_CARRY_FOOD){
    //     // 向家的方向走
    //     var dp=Ant.getNewDirection(lastPosition,this.homePosition);
    //     if(dp!=-1){
    //         this.dp=dp;
    //     }
    // }
    // 否则惯性运动
    return lastPosition.move(Direction.M[this.dp],this._word.map);
};
Ant.getNewDirection=function(startP,endP){
    var direction=[endP.x-startP.x,endP.y-startP.y];
    if(direction[0]!=0){
        direction[0]=direction[0]/Math.abs(direction[0]);
    }
    if(direction[1]!=0){
        direction[1]=direction[1]/Math.abs(direction[1]);
    }
    return Direction.getDP(direction);
}
Ant.prototype._addCheckList=function(position){
    var insertIndex=this._getCheckedIndex(position);
    if(insertIndex>=0){
        this.checkList.splice(insertIndex,1);
    }
    this.checkList.push(position);
};
Ant.prototype._getCheckedIndex=function(position){
    for(var i=0;i<this.checkList.length;i++){
        if(position==this.checkList[i]){
            return i;
        }
    }
    return -1;
};
Ant.prototype._move=function(newPosition){
    this._addCheckList(newPosition);
    this._leavePheromone(newPosition);
    this.dom.css({
        left:newPosition.x*20,
        top:newPosition.y*20
    });

    var homelogs="";
    var foodlogs="";

    for(var i=1;i<parseInt(this._word.yl/2)-1;i++){
        var tmp=this._word.map[parseInt(this._word.xl/2)][i];
        homelogs+=tmp.getP(Position.P_TYPE_HOME).toFixed(2)+",";
        foodlogs+=tmp.getP(Position.P_TYPE_FOOD).toFixed(2)+",";
    }
    console.log("home",homelogs);
    // console.log("food",foodlogs);
};

module.exports=Ant;