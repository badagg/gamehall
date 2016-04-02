var observer = require('./managerEvent');
var ACT = require('./action');

module.exports = {
	start:function(userInfo){
		var socket = new WebSocket('ws://localhost:4000');
		socket.onopen = function(e){
			console.log('success');
			//通知服务端 有新用户加入
			socket.send(JSON.stringify({
				action:ACT.NEW_USER_INTO,
				data:userInfo
			}));

			//接受各种事件
			observer.addEvent(function(e){
				//发送小人状态
				if(e.action == ACT.ROLE_STATE){
					socket.send(JSON.stringify({
						action:ACT.ROLE_STATE,
						data:e.data
					}));
				}

				//发送新消息
				if(e.action == ACT.NEW_MESSAGE){
					socket.send(JSON.stringify({
						action:ACT.NEW_MESSAGE,
						data:e.data
					}));
				}
			})
			
		}

		socket.onmessage = function(e){
			var msg = JSON.parse(e.data);

			//新用户进入
			if(msg['action'] == ACT.NEW_USER_INTO){
				observer.dispatchEvent({
					action:ACT.NEW_USER_INTO,
					data:msg['data']
				})
			}

			//更新小人状态
			if(msg['action'] == ACT.ROLE_STATE){
				observer.dispatchEvent({
					action:ACT.ROLE_STATE_ING,
					data:msg['data']
				})
			}

			//更新聊天消息
			if(msg['action'] == ACT.NEW_MESSAGE){
				observer.dispatchEvent({
					action:ACT.GET_NEW_MESSAGE,
					data:msg
				})
			}

		}

		socket.onclose = function(){
			console.log('closed...');
		}

	}
}













