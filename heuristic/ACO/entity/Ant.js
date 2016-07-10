/**
* @Author: BreezeDust
* @Date:   2016-07-04
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-10
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



Ant.lunpandu = function(whell) { //轮盘赌
    var nowP = Math.random();
    var m = 0;
    var point = 0;
    for (var i = 0; i < whell.length; i++) {
        m += whell[i];
        if (nowP <= m) {
            point = i;
            break;
        }
    }
    return point;
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
            // var manhattan=Math.abs(position.x-this.homePosition.x)+Math.abs(position.y-this.homePosition.y);
            value=World.baseHomePheromone/this.step;

        }
    }
    else if(status===Ant.STATUS_CARRY_FOOD){
        if(this.foodPosition!=null){
            // var manhattan=Math.abs(position.x-this.foodPosition.x)+Math.abs(position.y-this.foodPosition.y);
            value=World.baseFoodPheromone/this.step;
        }
    }
    return value<=0.1? 0:value;
};
Ant.prototype._leavePheromone=function(position){
    position.leavePheromone(this._getP(position,this.status),this.status);
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
    if(this._getP(lastPosition,this.status)<=World.minPheromone){
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
        this._init();
        // if(this.status==Ant.STATUS_FIND_FOOD){
        //     this._move(newPosition);
        // }
        // else if(this.status==Ant.STATUS_CARRY_FOOD){
        //     this._init();
        // }
    }
};

Ant.prototype._findPosition=function(lastPosition,isStart){
    var changeWhell = [0.4, 0.2, World.CHANGE_MAX_VALUE, 0.4-World.CHANGE_MAX_VALUE];
    var change=changeWhell[Ant.lunpandu(changeWhell)];
    // 探测信息素
    var findStatus=Ant.STATUS_CARRY_FOOD;
    if(this.status==Ant.STATUS_CARRY_FOOD){
        findStatus=Ant.STATUS_FIND_FOOD;
    }
    if(this.status==Ant.STATUS_FIND_FOOD && change<=World.CHANGE_MAX_VALUE){
        // console.log("===>","change",change);
        this.dp=Math.floor(Math.random()*Direction.M.length);
    }
    else{
        var pheromoneList=[];
        var allPheromone=0;
        for (var j = 1; j <= 1; j++) {
            for (var i = 0; i < Direction.M.length; i++) {
                var checkP = lastPosition.move(Direction.M[i], this._word.map, j);
                var check = this._check(checkP);
                if (check != Ant.CHECK_BARRIER) {
                    if (this.status == this.lastStatus) {
                        // 防止小幅度震荡
                        if (this._getCheckedIndex(checkP) < 0) {
                            allPheromone+=checkP.getP(findStatus);
                            pheromoneList.push(checkP);
                        }
                    } else {
                        allPheromone+=checkP.getP(findStatus);
                        pheromoneList.push(checkP);
                    }

                }
            }

        }
        this.lastStatus=this.status;
        if(allPheromone>0){
            var whell=[];
            for(var k=0;k<pheromoneList.length;k++){
                whell[k]=pheromoneList[k].getP(findStatus)/allPheromone;
            }
            var selectIndex=Ant.lunpandu(whell);
            console.log(whell,allPheromone);
            console.log("==>",selectIndex);
            if(selectIndex>=0 && selectIndex<pheromoneList.length){
                var newDp=Ant.getNewDirection(lastPosition,pheromoneList[selectIndex]);
                if(newDp!=-1){
                    this.dp=newDp;
                }
                return pheromoneList[selectIndex];
            }
        }
        else{
            if(isStart){
                this.dp=Math.floor(Math.random()*Direction.M.length);
                if(Ant.testN==0){
                    Ant.testN++;
                    console.log("===");
                    this.dp=Direction.getDP(Direction.U);
                }
            }
        }
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