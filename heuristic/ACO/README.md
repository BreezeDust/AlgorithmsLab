## 简单蚁群算法实验模拟

+ [文章地址](http://breezedust.com/2016/07/10/zi-hua-yi-qun-suan-fa-jian-dan-mo-ni-shi-li/)
+ [Demo](http://lab.breezedust.com/aco/)

### 使用

```js
npm run install
npm run start
```
打开浏览器 http://localhost:8080

### 参数调整


以下为world可修改参数`entity/World.js`

```
// 静态变量
World.BASE_PHEROMONE=1; //
World.CHANGE_MAX_VALUE=0.02; // 突变概率
World.ANT_NUMBER=50; // 蚂蚁数量



// 可调参数
World.volatile=0; // 信息素挥发参数
World.baseHomePheromone=0; // 家相关信息素起始值
World.baseFoodPheromone=0; // 食物相关信息素起始值

World.minPheromone=0; // 最小散播信息素值,指达到这个值后，蚂蚁自动被重置

World.maxPheromoneValue=0; // 最大信息素值
World.showPheromoneType=0; // 显示那种信息素的分布图
```

+ demo参数的赋值见`entity/World:_init()`
+ 蚂蚁运动相关见`entity/Ant`