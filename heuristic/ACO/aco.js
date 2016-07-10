/**
 * @Author: BreezeDust
 * @Date:   2016-07-04
 * @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-07-10
 */
 require("./lib/zepto.js");
 require("./lib/grid.js");

var Ant=require("./entity/Ant.js");
var World=require("./entity/World.js");
var Position=require("./entity/Position.js");


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
    }
    function start(){
        var world=new World(window.innerWidth,window.innerHeight,20);
        var antList=[];
        var isRun=false;
        window.world=world;
        function _run(){
            if(!isRun){
                isRun=true;
                world.volatitlePheromone();
                if(antList.length<50){
                    antList.push(new Ant(world));
                }
                // console.log("---->");
                for(var i=0;i<antList.length;i++){
                    antList[i].move();
                }
                isRun=false;
            }

            var delay=800;
            setTimeout(function(){
                _run();
            },delay);
        }
        _run();
    }
    initGridBg();
    start();
    $("#start").click(function(){
        $("#welcome").hide();
    });

})();