/*
 *
 * 	Authors: Xinyi Zhao & Tongtong Liu
 *	Create: 2014-07-14
 *	Update: 2014-07-17
 *	Copyright © 2014 Xinyi Zhao & Tongtong Liu
 *
 */

// 关于色块对象的说明：
//	 绘制方法：
//     circle:    绘制圆形，再填充
//     triangle:  绘制顶角向左的三角形，再填充，若要旋转，再旋转画布
//     rectangle: 绘制长水平，宽竖直的三角形，若要旋转，再旋转画布
//
//   属性：
//     positionX: circle: 圆心横坐标，triangle: 旋转前最左边的角的横坐标，
//	 		 	  rectangle: 旋转前左上角的角的横坐标
//     positionY: circle: 圆心纵坐标，triangle: 旋转前最左边的角的纵坐标，
//	 	 		  rectangle: 旋转前左上角的角的纵坐标
//     type:      形状，circle/triangle/rectangle之一
//     a:         circle的半径，triangle的边长，rectangle的宽
//     b:         rectangle的长，对circle和triangle无用
//     angle:     旋转的角度
//     color:     色块的颜色
//     speedX:    色块的水平速度
//     speedY:    色块的竖直速度

// 游戏封装为app对象，包括游戏的所有成员数据以及成员方法
var app = {
	data: {					// 游戏的基本数据
		scrollHeight: null,
		scrollWidth: null,
		typeSet: ['circle', 'triangle', 'rectangle'],
		radiusRange: [10, 60],
		speedRange: [-4, 4],
		angleRange: [0, Math.PI / 2],
		colorSet: ['rgba(127,127,127,0.8)', 'rgba(193,8,8,0.8)','rgba(161,31,205,0.8)','rgba(254,88,127,0.8)', 'rgba(143,191,12,0.8)',
				   'rgba(255,241,0,0.8)', 'rgba(0,183,238,0.8)', 'rgba(243,151,0,0.8)', 'rgba(0,158,150,0.8)'],
		timeInterval: 2500
	},
	aniamted: [],			// 保存setInterval的句柄
	canvas: null,			// 画布对象
	content:null,			// 画布上下文
	objects: [],			// 障碍物色块对象数组

	isStart: false,			// isStart是true，当游戏已经开始并且没有Game Over
	isPause: false,			// isPause是true，当isStart是true，并且Pause建被单击或者Help键被单击
	isHelp: false,			// isHelp是true，当Help键被单击
	isMusicPause: false,	// isMusicPause是true，当音乐被关闭

	// 表示玩家的成员对象，包括玩家对象自身的成员数据以及成员方法
	player: {				// 部分属性含义参见本文件顶部色块对象的注释
		positionX: null,
		positionY: null,
		type: null,
		a: null,
		b: null,
		angle: null,
		color: null,
		speedX: 0,
		speedY: 0,

		expansion: 1e-2,	// 玩家色块膨胀的速度(每10ms增加的尺寸)
		speedStep: 2,		// 玩家控制角色移动时的速度
		shadowRadius: 0,	// 控制玩家色块的阴影的半径

		// player对象成员方法
		fn: {
			// 玩家色块的初始化，也是每局游戏开始时的初始化操作
			init: function() {
				app.player.positionX = app.canvas.width / 5;
				app.player.positionY = app.canvas.height / 2;
				app.player.type = 'circle';
				app.player.a = app.data.radiusRange[0];
				app.player.b = app.data.radiusRange[0];
				app.player.shadowRadius = app.data.radiusRange[0];
				app.player.angle = 1e-6;
				app.player.color = app.data.colorSet[0];
				app.player.speedX = 0;
				app.player.speedY = 0;
				app.objects = [];
			},

			// 玩家键盘控制色块移动，当键被按下时生效
			move: function(event) {
				var keynum;
				var KEY = {LEFT: 37, UP:38, RIGHT:39, DOWN:40,
							  A: 65,  W:87,     D:68,    S:83};

				// 响应上下左右或WSAD键
				if (app.isStart && !app.isPause && event) {
					keynum = event.keyCode || event.which;
					switch (keynum) {
						case KEY.W:
						case KEY.UP:
							app.player.speedY = -(app.player.speedStep);
							break;

						case KEY.S:
						case KEY.DOWN:
							app.player.speedY = app.player.speedStep;
							break;

						case KEY.A:
						case KEY.LEFT:
							app.player.speedX = app.player.speedStep;
							break;

						case KEY.D:
						case KEY.RIGHT:
							app.player.speedX = -(app.player.speedStep);
							break;
					}
				}
			},

			// 玩家键盘控制色块移动，当键被松开时失效
			stop: function(event) {
				var keynum;
				var KEY = {LEFT: 37, UP:38, RIGHT:39, DOWN:40,
							  A: 65,  W:87,     D:68,    S:83};

				// 响应上下左右或WSAD键
				if (app.isStart && !app.isPause && event) {
					keynum = event.keyCode || event.which;
					switch (keynum) {
						case KEY.W:
						case KEY.UP:
						case KEY.S:
						case KEY.DOWN:
							app.player.speedY = 0;
							break;

						case KEY.A:
						case KEY.LEFT:
						case KEY.D:
						case KEY.RIGHT:
							app.player.speedX = 0;
							break;
					}
				}
			},

			// 绘制玩家色块，bStatic表示是否为静态绘制(静态绘制用于暂停以及帮助页面时图形的绘制)
			drawPlayer: function(bStatic) {
				// 绘制涟漪状阴影，以突出玩家色块
				var shadowColor = [];
				var point = {x:0, y:0};
				if (app.player.color) {
					for (var i = 0; i < app.player.color.length; i++) {
						shadowColor[i] = app.player.color[i];
					}
					shadowColor[app.player.color.length - 2] = '3';
					shadowColor = shadowColor.join('');
				}
				else {
					shadowColor = 'rgba(127,127,127,0.3)';
				}
				app.fn.getCenter(app.player, point);

				app.content.save();
				app.content.beginPath();
				app.content.arc(point.x, point.y, app.player.shadowRadius, 0, Math.PI * 2, true);
				app.content.closePath();
				app.content.fillStyle = shadowColor;
				app.content.fill();
				app.content.restore();
				if (!bStatic) {
					if (app.player.type == 'circle' && (app.player.shadowRadius > 20 + app.player.a)) {
						app.player.shadowRadius = app.player.a;
					}
					else if (app.player.type == 'triangle' && app.player.shadowRadius > 20 + app.player.a / Math.sqrt(3)) {
						app.player.shadowRadius = app.player.a / Math.sqrt(3);
					}
					else if (app.player.type == 'rectangle' && app.player.shadowRadius > 
																20 + Math.sqrt(app.player.a * app.player.a + app.player.b * app.player.b) / 2) {
						app.player.shadowRadius = Math.sqrt(app.player.a * app.player.a + app.player.b * app.player.b) / 2;
					}
					else {
						app.player.shadowRadius += 0.2;
					}
				}

				// 绘制玩家的色块对象，如果是动态绘制，同时进行色块的移动和边界限制判定
				switch (app.player.type) {
					case 'circle':
						app.content.save();
						app.content.beginPath();
						app.content.arc(app.player.positionX, app.player.positionY, app.player.a, 0, Math.PI * 2, true);
						app.content.closePath();
						app.content.fillStyle = app.player.color;
						app.content.fill();
						app.content.restore();
						if (!bStatic) {
							if ((app.player.positionY - app.player.a <= 2 && app.player.speedY < 0) 
								|| (app.player.positionY + app.player.a >= app.canvas.height - 2 && app.player.speedY > 0)) {
								app.player.speedY = 0;
							}
							if ((app.player.positionX - app.player.a <= 2 && app.player.speedX > 0)
								|| (app.player.positionX + app.player.a >= app.canvas.width - 2 && app.player.speedX < 0)) {
								app.player.speedX = 0;
							}
							if (app.player.positionY - app.player.a <= 2) {
								app.player.positionY += app.player.expansion;
							}
							if (app.player.positionY + app.player.a >= app.canvas.height - 2) {
								app.player.positionY -= app.player.expansion;
							}
							if (app.player.positionX - app.player.a <= 2) {
								app.player.positionX += app.player.expansion;
							}
							if (app.player.positionX + app.player.a >= app.canvas.width - 2) {
								app.player.positionX -= app.player.expansion;
							}
							app.player.a += app.player.expansion;
							app.player.b += app.player.expansion;
							app.player.positionX = app.player.positionX - app.player.speedX;
							app.player.positionY = app.player.positionY + app.player.speedY;
						}
						break;

					case 'triangle':
						app.content.save();
						app.content.beginPath();
						app.content.translate(app.player.positionX, app.player.positionY);
						app.content.rotate(app.player.angle);
						app.content.moveTo(0,0);
						app.content.lineTo(0.5 * Math.sqrt(3) * app.player.a, -0.5 * app.player.a);
						app.content.lineTo(0.5 * Math.sqrt(3) * app.player.a, 0.5 * app.player.a);
						app.content.lineTo(0,0);
						app.content.closePath();
						app.content.fillStyle = app.player.color;
						app.content.fill();
						app.content.restore();
						if (!bStatic) {
							var tri = [{x: app.player.positionX, y: app.player.positionY},
									   {x: app.player.positionX + app.player.a * Math.cos(app.player.angle - Math.PI / 6), 
									   	y: app.player.positionY + app.player.a * Math.sin(app.player.angle - Math.PI / 6)},
									   {x: app.player.positionX + app.player.a * Math.cos(app.player.angle + Math.PI / 6), 
									   	y: app.player.positionY + app.player.a * Math.sin(app.player.angle + Math.PI / 6)}];
							var j;
							for (j = 0; j < tri.length; j++) {
								if (tri[j].y <= 2) {
									app.player.positionY += app.player.expansion;
									if (app.player.speedY < 0) {
										app.player.speedY = 0;
									}
									break;
								}
								if (tri[j].y >= app.canvas.height - 2) {
									app.player.positionY -= app.player.expansion;
									if (app.player.speedY > 0) {
										app.player.speedY = 0;
									}
									break;
								}
							}
							for (j = 0; j < tri.length; j++) {
								if (tri[j].x <= 2) {
									app.player.positionX += app.player.expansion;
									if (app.player.speedX > 0) {
										app.player.speedX = 0;
									}
									break;
								}
								if (tri[j].x >= app.canvas.width - 2) {
									app.player.positionX -= app.player.expansion;
									if (app.player.speedX < 0) {
										app.player.speedX = 0;
									}
									break;
								}
							}
							app.player.a += app.player.expansion;
							app.player.b += app.player.expansion;
							app.player.positionX = app.player.positionX - app.player.speedX;
							app.player.positionY = app.player.positionY + app.player.speedY;
						}
						break;

					default:
						app.content.save();
						app.content.beginPath();
						app.content.translate(app.player.positionX, app.player.positionY);
						app.content.rotate(app.player.angle);
						app.content.closePath();
						app.content.fillStyle = app.player.color;
						app.content.fillRect(0, 0, app.player.b, app.player.a);
						app.content.restore();
						if (!bStatic) {
							var rect = [{x: app.player.positionX, y: app.player.positionY},
								 		{x: app.player.positionX + app.player.b * Math.cos(app.player.angle), 
								 		 y: app.player.positionY + app.player.b * Math.sin(app.player.angle)},
								 		{x: app.player.positionX - app.player.a * Math.sin(app.player.angle), 
								 		 y: app.player.positionY + app.player.a * Math.cos(app.player.angle)},
								 		{x: app.player.positionX + app.player.b * Math.cos(app.player.angle) - app.player.a * Math.sin(app.player.angle), 
								 		 y: app.player.positionY + app.player.b * Math.sin(app.player.angle) + app.player.a * Math.cos(app.player.angle)}];
							var j;

							for (j = 0; j < rect.length; j++) {
								if (rect[j].y <= 2) {
									app.player.positionY += app.player.expansion;
									if (app.player.speedY < 0) {
										app.player.speedY = 0;
									}
									break;
								}
								if (rect[j].y >= app.canvas.height - 2) {
									app.player.positionY -= app.player.expansion;
									if (app.player.speedY > 0) {
										app.player.speedY = 0;
									}
									break;
								}
							}
							for (j = 0; j < rect.length; j++) {
								if (rect[j].x <= 2) {
									app.player.positionX += app.player.expansion;
									if (app.player.speedX > 0) {
										app.player.speedX = 0;
									}
									break;
								}
								if (rect[j].x >= app.canvas.width - 2) {
									app.player.positionX -= app.player.expansion;
									if (app.player.speedX < 0) {
										app.player.speedX = 0;
									}
									break;
								}
							}
							app.player.a += app.player.expansion;
							app.player.b += app.player.expansion;
							app.player.positionX = app.player.positionX - app.player.speedX;
							app.player.positionY = app.player.positionY + app.player.speedY;
						}
						break;
				}
			}
		}
	},

	// 用于计时的成员对象，包括计时器(同时也是游戏过程的控制器)的成员数据以及成员方法
	clock: {
		time: 0,			// 记录游戏已经进行的毫秒数
		minutes: 0,			// 游戏已经进行的分钟数
		seconds: 0,			// 游戏已经进行的秒数
		count: null,		// 记录计时器setTimeout运行的句柄

		// clock对象成员方法
		fn: {
			// 时间显示方法，即将minutes及seconds在页面上用两位数字显示出来
			display: function() {
				$('.m').text((app.clock.minutes < 10 ? "0" : "") + app.clock.minutes);
				$('.s').text((app.clock.seconds < 10 ? "0" : "") + app.clock.seconds);
			},

			// 计时方法，计时的思想为每10ms调用本函数，time加10
			countTime: function() {
				app.clock.minutes = parseInt(app.clock.time / 1000 / 60) % 60;
				app.clock.seconds = parseInt(app.clock.time / 1000) % 60;
				app.clock.fn.display();
				app.clock.time += 10;
				app.clock.count = setTimeout(app.clock.fn.countTime, 10);
			},

			// 暂停计时
			pauseCount: function() {
				clearTimeout(app.clock.count);
			},

			// 清空计时
			clearAll: function() {
				app.clock.time = 0;
				app.clock.minutes = 0;
				app.clock.seconds = 0;
				app.clock.fn.display();
				clearTimeout(app.clock.count);
			},

			// 游戏控制器：游戏开始(单击Start/Restart按钮或按R触发)
			// 进行的操作包括：初始化表示游戏进行状态的变量，初始化按钮的文字，清空计时，本局游戏初始化，开始计时
			startGame: function(event) {
				var keynum, keychar;
				if (event) {
					keynum = event.keyCode || event.which;
					keychar = String.fromCharCode(keynum);
					if (keychar != 'R') {
						return;
					}
				}

				app.isStart = true;
				app.isPause = false;
				app.isHelp = false;
				$('.start').text("Restart");
				$('.pause').text("Pause");
				app.clock.fn.clearAll();
				app.fn.stop();
				app.player.fn.init();
				app.fn.run();
				app.clock.fn.countTime();
			},

			// 游戏控制器：游戏暂停(单击Pause/Continue按钮或按P触发)
			// 进行的操作包括：更改表示游戏进行状态的变量，更改按钮的文字，游戏暂停/恢复，计时暂停/恢复
			pauseGame: function(event) {
				var keynum, keychar;
				if (event) {
					keynum = event.keyCode || event.which;
					keychar = String.fromCharCode(keynum);
					if (keychar != 'P') {
						return;
					}
				}

				if (!app.isStart) {
					return;
				}

				if (!app.isPause) {
					app.isPause = true;
					$('.pause').text("Continue");
					app.fn.stop();
					app.clock.fn.pauseCount();
				}
				else {
					app.isPause = false;
					app.isHelp = false;
					$('.pause').text("Pause");
					app.fn.run();
					app.clock.fn.countTime();
				}
			}
		}
	},

	//全局成员方法(按字母表顺序排列)
	fn: {
		// 随机生成障碍物色块对象
		addObject: function() {
			var obj = new app.fn.getObject(app.data.typeSet, app.data.radiusRange, 
				app.data.speedRange, app.data.colorSet, app.data.angleRange, app.data.scrollHeight);
			var i;

			obj.positionX = app.canvas.width + app.data.radiusRange[1];
			obj.speedX = Math.abs(obj.speedX);
			app.content.clearRect(0,0,app.canvas.width,app.canvas.height);
			app.objects.push(obj);

			while(app.objects[0].positionX < -2 * app.data.radiusRange[1]) {
				app.objects.shift();
			}

			if (app.clock.minutes == 0 && 0 <= app.clock.seconds && app.clock.seconds < 30) {
				app.data.timeInterval = 2500;
			}
			else if (app.clock.minutes == 0 && 30 <= app.clock.seconds && app.clock.seconds < 60) {
				app.data.timeInterval = 2000;
			}
			else if (app.clock.minutes == 1) {
				app.data.timeInterval = 1500;
			}
			else {
				app.data.timeInterval = 1000;
			}
			app.aniamted[2] = setTimeout(app.fn.addObject, app.data.timeInterval);
		},

		// 色块碰撞的判定
		crash: function() {
			var i, j, k;

			// 检测障碍物色块自身是否碰撞，若碰撞，则交换速度
			for (i = 0; i < app.objects.length; i++) {
				for (j = i + 1; j < app.objects.length; j++) {			
					if (app.fn.judgeIntersect(app.objects[i], app.objects[j])) {
						app.fn.swap(app.objects[i], app.objects[j], 'speedX');
						app.fn.swap(app.objects[i], app.objects[j], 'speedY');

						for (k = 2; k <= 10; k++) {
							app.objects[i].positionX += k;
							app.objects[j].positionX -= k;
							if (!app.fn.judgeIntersect(app.objects[i], app.objects[j])) {
								break;
							}
							app.objects[i].positionX -= k;
							app.objects[j].positionX += k;

							app.objects[i].positionX -= k;
							app.objects[j].positionX += k;
							if (!app.fn.judgeIntersect(app.objects[i], app.objects[j])) {
								break;
							}
							app.objects[i].positionX += k;
							app.objects[j].positionX -= k;
						}
					}
				}
			}

			// 检测玩家色块与障碍物色块是否碰撞，若碰撞，则交换色块
			for (i = 0; i < app.objects.length; i++) {
				if (app.fn.judgeIntersect(app.player, app.objects[i])) { //判断是否相碰
					if (app.player.type == app.objects[i].type
						|| app.player.color == app.objects[i].color) {   //若相碰，判断是否能够交换
						app.fn.swap(app.player, app.objects[i]);
						app.player.shadowRadius = app.player.a;

						for (k = 2; k <= 10; k++) {
							app.player.positionX += k;
							app.objects[i].positionX -= k;
							if (!app.fn.judgeIntersect(app.player, app.objects[i])) {
								break;
							}
							app.player.positionX -= k;
							app.objects[i].positionX += k;

							app.player.positionX -= k;
							app.objects[i].positionX += k;
							if (!app.fn.judgeIntersect(app.player, app.objects[i])) {
								break;
							}
							app.player.positionX += k;
							app.objects[i].positionX -= k;
						}
						//return;
					}
					else {
						app.fn.gameover();
						return;
					}
				}
			}
		},

		// 绘制色块对象，bStatic表示是否为静态绘制(静态绘制用于暂停以及帮助页面时图形的绘制)
		drawObject: function(bStatic) {
			var iSize;
			iSize = app.objects.length;
			app.content.clearRect(0,0,app.canvas.width,app.canvas.height)
			for (var i = 0; i < iSize; i++) {
				var iObj = app.objects[i];
				// 绘制色块对象，如果是动态绘制，同时进行色块的移动和边界碰撞判定
				switch (iObj.type) {
					case 'circle':
						app.content.save();
						app.content.beginPath();
						app.content.arc(iObj.positionX, iObj.positionY, iObj.a, 0, Math.PI * 2, true);
						app.content.closePath();
						app.content.fillStyle = iObj.color;
						app.content.fill();
						app.content.restore();
						if (!bStatic) {
							if (iObj.positionY - iObj.a <= 0) {
								iObj.speedY = Math.abs(iObj.speedY)
							}
							if (iObj.positionY + iObj.a >= app.canvas.height) {
								iObj.speedY = -(Math.abs(iObj.speedY))
							}
							iObj.positionX = iObj.positionX - iObj.speedX;
							iObj.positionY = iObj.positionY + iObj.speedY;
						}
						break;

					case 'triangle':
						app.content.save();
						app.content.beginPath();
						app.content.translate(iObj.positionX, iObj.positionY);
						app.content.rotate(iObj.angle);
						app.content.moveTo(0,0);
						app.content.lineTo(0.5 * Math.sqrt(3) * iObj.a, -0.5 * iObj.a);
						app.content.lineTo(0.5 * Math.sqrt(3) * iObj.a, 0.5 * iObj.a);
						app.content.lineTo(0,0);
						app.content.closePath();
						app.content.fillStyle = iObj.color;
						app.content.fill();
						app.content.restore();
						if (!bStatic) {
							var tri = [{x: iObj.positionX, y: iObj.positionY},
									   {x: iObj.positionX + iObj.a * Math.cos(iObj.angle - Math.PI / 6), y: iObj.positionY + iObj.a * Math.sin(iObj.angle - Math.PI / 6)},
									   {x: iObj.positionX + iObj.a * Math.cos(iObj.angle + Math.PI / 6), y: iObj.positionY + iObj.a * Math.sin(iObj.angle + Math.PI / 6)}];
							var j;

							for (j = 0; j < tri.length; j++){
								if (tri[j].y <= 0){
									iObj.speedY = Math.abs(iObj.speedY);
									break;
								}
								if (tri[j].y >= app.canvas.height){
									iObj.speedY = -(Math.abs(iObj.speedY));
									break;
								}
							}
							iObj.positionX = iObj.positionX - iObj.speedX;
							iObj.positionY = iObj.positionY + iObj.speedY;
						} 
						break;

					default:
						app.content.save();
						app.content.beginPath();
						app.content.translate(iObj.positionX, iObj.positionY);
						app.content.rotate(iObj.angle);
						app.content.closePath();
						app.content.fillStyle = iObj.color;
						app.content.fillRect(0, 0, iObj.b, iObj.a);
						app.content.restore();
						if (!bStatic) {
							var rect = [{x: iObj.positionX, y: iObj.positionY},
								 		{x: iObj.positionX + iObj.b * Math.cos(iObj.angle), y: iObj.positionY + iObj.b * Math.sin(iObj.angle)},
								 		{x: iObj.positionX - iObj.a * Math.sin(iObj.angle), y: iObj.positionY + iObj.a * Math.cos(iObj.angle)},
								 		{x: iObj.positionX + iObj.b * Math.cos(iObj.angle) - iObj.a * Math.sin(iObj.angle), 
								 			y: iObj.positionY + iObj.b * Math.sin(iObj.angle) + iObj.a * Math.cos(iObj.angle)}];
							var j;

							for (j = 0; j < rect.length; j++){
								if (rect[j].y <= 0){
									iObj.speedY = Math.abs(iObj.speedY);
									break;
								}
								if (rect[j].y >= app.canvas.height){
									iObj.speedY = -(Math.abs(iObj.speedY));
									break;
								}
							}
							iObj.positionX = iObj.positionX - iObj.speedX;
							iObj.positionY = iObj.positionY + iObj.speedY;
						}
						break;
				}
			}

			app.player.fn.drawPlayer(bStatic);
		},

		// 游戏结束以及游戏结束页面绘制
		gameover: function() {
			app.isStart = false;
			app.data.timeInterval = 2500;
			app.fn.stop();
			app.clock.fn.pauseCount();
			$('.start').text("Start");

			// 游戏结束提示信息显示：若未破纪录，则显示Game Over，若破纪录，则显示Congratulations
			app.content.save();
            app.content.fillStyle = 'rgba(250, 248, 239, 0.7)';
            app.content.fillRect(0, 0, app.canvas.width, app.canvas.height);
            app.content.fillStyle = "#776e65";
            app.content.font = "70px 'American Typewriter'";
            app.content.textBaseline = 'middle';
            app.content.textAlign = 'center';
            var txt = "Game Over!";

			if ((localStorage['crazycolors_minutes'] == undefined || localStorage['crazycolors_seconds'] == undefined)
				||(app.clock.minutes > localStorage['crazycolors_minutes']
					|| (app.clock.minutes == localStorage['crazycolors_minutes']
						&& app.clock.seconds > localStorage['crazycolors_seconds']))) {
				localStorage['crazycolors_minutes'] = app.clock.minutes;
				localStorage['crazycolors_seconds'] = app.clock.seconds;
				txt = "Congratulations!";
			}

			app.content.fillText(txt, app.canvas.width / 2, app.canvas.height / 2 - 30);
			app.content.font = "30px 'American Typewriter'";
			txt = "Score: ";
			if (app.clock.minutes > 0) {
				txt = txt + app.clock.minutes + 'm ';
			}
			txt = txt + app.clock.seconds + "s";
			app.content.fillText(txt, app.canvas.width / 2, app.canvas.height / 2 + 40);
			txt = "Record: ";
			if (localStorage['crazycolors_minutes'] > 0) {
				txt = txt + localStorage['crazycolors_minutes'] + 'm ';
			}
			txt = txt + localStorage['crazycolors_seconds'] + "s";
			app.content.fillText(txt, app.canvas.width / 2, app.canvas.height / 2 + 80);

            app.content.restore();

            document.getElementById('finishMusic').play();
		},

		// 获取obj对象的中心，保存在point中
		getCenter: function(obj, point) {
			switch (obj.type) {
				case 'circle':
					point.x = obj.positionX;
					point.y = obj.positionY;
					return;

				case 'triangle':
					point.x = obj.positionX + obj.a / Math.sqrt(3) * Math.cos(obj.angle);
					point.y = obj.positionY + obj.a / Math.sqrt(3) * Math.sin(obj.angle);
					break;

				default:
					point.x = obj.positionX + (obj.b * Math.cos(obj.angle) - obj.a * Math.sin(obj.angle)) / 2;
					point.y = obj.positionY + (obj.b * Math.sin(obj.angle) + obj.a * Math.cos(obj.angle)) / 2;
					break;
			}
		},

		// 帮助页面绘制
		getHelp: function(event) {
			var keynum, keychar;

			if (event) {
				keynum = event.keyCode || event.which;
				keychar = String.fromCharCode(keynum);
				if (keychar != 'H') {
					return;
				}
			}

			if (!app.isHelp) {
				app.isHelp = true;
				app.fn.drawObject(!(app.isStart && !app.isPause));

				app.content.save();
	            app.content.fillStyle = 'rgba(250, 248, 239, 0.7)';
	            app.content.fillRect(0, 0, app.canvas.width, app.canvas.height);
	            app.content.fillStyle = "#776e65";
	            app.content.font = "25px 'Microsoft YaHei'";
	            app.content.textBaseline = 'top';
	            var txt = "游戏规则:";
	            app.content.fillText(txt, 70, 25);
	            txt = "控制你的色块，避免与其他色块相撞，使自己存活尽可能长的时间。";
	            app.content.fillText(txt, 120, 65);
	            txt = "你的色块是在逐渐增大的，你可以通过与相同颜色或相同形状的色块";
	            app.content.fillText(txt, 120, 105);
	            txt = "碰撞以实现互换。"
	            app.content.fillText(txt, 120, 145);
	            txt = "游戏操作:";
	           	app.content.fillText(txt, 70, 185);
	            txt = "W / up: 上，S / down: 下，A / left: 左，D / right: 右"
	            app.content.fillText(txt, 120, 225);
	            txt = "R: 开始，P: 暂停，H: 帮助"
	            app.content.fillText(txt, 120, 265);
	            app.content.font = "40px 'American Typewriter'";
	            txt = "Hey! Are you ready? Are you crazy?"
	            app.content.textAlign = 'center';
	            app.content.fillText(txt, app.canvas.width / 2, 320);
	            app.content.restore();

	            if (app.isStart && !app.isPause) {
					app.clock.fn.pauseGame();
	            }
			}
			else {
				app.isHelp = false;
				app.fn.drawObject(!(app.isStart && !app.isPause));

				if (app.isStart && app.isPause) {
					app.clock.fn.pauseGame();
				}
				if (!app.isStart) {
					app.fn.initPage();
				}
			}
		},

		// 障碍物色块的构造函数，从属性集合中随机选择来得到随机的障碍物色块
		getObject: function(typeSet, radiusRange, speedRange, colorSet, angleRange, scrollHeight) {
			this.type = typeSet[app.fn.getRandomInt(0, typeSet.length - 1)];
			
			if (this.type === 'circle') { //圆半径
				this.a = app.fn.getRandomInt(radiusRange[0], radiusRange[1]);
			}
			else if (this.type === 'triangle') { //正三角形边长
				this.a = 2 * app.fn.getRandomInt(radiusRange[0], radiusRange[1]);
			}
			else { //长方形长宽
				this.a = app.fn.getRandomInt(radiusRange[0], radiusRange[1]);
				this.b = this.a * (Math.random() + 1);
			}

			this.speedX = app.fn.getRandomInt(speedRange[0], speedRange[1]);
			this.speedY = app.fn.getRandomInt(speedRange[0], speedRange[1]);
			if (this.speedX === 0) {
				this.speedX = 1;
			}
			if (this.speedY === 0) {
				this.speedY = 1;
			}

			this.color = colorSet[app.fn.getRandomInt(0, colorSet.length - 1)];

			this.angle = Math.random() * (angleRange[1] - angleRange[0]) + angleRange[0];
			if (this.angle == 0 || this.angle == Math.PI / 2 || this.angle == Math.PI
				|| this.angle == Math.PI * 3 / 2 || this.angle == Math.PI * 2
				|| this.angle == Math.PI / 3 || this.angle == Math.PI * 2 / 3
				|| this.angle == Math.PI * 4 / 3 || this.angle == Math.PI * 5 / 3) {
				this.angle += 1e-6;
			}

			var sign;
			sign = Math.random() > 0.5 ? 1 : -1;
			this.positionY = app.canvas.height / 2 + sign * Math.random() * (app.canvas.height / 2 - radiusRange[1]);
		},

		// 获取从startInt到endInt的随机整数
		getRandomInt: function(startInt, endInt) {
			return (startInt + (Math.floor(Math.random() * (endInt - startInt + 1))));
		},

		// 全局数据的初始化，是网页加载时进行的初始化操作
		init: function() {
			app.data.scrollHeight = document.body.scrollHeight;
			app.data.scrollWidth = document.body.scrollWidth;
			app.canvas = document.getElementById('canvas');
			app.content = app.canvas.getContext('2d');
			app.canvas.height = 400;
			app.canvas.width = 960;
			document.getElementsByTagName('body')[0].addEventListener('keydown', app.player.fn.move, false);
			document.getElementsByTagName('body')[0].addEventListener('keyup', app.player.fn.stop, false);
			document.getElementsByTagName('body')[0].addEventListener('keydown', app.clock.fn.startGame, false);
			document.getElementsByTagName('body')[0].addEventListener('keydown', app.clock.fn.pauseGame, false);
			document.getElementsByTagName('body')[0].addEventListener('keydown', app.fn.getHelp, false);
		},

		// 起始页面绘制，显示基本提示信息
		initPage: function() {
			app.content.save();
            app.content.fillStyle = 'rgba(250, 248, 239, 0.7)';
            app.content.fillRect(0, 0, app.canvas.width, app.canvas.height);
            app.content.fillStyle = "#776e65";
            app.content.font = "italic 40px 'American Typewriter'";
            app.content.textBaseline = 'middle';
            app.content.textAlign = 'center';
            var txt = "Enjoy yourself! Press R to start.";
			app.content.fillText(txt, app.canvas.width / 2, app.canvas.height / 2);
            app.content.restore();
		},

		// 色块相交的判定
		judgeIntersect: function(obj1, obj2) {
			// 按circle triangle rectangle顺序，使obj1优先于obj2，必要时交换，以避免重复考虑
			var tmp;
			if ((obj1.type != 'circle' 
				&& (obj2.type == 'circle'
					|| (obj1.type != 'triangle' && obj2.type == 'triangle')))) {
				tmp = obj1;
				obj1 = obj2;
				obj2 = tmp;
			}

			// 以下变量及函数主要是为了判断时代码的简洁以及更加语义化
			// obj1的位置及角度参数
			var x1 = obj1.positionX;
			var y1 = obj1.positionY;
			var sin1 = Math.sin(obj1.angle);
			var cos1 = Math.cos(obj1.angle);
			var tan1 = Math.tan(obj1.angle);
			var cot1 = Math.tan(Math.PI / 2 - obj1.angle);

			// obj2的位置及角度参数
			var x2 = obj2.positionX;
			var y2 = obj2.positionY;
			var sin2 = Math.sin(obj2.angle);
			var cos2 = Math.cos(obj2.angle);
			var tan2 = Math.tan(obj2.angle);
			var cot2 = Math.tan(Math.PI / 2 - obj2.angle);

			// 若obj1为三角形，其三个角的坐标
			var tri1 = [{x: x1, y: y1},
						{x: x1 + obj1.a * Math.cos(obj1.angle - Math.PI / 6), y: y1 + obj1.a * Math.sin(obj1.angle - Math.PI / 6)},
						{x: x1 + obj1.a * Math.cos(obj1.angle + Math.PI / 6), y: y1 + obj1.a * Math.sin(obj1.angle + Math.PI / 6)}];
			// 若obj2为三角形，其三个角的坐标
			var tri2 = [{x: x2, y: y2},
						{x: x2 + obj2.a * Math.cos(obj2.angle - Math.PI / 6), y: y2 + obj2.a * Math.sin(obj2.angle - Math.PI / 6)},
						{x: x2 + obj2.a * Math.cos(obj2.angle + Math.PI / 6), y: y2 + obj2.a * Math.sin(obj2.angle + Math.PI / 6)}];

			// 若obj1为三角形，其三条边的方程
			var tri_line1 = [function(x, y) {return Math.tan(obj1.angle - Math.PI / 6) * x - y + y1 - Math.tan(obj1.angle - Math.PI / 6) * x1},
							 function(x, y) {return Math.tan(obj1.angle + Math.PI / 6) * x - y + y1 - Math.tan(obj1.angle + Math.PI / 6) * x1},
							 function(x, y) {return Math.tan(obj1.angle + Math.PI / 2) * x - y + (tri1[1].y + tri1[2].y) / 2 - Math.tan(obj1.angle + Math.PI / 2) * (tri1[1].x + tri1[2].x) / 2}];
			// 若obj2为三角形，其三条边的方程
			var tri_line2 = [function(x, y) {return Math.tan(obj2.angle - Math.PI / 6) * x - y + y2 - Math.tan(obj2.angle - Math.PI / 6) * x2},
							 function(x, y) {return Math.tan(obj2.angle + Math.PI / 6) * x - y + y2 - Math.tan(obj2.angle + Math.PI / 6) * x2},
							 function(x, y) {return Math.tan(obj2.angle + Math.PI / 2) * x - y + (tri2[1].y + tri2[2].y) / 2 - Math.tan(obj2.angle + Math.PI / 2) * (tri2[1].x + tri2[2].x) / 2}];

			// 若obj2为三角形，某点到它的三条边的距离
			var dist_tri_line2 = [function(x, y) {return Math.abs(tri_line2[0](x, y)) / Math.sqrt(Math.tan(obj2.angle - Math.PI / 6) * Math.tan(obj2.angle - Math.PI / 6) + 1)},
								  function(x, y) {return Math.abs(tri_line2[1](x, y)) / Math.sqrt(Math.tan(obj2.angle + Math.PI / 6) * Math.tan(obj2.angle + Math.PI / 6) + 1)},
								  function(x, y) {return Math.abs(tri_line2[2](x, y)) / Math.sqrt(Math.tan(obj2.angle + Math.PI / 2) * Math.tan(obj2.angle + Math.PI / 2) + 1)}];

			// 若obj1为矩形，其四个角的坐标
			var rect1 = [{x: x1, y: y1},
						 {x: x1 + obj1.b * cos1, y: y1 + obj1.b * sin1},
						 {x: x1 - obj1.a * sin1, y: y1 + obj1.a * cos1},
						 {x: x1 + obj1.b * cos1 - obj1.a * sin1, y: y1 + obj1.b * sin1 + obj1.a * cos1}];
			// 若obj2为矩形，其四个角的坐标
			var rect2 = [{x: x2, y: y2},
						 {x: x2 + obj2.b * cos2, y: y2 + obj2.b * sin2},
						 {x: x2 - obj2.a * sin2, y: y2 + obj2.a * cos2},
						 {x: x2 + obj2.b * cos2 - obj2.a * sin2, y: y2 + obj2.b * sin2 + obj2.a * cos2}];

			// 若obj1为矩形，其四条边的方程
			var rect_line1 = [function(x, y) {return tan1 * x - y + rect1[0].y - tan1 * rect1[0].x},
							  function(x, y) {return tan1 * x - y + rect1[3].y - tan1 * rect1[3].x},
							  function(x, y) {return -cot1 * x - y + rect1[0].y + cot1 * rect1[0].x},
							  function(x, y) {return -cot1 * x - y + rect1[3].y + cot1 * rect1[3].x}];
			// 若obj2为矩形，其四条边的方程
			var rect_line2 = [function(x, y) {return tan2 * x - y + rect2[0].y - tan2 * rect2[0].x},
							  function(x, y) {return tan2 * x - y + rect2[3].y - tan2 * rect2[3].x},
							  function(x, y) {return -cot2 * x - y + rect2[0].y + cot2 * rect2[0].x},
							  function(x, y) {return -cot2 * x - y + rect2[3].y + cot2 * rect2[3].x}];
			// 若obj2为矩形，某点到它的四条边的距离
			var dist_rect_line2 = [function(x, y) {return Math.abs(rect_line2[0](x, y)) / Math.sqrt(tan2 * tan2 + 1 * 1)},
								   function(x, y) {return Math.abs(rect_line2[1](x, y)) / Math.sqrt(tan2 * tan2 + 1 * 1)},
								   function(x, y) {return Math.abs(rect_line2[2](x, y)) / Math.sqrt(cot2 * cot2 + 1 * 1)},
								   function(x, y) {return Math.abs(rect_line2[3](x, y)) / Math.sqrt(cot2 * cot2 + 1 * 1)}];
			// 两点间的距离
			var getDistance = function(x1, y1, x2, y2) {
				return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
			}
			var i, j;
			
			switch (obj1.type) {
				case 'circle':
					switch (obj2.type) {
						case 'circle': // circle & circle
							if (getDistance(x1, y1, x2, y2) < obj1.a + obj2.a) {
								return true;
							}
							return false;

						case 'triangle': // circle & triangle
							// 三角形的角在圆内，即角到圆心的距离小于半径
							for (i = 0; i < 3; i++) {
								if (getDistance(x1, y1, tri2[i].x, tri2[i].y) < obj1.a) {										
									return true;
								}
							}
							// 三角形的角在圆外但边在圆内，此时圆心与两角的连线一定构成锐角三角形且圆心到边的距离小于半径
							var theta1, theta2;

							theta1 = Math.abs(Math.atan2(y1 - tri2[0].y, x1 - tri2[0].x) - Math.atan2(tri2[1].y - tri2[0].y, tri2[1].x - tri2[0].x));
							theta2 = Math.abs(Math.atan2(y1 - tri2[1].y, x1 - tri2[1].x) - Math.atan2(tri2[0].y - tri2[1].y, tri2[0].x - tri2[1].x));
							if (theta1 > Math.PI) theta1 = 2 * Math.PI - theta1;
							if (theta2 > Math.PI) theta2 = 2 * Math.PI - theta2;
							if (dist_tri_line2[0](x1, y1) < obj1.a) {
								if (theta1 < Math.PI / 2 && theta2 < Math.PI / 2) {										
									return true;
								}
							}

							theta1 = Math.abs(Math.atan2(y1 - tri2[0].y, x1 - tri2[0].x) - Math.atan2(tri2[2].y - tri2[0].y, tri2[2].x - tri2[0].x));
							theta2 = Math.abs(Math.atan2(y1 - tri2[2].y, x1 - tri2[2].x) - Math.atan2(tri2[0].y - tri2[2].y, tri2[0].x - tri2[2].x));
							if (theta1 > Math.PI) theta1 = 2 * Math.PI - theta1;
							if (theta2 > Math.PI) theta2 = 2 * Math.PI - theta2;
							if (dist_tri_line2[1](x1, y1) < obj1.a) {
								if (theta1 < Math.PI / 2 && theta2 < Math.PI / 2) {										
									return true;
								}
							}

							theta1 = Math.abs(Math.atan2(y1 - tri2[2].y, x1 - tri2[2].x) - Math.atan2(tri2[1].y - tri2[2].y, tri2[1].x - tri2[2].x));
							theta2 = Math.abs(Math.atan2(y1 - tri2[1].y, x1 - tri2[1].x) - Math.atan2(tri2[2].y - tri2[1].y, tri2[2].x - tri2[1].x));
							if (dist_tri_line2[2](x1, y1) < obj1.a) {
								if (theta1 < Math.PI / 2 && theta2 < Math.PI / 2) {										
									return true;
								}
							}
							
							return false;

						default: // circle & rectangle
							// 矩形的角在圆内，即角到圆心的距离小于半径
							for (i = 0; i < 4; i++) {
								if (getDistance(x1, y1, rect2[i].x, rect2[i].y) < obj1.a) {
									return true;
								}
							}
							// 矩形的角在圆外但边在圆内，此时圆心一定在这条边相邻两边的平行线之间且圆心到边的距离小于半径
							if ((rect_line2[0](x1, y1) * rect_line2[1](x1, y1) < 0
								&& (dist_rect_line2[2](x1, y1) < obj1.a || dist_rect_line2[3](x1, y1) < obj1.a))
							 || (rect_line2[2](x1, y1) * rect_line2[3](x1, y1) < 0
								&& (dist_rect_line2[0](x1, y1) < obj1.a || dist_rect_line2[1](x1, y1) < obj1.a))) {
								return true;
							}
							return false;
					}

				case 'triangle':
					switch (obj2.type) {
						case 'triangle': // triangle & triangle
							// 分别判断obj1的角在不在obj2内以及obj2的角在不在obj1内
							for (i = 0; i < 3; i++) {
								for (j = 0; j < 3; j++) {
									if (tri_line1[j](tri2[i].x, tri2[i].y) * tri_line1[j](tri1[2-j].x, tri1[2-j].y) < 0) {
										break;
									}
								}
								if (j == 3) {										
									return true;
								}
							}
							for (i = 0; i < 3; i++) {
								for (j = 0; j < 3; j++) {
									if (tri_line2[j](tri1[i].x, tri1[i].y) * tri_line2[j](tri2[2-j].x, tri2[2-j].y) < 0) {
										break;
									}
								}
								if (j == 3) {
									return true;
								}
							}
							return false;

						default: // triangle & rectangle
							// 判断三角形的角在不在矩形内
							for (i = 0; i < 3; i++) {
								if (rect_line2[0](tri1[i].x, tri1[i].y) * rect_line2[1](tri1[i].x, tri1[i].y) < 0 
									&& rect_line2[2](tri1[i].x, tri1[i].y) * rect_line2[3](tri1[i].x, tri1[i].y) < 0) {
									return true;
								}
							}
							// 判断矩形的角在不在三角形内
							for (i = 0; i < 4; i++) {
								for (j = 0; j < 3; j++) {
									if (tri_line1[j](rect2[i].x, rect2[i].y) * tri_line1[j](tri1[2-j].x, tri1[2-j].y) < 0) {
										break;
									}
								}
								if (j == 3) {
									return true;
								}
							}
							return false;
					}

				default: // rectangle & rectangle
					// 分别判断obj1的角在不在obj2内以及obj2的角在不在obj1内
					for (i = 0; i < 4; i++) {
						if (rect_line2[0](rect1[i].x, rect1[i].y) * rect_line2[1](rect1[i].x, rect1[i].y) < 0 
							&& rect_line2[2](rect1[i].x, rect1[i].y) * rect_line2[3](rect1[i].x, rect1[i].y) < 0) {
							return true;
						}
						if (rect_line1[0](rect2[i].x, rect2[i].y) * rect_line1[1](rect2[i].x, rect2[i].y) < 0 
							&& rect_line1[2](rect2[i].x, rect2[i].y) * rect_line1[3](rect2[i].x, rect2[i].y) < 0) {
							return true;
						}
					}
					return false;
			}
		},

		// 音乐控制
		pauseMusic: function() {
			if(app.isMusicPause == false) {
				document.getElementById('bgMusic').pause();
				$('#M1').css('display','none');
				$('#M2').css('display','block');
				app.isMusicPause = true;
			}
			else {
				document.getElementById('bgMusic').play();
				$('#M2').css('display','none');
				$('#M1').css('display','block');
				app.isMusicPause = false;
			}
		},

		// 运行
		run: function() {
			app.aniamted[0] = setInterval(app.fn.drawObject, 10);
			app.aniamted[1] = setInterval(app.fn.crash, 10);
			app.aniamted[2] = setTimeout(app.fn.addObject, app.data.timeInterval);
		},

		// 暂停
		stop: function() {
			clearInterval(app.aniamted[0]);
			clearInterval(app.aniamted[1]);
			clearTimeout(app.aniamted[2]);
		},

		// 交换函数，交换色块对象的某些属性，用于玩家色块与同形状或同颜色色块的碰撞
		swap: function(obj1, obj2) {
			var tmp;
			if (arguments.length == 3) {	// 利用函数重载可以使色块对象交换属性
				tmp = obj1[arguments[2]];
				obj1[arguments[2]] = obj2[arguments[2]];
				obj2[arguments[2]] = tmp;
				return;
			}

			app.fn.swap(obj1, obj2, 'positionX');
			app.fn.swap(obj1, obj2, 'positionY');
			app.fn.swap(obj1, obj2, 'type');
			app.fn.swap(obj1, obj2, 'a');
			app.fn.swap(obj1, obj2, 'b');
			app.fn.swap(obj1, obj2, 'color');
			app.fn.swap(obj1, obj2, 'angle');
		}
	}
}

window.onload = function() {
	app.fn.init();
	app.fn.drawObject();
	app.fn.initPage();
	document.getElementById('bgMusic').pause();
}