//引入CSS
require('../css/master.scss');

//引入系统模块
var React = require('react');
var ReactDOM = require('react-dom');

//引入自定义组件
var Stage = require('./components/Stage');
var EnterGame = require('./components/EnterGame')

//通讯服务
var observer = require('./managerEvent');

//通讯标识
var ACT = require('./action');

//web socket
var socket = require('./socket');

//渲染玩家选择界面
ReactDOM.render(
	<EnterGame />,
	document.getElementById('enterGame')
)
//玩家输入完成 进入游戏大厅
observer.addEvent(function(e){
	if(e.action == ACT.SAVE_USER_INFO){

		//渲染游戏大厅
		ReactDOM.render(
			<Stage />,
			document.getElementById('app')
		)

		//开启socket服务
		socket.start({
			name:e.data['name'],
			face:e.data['src'],
			x:Math.random() * (document.body.clientWidth - 32) + 32,
			y:Math.random() * (document.body.clientHeight - 48) + 48
		});
	}
})










