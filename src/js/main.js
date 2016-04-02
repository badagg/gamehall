//引入CSS
require('../css/master.scss');

//引入系统模块
var React = require('react');
var ReactDOM = require('react-dom');

//引入自定义组件
var Stage = require('./components/Stage');

//通讯服务
var observer = require('./managerEvent');

//web socket
var socket = require('./socket');

//渲染
ReactDOM.render(
	<Stage />,
	document.getElementById('app')
)

//新人加入 传入用户信息
socket.start({
	name:Math.round(Math.random() * 9999),
	face:'src/img/role/r'+Math.ceil(Math.random() * 19)+'.jpg',
	x:document.body.clientWidth/2-16,
	y:document.body.clientHeight/2-24
});
