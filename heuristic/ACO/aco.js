/**
 * @Author: BreezeDust
 * @Date:   2016-07-04
 * @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-07
 */
 require("./lib/zepto.js");
 require("./lib/grid.js");

var Ant=require("./entity/Ant.js");
var World=require("./entity/World.js");


(function() {
    function initGridBg() {
        var canvas = document.getElementById('gridBg');
        var ctx = canvas.getContext('2d');
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        console.log(canvas.width, canvas.height,window.innerWidth,window.innerHeight);
        var opts = {
            distance: 20,
            lineWidth: 0.1,
            gridColor: "#fff",
            caption: false
        };
        new Grid(opts).draw(ctx);
        // ctx.fillStyle="#FF0000";
        // ctx.fillRect(20*1,20*10,20,20);


    }
    initGridBg();
    var world=new World(window.innerWidth,window.innerHeight,20);
    var antList=[];
    function _run(){
        if(antList.length<1){
            antList.push(new Ant(world));
        }
        // console.log("---->");
        for(var i=0;i<antList.length;i++){
            antList[i].move();
        }
        setTimeout(function(){
            _run();
        },800);
    }
    _run();

})();