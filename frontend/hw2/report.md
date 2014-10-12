<center>
<h1>基础实验2 JavaScript练习
<h3>软件22 刘桐彤 2012013331
<h5>手机：18800102016 邮箱：jshaltt7@163.com
</center>
<br />
<br />

##一、实验环境：
* 系统：MAC OS X 10.9
* 浏览器：Chrome 35.0.1916.153

##二、QUIZ

###基础练习1：arguments，作用域

####问题
如上的⾃自执⾏行函数的返回值是什么？请解释为什么会是这样的返回值？

####执行
在控制台执行如下代码：

```
var func = {
	getNum: function() {return this.num;},
	num: 1
};

(function() {
	return typeof arguments[0]();
})(func.getNum);
```
控制台返回值为undefined。

使用严格模式，执行代码如下：

```
var func = {
	getNum: function() {"use strict"; return this.num;},
	num: 1
};

(function() {
	"use strict";
	return typeof arguments[0]();
})(func.getNum);
```
控制台返回值仍未undefined。

####分析
参数func.getNum传递的是函数本身，因此在调用arguments\[0\]()时，不是fund对象调用其getNum方法，而是arguments调用的，而arguments是没有num属性的。所以argument\[0\]()的返回值是未定义的，typeof的结果是undefined。

####修改
若要使其返回值是number，可以按照如下方式编写：

1.参数设为对象，使其成为对象调用的方法

```
var func = {
	getNum: function() {"use strict"; return this.num;},
	num: 1
};

(function() {
	"use strict";
	return typeof arguments[0].getNum();
})(func);
```

2.传递参数时就使其执行，参数为其执行的结果

```
var func = {
	getNum: function() {"use strict"; return this.num;},
	num: 1
};

(function() {
	"use strict";
	return typeof arguments[0];
})(func.getNum());
```

3.给arguments增加num属性

```
var func = {
	getNum: function() {"use strict"; return this.num;},
	num: 1
};

(function() {
	"use strict";
	arguments.num = 1;
	return typeof arguments[0];
})(func.getNum());
```

###基础练习2：动态属性，构造函数返回值

####问题
如上console.log出的是什么？为什么会这样？

####执行
在控制台执行如下代码：

```
var x = 0;
function foo() {
	x++;
	this.x = x;
	return foo;
}

var bar = new new foo;
console.log(bar.x);
```
控制台返回结果为undefined。

使用严格模式，执行代码如下：

```
var x = 0;
function foo() {
	"use strict";
	x++;
	this.x = x;
	return foo;
}

var bar = new new foo;
console.log(bar.x);
```
控制台返回结果为undefined。

####分析
由于foo()具有返回值，所以并不是一个构造器，new运算后返回的结果仍是foo()函数本身，所以无论使用多少次new，bar始终就是foo，是一个函数，所以bar.x是undefined。

####修改
若要使结果为数字，可按如下方式修改：

```
var x = 0;
function foo() {
	x++;
	this.x = x;
}

var bar = new (new foo).constructor;
console.log(bar.x);
```

返回结果为2

###基础练习3：typeof，预编译

####问题
alert的结果是什么？为什么会这样？

####执行
在控制台执行如下代码：

```
function bar() {
	return foo;
	foo = 10;
	function foo() {}
	var foo = '11';
}
alert(typeof bar());
```

控制台返回结果为function。

使用严格模式，执行代码如下：

```
function bar() {
	"use strict";
	return foo;
	foo = 10;
	function foo() {}
	var foo = '11';
}
alert(typeof bar());
```

控制台返回结果为function。

####分析
在预编译时对于function foo() {}这样的函数声明会进行function declaration hoisting，即会移至编译最开始的时候进行，因此function foo() {}先于return foo编译，而return foo执行之后剩下的语句也不再执行。所以bar()返回的结果是函数foo，typeof的结果为function。

###基础练习4：this指针
####问题
左边代码分别alert出的结果是什么？为什么会这样？

####执行
在控制台执行如下代码：

```
var x = 3;
var foo = {
	x: 2,
	baz: {
		x: 1,
		bar: function() {
			return this.x;
		}
	}
}

var go = foo.baz.bar;

alert(go());
alert(foo.baz.bar());
```

控制台返回结果为3  1。

使用严格模式，分别执行两个alert操作，执行代码如下：

```
var x = 3;
var foo = {
	x: 2,
	baz: {
		x: 1,
		bar: function() {
			"use strict";
			return this.x;
		}
	}
}

var go = foo.baz.bar;

alert(go());
```

返回结果为：`TypeError: Cannot read property 'x' of undefined`

```
var x = 3;
var foo = {
	x: 2,
	baz: {
		x: 1,
		bar: function() {
			"use strict";
			return this.x;
		}
	}
}

var go = foo.baz.bar;

alert(foo.baz.bar());
```

返回结果为1。

####分析
利用foo.baz.bar对go进行赋值，go就仅仅只是一个函数，而不是对象的方法了。因此在执行go()时，没有对象调用go，此时this即指Window，因此this.x指的是全局的x的值，故返回结果为3。而调用foo.baz.bar()时，调用bar的是baz，其属性x的值是1，所以返回结果为1。

在严格模式下，foo.baz.bar()结果返回正常，仍为1，而go()的结果返回TypeError，说明属性x未定义。通过在return this.x前面添加console.log(this)来检查this所指的对象可以发现，go()执行时this是undefined，说明严格模式下全局执行的函数内的this是未定义的，而foo.baz.bar()执行时this是Object {x: 1, bar: function}，即bar，结果正常。

###基础练习5：语句
####问题
alert出的结果是什么？为什么会这样？

####执行
在控制台执行如下代码：

```
function aaa() {
	return
	{
		test: 1
	};
}
alert(typeof aaa());
```

控制台返回结果为undefined。

使用严格模式，执行代码如下：

```
function aaa() {
	"use strict";
	return
	{
		test: 1
	};
}
alert(typeof aaa());
```
返回结果为undefined。

####分析
在javascript中一个文本行默认是一条语句，无论行末是否带有分号，这与C/C++不同。所以aaa()执行时return返回的不是{test: 1}，因此typeof的结果是undefined。

####修改
如果要使返回的结果是object，则按如下方式执行即可：

```
function aaa() {
	return {
		test: 1
	};
}
alert(typeof aaa());
```

###进阶练习1：中国队是冠军><

####问题
实现一个方法forecast，预测世界杯冠军，要求提供如下功能：
参数有两个：第⼀个参数是一个对象，分别表⽰示进⼊16强的各个队的能⼒力值，键为下图的国家编码，值为使⽤用这个函数的球迷⼼心⺫⽬目中这 个国家的实⼒力(⼀个⾮负整数)，且实⼒和胜率成正⽐(淘汰赛无平局)。第二个参数是使用这个函数的球迷希望获得的某⽀球队最终夺冠的概率，是某个国家的代码(如A1)。
根据下图的对阵情况，返回第⼆个参数对应的国家能够取得最终冠军的概率。

####思路
1. 由于国家编码在实现过程中会带来不便，故利用encode对象将国家由原来的编码变为0-15编码，其中编码顺序为从上到下，从左到右，即0-7为上半区，8-15为下半区。
2. 此问题可采用递归算法解决，即在2^n个球队决出冠军。因此利用function getChampion(data, candidate, total)递归解决。
3. function getChampion(data, candidate, total)


> * 参数含义：
>	* total：球队总数，是2的幂
>	* data：total只球队的实力构成的数组
>	* candidata：目标球队的下标
>	* 返回值：目标球队在total只球队中夺冠的概率
> * 实现方法：
>	* 递归边界：total==2，返回值等于目标球队的实力除以两队的实力和
>	* 递归过程：total>2，依据概率论乘法原理可把夺冠分为两步：一是目标球队从自己所在的半区的total/2只球队中胜出，概率通过递归调用获得；二是与另外半区的球队进行决赛获胜。第二部分再利用全概率公式，将该事件划分为另外半区每只球队胜出的事件的并集，再在每个子集上计算目标球队与该球队进行决赛获胜的概率，最后取加权和即为第二部分的概率。然后把一二两部分的概率相乘即为结果。

***补充：***进行了容错性判断，确保参数为两个，第一个参数为16只球队的正确编码，第二个参数为某一只球队编码的字符串。

####实现

见forecast.js文件

###进阶练习2：找呀找呀找同学

####问题
实现一个方法search，search⽅法有两个参数：第⼀个是由上⾯数据结构为元素组成的数组。第⼆个参数是⼀个可变参数,其值可以是

* 数字：表⽰查找所有年龄和这个数字相同的同学信息组成的数组，找不到的情况下返回false; 
* 字符串：表⽰返回名称和该字符串同名的⼀一个同学的信息，找不到返回false; 
* 对象：可以是包含name，age和hometown任意一个或多个信息的对象(比如{name: xxx, hometown: xxx})。要求找到和这个对相匹配的同学信息组成的数组，如果找不到，返回false。

####思路

1. 首先检查参数个数是否为2以及第一个参数是否为对象类型，若不满足则返回false
2. 根据第二个参数的类型分别遍历数组：
	* number类型：检查数组中每个元素的age属性，将满足的结果加入数组，遍历结束，如果数组长度大于0，则返回数组，否则返回false；
	* string类型：检查数组中每个元素的name属性，如果某元素name属性等于第二个参数，则返回该元素。若找不到这样的对象，则返回false；
	* object类型：检查数组中每个元素，如果该对象的属性不是undefined，则检查与元素对应属性的值是否相同，将满足的结果加入数组，遍历结束，如果数组长度大于0，则返回数组，否则返回false；
	* 如果不是上述类型，则返回false。

####改进

1. 采用switch语句进行判断；
2. 数组操作换用原生的方法，如push等；
3. object类型在判断时，通过for...in...语句遍历condition的每个属性，并与学生信息数组的元素的对应属性比较，如此可以不用判断那些属性是undefined。

####实现

见search.js文件

##三、BONUS

###bonus1：找呀找呀找不同

####问题
实现一个diff函数，参数为两个同学信息数组，返回⼀个数组——包含那些存在于第⼆个数组但是却不存在于第⼀个数组中的同学信息(⽐较时只看name)组成的数组。

####思路
1. 首先检查参数个数是否为2以及两个参数是否为对象类型，若不满足则返回false；
2. 两重循环，第一重遍历第二个数组，第二重遍历第一个数组，检查元素的name属性是否相同，若相同则跳出第二重循环。如果第二重循环结束都未曾跳出，说明该同学未在第一个数组中出现，则加入结果数组。
3. 两重循环结束后返回结果数组。

####改进

1. 数组操作换用原生的方法；
2. 声明nameset对象，将第一个数组同学的名字作为nameset的一个属性，值设为1，遍历第一个数组得到nameset；
2. 遍历第二个数组，将同学的名字作为属性名，判断nameset的该属性是否为空，若为空，说明该同学的名字在第一个数组中未出现。

####实现

见diff.js文件

###bonus2：排呀排呀排个序

####问题

用JavaScript实现冒泡、插入以及选择排序。

####思路

参见《算法导论》

####实现

见sort.js文件


###bonus3：Untrusted游戏：
1. [https://gist.github.com/anonymous/687a1758f433d7143889](https://gist.github.com/anonymous/687a1758f433d7143889)

	* 将第一个循环(放左右两边的block)的终止位置由map.getHeight()-10改为map.getHeight()-12

2. [https://gist.github.com/anonymous/fa52ec9e3545b23c3b07](https://gist.github.com/anonymous/fa52ec9e3545b23c3b07)
	
	* 第一部分将maze的尺寸改为2*2，同时将出口位置设为(4,4)，第二部分加上if(false)使最后一句不执行

3. [https://gist.github.com/anonymous/8331251054ddc6809e1e](https://gist.github.com/anonymous/8331251054ddc6809e1e)
	
	* 将第一个循环改为for (y = 12; y <= map.getHeight() - 2; y++)使左右两边下移一位

4. [https://gist.github.com/anonymous/e9257c35872be46c644d](https://gist.github.com/anonymous/e9257c35872be46c644d)
	
	* 加上if(false)使上下两边消失

5. [https://gist.github.com/anonymous/a244f06b1aa29118a6b4](https://gist.github.com/anonymous/a244f06b1aa29118a6b4)
	
	* map.setSquareColor(x, y, '#000’);使mine块变色

6. [https://gist.github.com/anonymous/a66aa5124cb36c7c17b7](https://gist.github.com/anonymous/a66aa5124cb36c7c17b7)
	
	* 在d前方设置三角形卡住d

7. [https://gist.github.com/anonymous/d066652dd71d6fd5d005](https://gist.github.com/anonymous/d066652dd71d6fd5d005)
	
	* 设置变色的顺序和规则即可通关

8. [https://gist.github.com/anonymous/233919ee7d8a228d895e](https://gist.github.com/anonymous/233919ee7d8a228d895e)
	
	* 改为generateForest，不断重新生成森林

9. [https://gist.github.com/anonymous/f356394af39af34ceef3](https://gist.github.com/anonymous/f356394af39af34ceef3)
	
	* 设置player.setPhoneCallback(changeraftdirection)，使按下Q之后船改变方向

10. [https://gist.github.com/anonymous/bea201c1359b35639bcf](https://gist.github.com/anonymous/bea201c1359b35639bcf)
	
	* 使所有的d尽量靠下，从上方可以通过

11. [https://gist.github.com/anonymous/e131d0da2cc66b25d2c4](https://gist.github.com/anonymous/e131d0da2cc66b25d2c4)
	
	* 使robot先尽量右移，再尽量下移即可拿到key

12. [https://gist.github.com/anonymous/f89f48040b105fdb1f60](https://gist.github.com/anonymous/f89f48040b105fdb1f60)
	
	* 在x方向分为三部分，三部分策略分别是：先下后右，先上后右，先下后右

13. [https://gist.github.com/anonymous/3f12e296ba1a3565737a](https://gist.github.com/anonymous/3f12e296ba1a3565737a)
	
	* 深搜走迷宫，没写完整，但是通关啦~

14. [https://gist.github.com/anonymous/cc97032cdf3457410297](https://gist.github.com/anonymous/cc97032cdf3457410297)
	
	* greenKey->blueKey，再配合合理的路线使通过绿锁的时候身上都没有蓝钥匙

15. [https://gist.github.com/anonymous/2d6fa59ba0eaec3ba69a](https://gist.github.com/anonymous/2d6fa59ba0eaec3ba69a)
	
	* 把引号删了，随便写点什么。。。

16. [https://gist.github.com/anonymous/2b590e3c110cb95a8543](https://gist.github.com/anonymous/2b590e3c110cb95a8543)
	
	* 显示线条的颜色，再把player设为一种颜色，找通路

17. [https://gist.github.com/anonymous/07d618417996d5ed714e](https://gist.github.com/anonymous/07d618417996d5ed714e)
	
	* 如果两个teleporter相连，则在两个之间连一条线。然后找通路。

18. [https://gist.github.com/anonymous/1fa7f4d205ad0b1ef14d](https://gist.github.com/anonymous/1fa7f4d205ad0b1ef14d)
	
	* 写一个上移的函数，然后用map.startTimer一直运行，就能反重力了

19. [https://gist.github.com/anonymous/baf4c84a5958df58d155](https://gist.github.com/anonymous/baf4c84a5958df58d155)
	
	* 随便按一按就过了。。

20. [https://gist.github.com/anonymous/0e8551f59e710b5372bc](https://gist.github.com/anonymous/0e8551f59e710b5372bc)
	
	* 由于没有必要向左移，所以用overrideKey重写左方向键，用左方向键来发射子弹。。。

21. [https://gist.github.com/anonymous/2c897f508ba32838dd30](https://gist.github.com/anonymous/2c897f508ba32838dd30)

	* 把Objects.js里的if (!game.map.finalLevel)改为if (true)即可。。。

22. 没有了。。。