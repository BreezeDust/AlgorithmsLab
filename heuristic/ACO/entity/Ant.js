/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-09
*/

var World=require("./World.js");
var Position=require("./Position.js");
var Direction=require("./Direction.js");

function Ant(word){
    this._word=word;
    this.checkList=[];
    this.homePosition;
    this.foodPosition;
    this.dp;
    this.status;
    this.lastStatus;

    this.dom;
    this.step;

    this._init();
}
Ant.testN=1;
// 静态数据
Ant.STATUS_FIND_FOOD=Position.P_TYPE_HOME;
Ant.STATUS_CARRY_FOOD=Position.P_TYPE_FOOD;

Ant.CHECK_NOMARL=101;
Ant.CHECK_BARRIER=102;
Ant.CHECK_FOOD=103;
Ant.CHECK_HOME=104;


// 可调参数
Ant.CHANGE_MAX_VALUE=0.02;


Ant.lunpandu = function() { //轮盘赌
    var nowP = Math.random();
    var m = 0;
    var whell = [0.4, 0.2, Ant.CHANGE_MAX_VALUE, 0.4-Ant.CHANGE_MAX_VALUE];
    var point = 0;
    for (var i = 0; i < whell.length; i++) {
        m += whell[i];
        if (nowP <= m) {
            point = i;
            break;
        }
    }
    return whell[point];
}
Ant.prototype._init=function(){

    // 初始化不同的方向

    this.step=0;
    this._setStatus(Ant.STATUS_FIND_FOOD);
    this.homePosition=this._word.map[parseInt(this._word.xl/2)][parseInt(this._word.yl/2)];
    // TODO  干掉可以调整智能寻路
    this.foodPosition=null;
    // TODO


    this.checkList=[];
    this._findPosition(this.homePosition,true);
    this._addCheckList(this.homePosition);
    this._word.addCheckList(this.homePosition);

    if(this.dom==null){
        this.dom=$('<div></div>');
        $("body").append(this.dom);
        this.dom.addClass("ant");
    }
    this.dom.removeClass("green");

    this.dom.css({
        left:this.homePosition.x*20,
        top:this.homePosition.y*20
    });
}
Ant.prototype._getP=function(position,status){
    var value=0;
    if(status==Ant.STATUS_FIND_FOOD){
        if(this.homePosition!=null){
            var manhattan=Math.abs(position.x-this.homePosition.x)+Math.abs(position.y-this.homePosition.y);
            // manhattan=Math.sqrt(Math.pow(position.x-this.homePosition.x,2)+Math.pow(position.y-this.homePosition.y,2));
            value=World.BASE_HOME_PHEROMONE/this.step;

        }
    }
    else if(status===Ant.STATUS_CARRY_FOOD){
        if(this.foodPosition!=null){
            var manhattan=Math.abs(position.x-this.foodPosition.x)+Math.abs(position.y-this.foodPosition.y);
            // manhattan=Math.sqrt(Math.pow(position.x-this.foodPosition.x,2)+Math.pow(position.y-this.foodPosition.y,2));
            value=World.BASE_FOOD_PHEROMONE/this.step;
        }
    }
    return value<=0.1? 0:value;
};
Ant.prototype._leavePheromone=function(position){
    position.leavePheromone(this._getP(position,this.status),this.status);
    //
    // position.leavePheromone(this._getP(position,Ant.STATUS_FIND_FOOD),Ant.STATUS_FIND_FOOD);
    // position.leavePheromone(this._getP(position,Ant.STATUS_CARRY_FOOD),Ant.STATUS_CARRY_FOOD);

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
Ant.prototype._setStatus=function(status){
    this.status=status;
}
Ant.prototype.move=function(){
    this.step++;

    var lastPosition=this.checkList[this.checkList.length-1];

    var newPosition=this._findPosition(lastPosition);

    // 没有信息素时，回家
    if(this.status==Ant.STATUS_FIND_FOOD && this._getP(lastPosition,this.status)<=World.MIN_PHEROMONE){
        this._init();
        return;
    }
    var check=this._check(newPosition);
    if(check==Ant.CHECK_BARRIER){
        this.dp=Math.floor(Math.random()*Direction.M.length);
    }
    else if(check==Ant.CHECK_NOMARL){
        this._move(newPosition);
    }
    else if(check==Ant.CHECK_FOOD){
        this.step=0;
        this.checkList=[];
        this.foodPosition=newPosition;
        this._setStatus(Ant.STATUS_CARRY_FOOD)
        this._move(newPosition);
        this.dom.addClass("green");
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

Ant.prototype._findPosition=function(lastPosition,isStart){
    var change=Ant.lunpandu();
    // TODO  debgu
    // change=1;
    // 探测信息素
    var findStatus=Ant.STATUS_CARRY_FOOD;
    if(this.status==Ant.STATUS_CARRY_FOOD){
        findStatus=Ant.STATUS_FIND_FOOD;
    }
    if(this.status==Ant.STATUS_FIND_FOOD && change<=Ant.CHANGE_MAX_VALUE){
        // console.log("===>","change",change);
        this.dp=Math.floor(Math.random()*Direction.M.length);
    }
    else{
        var pheromoneList=[];
        for (var j = 1; j <= 1; j++) {
            for (var i = 0; i < Direction.M.length; i++) {
                var checkP = lastPosition.move(Direction.M[i], this._word.map, j);
                var check = this._check(checkP);
                if (check != Ant.CHECK_BARRIER) {
                    if (this.status == this.lastStatus) {
                        // 防止小幅度震荡
                        if (this._getCheckedIndex(checkP) < 0) {
                            pheromoneList.push(checkP);
                        }
                    } else {
                        pheromoneList.push(checkP);
                    }

                }
            }

        }
        this.lastStatus=this.status;

        pheromoneList.sort(function(a,b){
            return b.getP(findStatus)-a.getP(findStatus);
        });
        if(pheromoneList.length>0 && pheromoneList[0].getP(findStatus)>World.MIN_PHEROMONE){
            // console.log("选择-->",pheromoneList[0]);
            var newDp=Ant.getNewDirection(lastPosition,pheromoneList[0]);
            if(newDp!=-1){
                this.dp=newDp;
            }
            return pheromoneList[0];
        }

        // 如果没有进行信息素选择
        if(isStart){
            this.dp=Math.floor(Math.random()*Direction.M.length);
            if(Ant.testN==0){
                Ant.testN++;
                this.dp=Direction.getDP(Direction.U);
            }
        }
        // if(this.status==Ant.STATUS_CARRY_FOOD){
        //     // 向家的方向走
        //     var dp=Ant.getNewDirection(lastPosition,this.homePosition);
        //     if(dp!=-1){
        //         this.dp=dp;
        //     }
        // }
        // 否则惯性运动
    }

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
    this._word.addCheckList(newPosition);
    this._leavePheromone(newPosition);
    this.dom.css({
        left:newPosition.x*20,
        top:newPosition.y*20
    });
};

module.exports=Ant;