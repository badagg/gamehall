var React = require('react');
var Role = require('./Role');
var InputPanel = require('./InputPanel');
var observer = require('../managerEvent');
var ACT = require('../action');

module.exports = React.createClass({
	getInitialState:function(){
		return {
			users:[]
		}
	},
	cid:0,
	isid:true,
	isChat:false,//判断是否是聊天 还是移动小人
	chatTargetID:"all",//设定聊天目标 群聊或私聊
	cx:0,
	cy:0,
	cdir:0,
	cwalk:0,
	componentWillMount:function(){
		var the = this;
		observer.addEvent(function(e){
			if(e.action == ACT.NEW_USER_INTO){
				//获取最后进入用户的ID
				//这个isid很重要 不做判断会导致 无法标识唯一
				if(the.isid){
					the.cid = e.data[e.data.length-1]['id'];
					the.isid = false;
				}
				
				the.setState({
					users:e.data
				})
			}
			if(e.action == ACT.SAVE_ROLE_XY){
				if(e.data.id == the.cid){
					the.cx = e.data.x;
					the.cy = e.data.y;
					the.cdir = e.data.dir;
					the.cwalk = e.data.walk;
				}
			}
		})

		document.addEventListener('keydown',this.downEvent);
		document.addEventListener('keyup',this.upEvent);

	},
	downEvent:function(e){
		var the = this;
		var kc=e.keyCode;

		//发送小人状态
		if(!this.isChat){
			if(kc==37 || kc==38 || kc==39 || kc==40 || kc==65 || kc==68 || kc==83 || kc==87){
				observer.dispatchEvent({
					action:ACT.ROLE_STATE,
					data:{
						keyCode:e.keyCode,
						id:the.cid,
						x:the.cx,
						y:the.cy,
						dir:the.cdir,
						walk:the.cwalk
					}
				})
			}
		}
	},
	upEvent:function(e){
		var the = this;
		observer.dispatchEvent({
			action:ACT.KEY_UP_EVENT,
			data:{
				id:the.cid,
				keyCode:e.keyCode
			}
		})
	},
	//改变输入对象
	changeChat:function(boo){
		this.isChat = boo;
	},
	render:function(){
		var roles = [];
		var the = this;
		this.state.users.map(function(elem, index) {
			roles.push(<Role 
				x={elem.x}
				y={elem.y}
				dir={elem.dir}
				walk={elem.walk}
				key={index} 
				name={elem.name}
				id={elem.id} 
				src={elem.face} />)
		})
		return(
			<div ref='myStage' className='stage'>
				<InputPanel callbackChangeChat={this.changeChat} id={this.cid} targetID={this.chatTargetID} />
				{roles}
			</div>
		)
	}
})