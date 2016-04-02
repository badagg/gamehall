//导入服务包
var webSocketServer = require("ws").Server;

//实例化一个socket服务 并设置端口号
var wss = wss ? wss : new webSocketServer({ port: 4000 });

//与客户端约定的 标示
var ACT = {
	NEW_USER_INTO:"新用户进入",
	ROLE_STATE:"更新小人状态",
	NEW_MESSAGE:"发送新消息"
}

//纪录总人数
var total = 0;
//纪录当前人数
var count = 0;
//所有用户
var wsGroup = [];
var userGroup = [];

//监听socket实例
wss.on("connection",function(ws){
	ws.on("message",function(message){
		var msg = JSON.parse(message);
		//新人加入
		if(msg['action'] == ACT.NEW_USER_INTO){
			total++;

			var user = {
				id:total,
				name:msg['data'].name,
				face:msg['data'].face,
				x:msg['data'].x,
				y:msg['data'].y,
				dir:msg['data'].dir || 0,
				walk:msg['data'].walk || 0
			}

			userGroup.push(user);

			ws.user = user;
			wsGroup.push(ws);

			noticeUsers({
				action:msg['action'],
				data:userGroup
			})
		}
		//更新人物坐标状态
		if(msg['action'] == ACT.ROLE_STATE){
			noticeUsers({
				action:msg['action'],
				data:msg['data']
			})
			//更新小人在userGroup里面的坐标
			userGroup.forEach(function(o,i){
				if(msg['data'].id == o.id){
					o.x = msg['data'].x;
					o.y = msg['data'].y;
					o.dir = msg['data'].dir;
					o.walk = msg['data'].walk;
				}
			})
		}
		//接收新消息后 广播出去
		if(msg['action'] == ACT.NEW_MESSAGE){
			//发送给所有人
			if(msg['data']['targetID'] == "all"){
				noticeUsers({
					action:msg['action'],
					type:msg['data']['targetID'],
					sender:msg['data']['selfID'],
					senderName:ws.user['name'],
					msg:msg['data']['msg'],
					time:_t.getTime()
				})
			}
		}
	})

	ws.on("close",function(){
		_t.removeElem(wsGroup,ws);
		_t.removeElem(userGroup,ws.user);
		noticeUsers({
			action:ACT.NEW_USER_INTO,
			data:userGroup
		})
	})
})

//通知所有用户
var noticeUsers = function(data){
	wsGroup.forEach(function(o,i){
		o.send(JSON.stringify(data));
	})
}


//工具类
var _t = {
	//剔除指定数组元素
	removeElem:function(a,e){
		if(a.indexOf(e) != -1){
			var id = a.indexOf(e);
			a.splice(id,1);
		}
	},
	//补0
	fill:function(num){
		var str = num+"";
		if(num < 10)str = "0" + num;
		return str;
	},
	//获取年月日时分秒 如：2014-6-25 17:55:32
	getTime:function(){
		var dt = new Date();
		var str = dt.getFullYear()+"/"+
			this.fill(Number(dt.getMonth()+1))+"/"+
			this.fill(dt.getDate())+" "+
			this.fill(dt.getHours())+":"+
			this.fill(dt.getMinutes())+":"+
			this.fill(dt.getSeconds());
		return str;
	}
}