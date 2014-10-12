<center>
<h1>基础实验3 趣玩DOM
<h3>软件22 刘桐彤 2012013331
<h5>手机：18800102016 邮箱：jshaltt7@163.com
</center>
<br />
<br />

##一、实验环境：
* 系统：MAC OS X 10.9
* 浏览器：Chrome 35.0.1916.153

##二、基础要求

###基础练习1：SECRET

####问题
对[http://thufe.github.io/secret](http://thufe.github.io/secret)网页进行解密。

####思路
查看网页源文件，发现对密码的处理是在jsencryption.js文件中进行的。再查看jsencryption.js文件，看到如下函数：

```
function decrypt(a) {
	if (a != "" && a != null) {
		if (decryptElementId.constructor != Array) {
			decryptElementId = [decryptElementId]
		}
		var b = false;
		for (var i = 0; i < decryptElementId.length; i++) {
			var c = document.getElementById(decryptElementId[i]);
			var d = c.title;
			try {
				var e = GibberishAES.dec(d, a);
				b = true;
				c.innerHTML = e;
				c.title = ""
			} catch (err) {}
		}
		if (!b) {
			alert("Invalid decryption key", "Tips")
		}
	}
}
```

分析可知，表单的值被存在参数a中，然后decrypt函数对a进行判断。由于加密方式看上去很复杂的样子，所以采用暴力破解法进行破解。在decrypt函数中将a的值从0000遍历到9999，如果错误则继续，如果正确则用对话框弹出正确的密码，如果可以破解。

####实现

破解方法：将jsencryption.js文件中的function decrypt(a)函数替换如下：

```
function decrypt(a) {
	for (var i1 = 0; i1 < 10; i1++) {
		for (var i2 = 0; i2 < 10; i2++) {
			for (var i3 = 0; i3 < 10; i3++) {
				for (var i4 = 0; i4 < 10; i4++) {
					a = '' + i1 + i2 + i3 + i4;
					if (a != "" && a != null) {
						if (decryptElementId.constructor != Array) {
							decryptElementId = [decryptElementId]
						}
						var b = false;
						for (var i = 0; i < decryptElementId.length; i++) {
							var c = document.getElementById(decryptElementId[i]);
							var d = c.title;
							try {
								var e = GibberishAES.dec(d, a);
								b = true;
								c.innerHTML = e;
								c.title = ""
							} catch (err) {}
						}
						if (b) {
							alert(a, "Tips")
						}
					}
				}
			}
		}
	}
}
```

####密码 & 秘密

* 密码：2674
* 秘密：你猜啊！

###基础练习2：热门课程

####问题

* 将“数据库技术及应用(计算机系)”这个“热门课程”修改为“Web前端技术实训(软件学院)”；
* 将“EDWARD RAGG”修改为“刘强”
* 将这个“热门课程”平移到第一位而不影响其他“热门课程”的顺序；
* 要求使用原生DOM。

####实现

```
var a = document.getElementsByTagName('li');
var b = a[7];
var c = b.children;
c[1].innerHTML = "<a>Web前端技术实训（软件学院）</a>";
c[2].children[0].innerText = "刘强";
a[7].remove();
a[0].parentNode.insertBefore(b, a[1])
```

####说明

1. a获取所有li标签，对于当前页面，获取的就是八门课程的li；
2. b获取第八个li标签，即“数据库技术及应用(计算机系)”；
3. c获取b的子元素，包括图片、课程名和老师；
4. 将c的第二个对象，即课程名，换为目标名称；
5. 将c的第三个对象，即老师名，换位目标名称；
6. 将原来的“数据库技术及应用(计算机系)”课程移除；
7. 将“Web前端技术实训(软件学院)”插入第二个位置。

####文件

* 文件名称：1.js
* 文件大小：201字节

###基础练习3：课程列表

####问题

* 在列表中每行最前分别插入一列，该列的文字为默认颜色(黑色)，样式设有margin-left:10px。该列内容为从1开始递增的数字，每行递增1；
* 将列表中可见的未读公告、新文件、未交作业的提示数字都修改为1073741824，同时不影响页面其他元素的显示；
* 如果进行了页面内无刷新的切换，那么当切换回来重建列表时，应恢复为改造前的样子，此时再次执行提交的JS代码能够恢复改造后的效果；
* 可以使用jQuery。

####实现

```
$('.lh30:visible').each(function(index, element){
	$(element).prepend("<td><p style='margin-left:10px'>"+(++index)+"</p></td>");
	$(element).find('a.red').text(1<<30)
})
```

####说明

1. $('.lh30:visible')找到所有类包括lh30并且可见的节点，对于当前页面，获取的是课程列表的行元素；
2. 用each方法遍历，element为当前对象，index在下面被用作计数变量，初值为0（为了节省代码）；
3. 在每一行前面插入一列<td>，由于td标签没有盒模型，在其中在插入p标签，并将样式设为margin-left:10px，内容为序号；
4. 找到当前行所有类包括red的a标签，将内容改为1073741824，即1<<30。

####文件

* 文件名称：2.js
* 文件大小：124字节


###基础练习4：网络学堂改造

####问题

* 用编写JS文件的方式对网络学堂进行更多改造；
* 改造的范围将不限于网络学堂的课程列表，也可改造课程的具体页面，只要是新版网络学堂“课堂”模块内的页面都可以。也可以改造多个页面(可以提交多个JS文件，但要说明清楚被改造的不同页面分别是通过哪些JS文件来改造的)。

####改造1：DDL倒计时

#####1.1 需求

DDL压力山大，分秒必争，面对新版网络学堂的精确到秒的DDL，计算剩余时间显然是一件浪费脑力的事情。如果能够自动显示DDL剩余时间，显然有助于提高更好地完成作业。

#####1.2 思路

插入“DDL倒计时“一栏，通过读取系统时间，并用截止时间于之求差，得到时间差，在通过“XXd XXh XXm”显示到当前栏。

#####1.3 实现

```
$(document).ready(function(){
	var title = $('.hw-table-title table tbody tr td');
	$(title[0]).attr('width', '3%');
	$(title[1]).attr('width', '19%');
	$(title[2]).attr('width', '6%');
	$(title[3]).attr('width', '6%');
	$(title[4]).attr('width', '13%');
	$(title[5]).attr('width', '13%');
	$(title[6]).attr('width', '5%');
	$(title[7]).attr('width', '9%');
	$(title[8]).attr('width', '9%');
	$('<td width="9%" class="gray">DDL倒计时</td>').insertBefore(title[6]);

	$('.hw-table-c table tbody tr').each(function() {
		var itemtd = $(this).find('td');
		var countdown = $('<td width="9%" class="gray"></td>');
		var curDate = new Date();
		var targetDate = new Date(Date.parse($(itemtd[5]).text()));
		var deltatime = (Date.parse(targetDate) - Date.parse(curDate)) / 1000;
		var txt = '', flag = false;

		if (deltatime < 0) {
			txt += '时间已过';
		}
		else {
			if (deltatime > 24 * 3600) {
				flag = true;
				txt = txt + parseInt(deltatime / 24 / 3600) + 'd ';
				deltatime -= parseInt(deltatime / 24 / 3600) * 24 * 3600;
			}
			if (deltatime > 3600 || flag) {
				flag = true;
				txt = txt + parseInt(deltatime / 3600) + 'h ';
				deltatime -= parseInt(deltatime / 3600) * 3600;
			}
			if (deltatime > 60 || flag) {
				flag = true;
				txt = txt + parseInt(deltatime / 60) + 'm';
			}
		}
		countdown.text(txt);

		$(itemtd[0]).attr('width', '3%');
		$(itemtd[1]).attr('width', '19%');
		$(itemtd[2]).attr('width', '6%');
		$(itemtd[3]).attr('width', '6%');
		$(itemtd[4]).attr('width', '13%');
		$(itemtd[5]).attr('width', '13%');
		$(itemtd[6]).attr('width', '5%');
		$(itemtd[7]).attr('width', '9%');
		$(itemtd[8]).attr('width', '9%');
		countdown.insertBefore(itemtd[6]);
	})
});
```

#####1.4 测试

执行位置：“课程作业“页面；
执行效果：如下图所示

![1](http://cl.ly/image/2i1g1f383e1P/1.png)

####改造2：导航栏链接

#####2.1 需求

在新版网络学堂的部分页面有如下导航：

![2](http://cl.ly/image/1G181r3I0Q1k/2.png)

看上去像极了本机的文件系统导航。但是！这些栏居然只是文字而没有链接，并不能通过这些标签返回之前的层次。所以如果能给它们加上链接想必是极好的。

#####2.2 思路

由于相关链接页面上也都存在，只要将这些标签套上a标签，并且将href属性根据页面上相同链接的a标签的href属性进行设置即可。

#####2.3 实现

```
$('.bread-nav li').each(function(){
	var word = $(this).text();
	var item = $('<a style="text-decoration: underline">' + word + '</a>');

	if (word == "首页") {
		$('a:contains("首页")').each(function(){
			if ($(this).text() == "首页") {
				item.attr('href', $(this).attr('href'));
			}
		})
	}
	else if (word == "我的课程" || word == "课堂") {
		$('a:contains("课堂")').each(function(){
			if ($(this).text() == "课堂") {
				item.attr('href', $(this).attr('href'));
			}
		})
	}
	else {
		$('a:contains('+word+')').each(function() {
			if ($(this).text() == word){
				item.attr('href', $(this).attr('href'));
			}
		})
	}

	if (item.attr('href') == undefined){
		$('a:contains("课程首页")').each(function() {
			item.attr('href', $(this).attr('href'));
		})
	}

	$(this).text("");
	$(this).append(item);
})
```

#####2.4 测试

执行位置：有如上导航栏的页面，比如课程信息，具体的某个作业的页面，讨论区；
执行效果：如下图所示，以课程作业为例：

![3](http://cl.ly/image/1q1h3H3P2L1X/3.png)


####改造3：标签折叠

#####3.1 需求

在新版网络学堂的有些没用的标签尺寸很大，布局不合理，希望能够折叠这些标签。

#####3.2 思路

添加按钮，根据div标签的display属性值进行设置，如果本来不是none，则单击按钮后改为none，如果本来是none，则单击后改为block。

#####3.3 实现

```
$('h3').each(function(){
	var roll = $('<a style="float: right; margin-right: 10px;">折叠</a>');
	$(this).append(roll);
	roll.click(function(){
		if ($(this).parent().next().css('display') != 'none') {
			$(this).parent().next().css('display', 'none');
		}
		else {
			$(this).parent().next().css('display', 'block');
		}
	})
})
```

#####3.4 测试

执行位置：课程文件，课程信息；
执行效果：如下图所示，以课程信息为例：

![4](http://cl.ly/image/1s1z3R3I1A0a/4.png)

####改造4：只看楼主

#####4.1 需求

在新版网络学堂讨论区，在回帖较多时内容往往容易跑偏，模仿贴吧，希望能够只看楼主的帖子。

#####4.2 思路

检查每条留言的左边信息是否与楼主相同，若不同则不显示。

#####4.3 实现

```
var simplifybutton = $('<a id="simplifybutton" class="gray-button">只看楼主</a>');
$('.topbar').append(simplifybutton);
simplifybutton.click(function(){
	var item = $('.info-detail-list li');
	var hostinfo = $(item[0]).find('.author-info p').text();
	
	item.each(function(){
		if ($(this).find('.author-info p').text() != hostinfo) {
			$(this).attr('style', 'display: none');
		}
	})
})
```

#####4.4 测试

执行位置：讨论区某帖子；
执行效果：如下图所示：

![5](http://cl.ly/image/0B3t442B1e3D/5.png)
![6](http://cl.ly/image/152y0K1R0p3V/6.png)
