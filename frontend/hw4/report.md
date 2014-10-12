<center>
<h1>基础实验4 图片新闻轮播
<h3>软件22 刘桐彤 2012013331
<h5>手机：18800102016 邮箱：jshaltt7@163.com
</center>
<br />
<br />

##一、实验环境：
* 系统：MAC OS X 10.9
* 浏览器：Chrome 35.0.1916.153

##二、发布地址：

####[http://hacker.siyuan12.com/frontend/hw4](http://hacker.siyuan12.com/frontend/hw4)

##三、网页结构

本页面采用与主页同样的结构以保持网站整体风格一致，保留和header和footer部分。中间部分结构如下图所示：

![structure](http://cl.ly/image/3d1G1v1A3d2B/newspost1.png)

各部分功能如下：

1. div#pictures-layout: 页面主体框架，用于展示图片和评论；
2. div#pictures-focus: 图片展示区，以异步刷新方式获取图片，以左右滑动方式展示图片，同时图片会自动轮播，轮播间隔为5s；
3. div#comments-title: 评论区标题栏，设置了评论列表收起和展开按钮，评论列表默认是收起的；
4. div#comments-list: 评论展示区，以异步刷新方式获取评论，在页面下方设置了翻页功能，每页最多展示五条评论。

##四、网页特色

####1.获取图片和评论--Ajax技术

网站载入时，会先向服务器发起http请求，从相应的url位置请求数据。由于以异步方式实现，所以在等待服务器的数据时页面可以正常工作。当收到服务器数据后，通过对json文件进行相应的解析，结合信息通过jQuery来进行DOM操作，使网页的相应部分展示相应内容。若http请求失败，会以alert方式报错，若收不到服务器的数据，会在控制台展示错误信息。通过这样的方式，网页载入时获取的是图片信息及某一页的评论信息（根据用户上一次离开的位置）。当评论列表翻页时，也是以异步刷新方式刷新。

具体实现见文件ajax.js, CommentsShow.js。

####2.图片自定义切换--CSS3 transform属性

在`div#pictures-focus`中实现了图片的平移轮播的效果。该效果利用的是CSS3的tranform属性，同时结合transition的过渡效果实现的。

![model](http://cl.ly/image/3e3d3O2a1629/newspost2.png)

如上图所示，`div#pictures-focus`为可见的图片区，`div#pictures-view`则把所有图片容纳在同一行。首先根据用户上一次离开的位置找到对应的图片，将其平移到中间，而编号小于它的图片在它的左侧叠加放置，编号大于它的图片在它的右侧叠加放置。当用户按下`>`（`<`），该图片会向右（左）平移一个图片的长度，而编号小1的图片会向右（左）平移一个图片长度而到达网页中央，从而实现了图片切换。当在第一张图片时点击`<`会切换到下一张图片，最后一张图片类比可得。

具体实现见文件PictureSlide.js。

####3.图片自动轮播--DOM setInterval()方法

图片的自动轮播可以方便用户浏览图片。实现方式为调用DOM的全局方法：`setInterval()`。在用户没有点击`>`或`<`时，`setInterval()`以一定的时间间隔（本实验默认为5s）通过jQuery的trigger方法出发`>`的单机事件，从而实现自动轮播。当用户正在点击`>`或`<`时，通过`clearInterval()`取消，点击结束后重新调用`setInterval()`。

具体实现见文件PicturesSlide.js。

####4.用户数据本地存储--localStorage

为了方便用户离开页面后再重新载入本页面时，仍能回到上次的浏览位置，优化用户体验，我通过localStorage存储了用户上次离开页面时，浏览到的图片的编号以及评论页数。当用户再次载入页面时，仍然能够继续浏览。

具体实现见文件ajax.js, CommentsShow.js。

####5.鼠标悬停事件--:hover和mouseover()&mouseout()

在网页主体部分的超链接上，利用:hover实现鼠标指上时文字变色，同时利用CSS3的transition的过渡效果实现渐变。

在图片展示区，利用jQuery的mouseover()&mouseout()方法实现鼠标移入和移除时标题文字字号改变，同时利用CSS3的transition的过渡效果实现渐变。

具体实现见文件style.css。

####6.隐藏评论--CSS3 transition属性

为了防止无用的评论影响用户浏览，当点击“评论”右侧的向下的箭头时，评论列表会展开和收起，这里是通过改变max-height来实现的，结合CSS3的transition的过渡效果实现了渐变。

具体实现见文件style.css。

####7.自定义字体--CSS3 @font-face规则

网页有些常见的图标，如上下左右箭头、社交软件logo，如果用图片方式加载，会延长网页的加载时间，这时候如果利用网上某些自定义字体，通过@font-face规则，将字体载入自己的网页，并调用，会明显地提升浏览体验。

本实验中网页的翻页按钮、评论列表收起按钮、社交软件logo图标中我都利用了`FontAwesome`字体，与同学使用图标的加载速度相比，会快很多。

具体实现见文件style.css。

####7.响应式布局--@media screen and (min-width: n px)

通过响应式布局，可以适应在不同页面下浏览网页，提升了浏览体验

####8.兼容性测试

在MAC OS X 10.9系统下支持Chrome, Safari, Firefox, Opera浏览器，运行截图如下：