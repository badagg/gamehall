var React = require('react');
var ChatContent = require('./ChatContent');
var observer = require('../managerEvent');
var ACT = require('../action');
var _t = require('../tools');

module.exports = React.createClass({
	chatTargetID:"all",//设定聊天目标 群聊或私聊
	getInitialState:function(){
		return {
			chatList:[],
			chatBoxHeight:0
		}
	},
	componentWillMount:function(){
		var the = this;
		observer.addEvent(function(e){
			if(e.action == ACT.GET_NEW_MESSAGE){
				var arr = the.state.chatList;
				arr.push(e.data);
				the.setState({
					chatList:arr
				})
			}
		})
	},
	componentDidUpdate:function(){
		//让滚动条始终保持在最底下 显示最新消息
		this.refs.myChatBox.scrollTop = 99999;
	},
	downEvent:function(e){
		if(e.keyCode == 13){
			this.send();
		}
	},
	send:function(){
		var the = this;
		var msg = this.refs.myInput.value;
		if(_t.filterString(msg) && msg){
			observer.dispatchEvent({
				action:ACT.NEW_MESSAGE,
				data:{
					selfID:the.props.id,
					targetID:the.chatTargetID,
					msg:msg
				}
			})
			this.refs.myInput.value = '';
		}else{
			console.log('内容为空或有敏感字符');
		}
	},
	focus:function(e){
		this.props.callbackChangeChat(e);
		this.setState({
			chatBoxHeight:170
		})
	},
	blur:function(e){
		this.props.callbackChangeChat(e);
		this.setState({
			chatBoxHeight:0
		})
	},
	//改变聊天对象
	changeSelect:function(e){
		this.chatTargetID = e.target.value;
	},
	render:function(){
		var the = this;
		//把自己从列表里找到并剔除 因为自己不能和自己说话
		var newUsers = [];
		for(var i=0;i<this.props.users.length;i++){
			if(this.props.users[i]['id'] != this.props.id){
				newUsers.push(this.props.users[i]);
			}
		}
		return(
			<div className='input-panel'>
				<div ref='myChatBox' className='chat-content-box' style={{height:this.state.chatBoxHeight}}>{
					this.state.chatList.map(function(elem, index) {
						return <ChatContent key={index} 
								name={elem.senderName} 
								type={elem.type}
								msg={elem.msg}
								id={the.props.id}
								time={elem.time} />;
					})
				}</div>
				<div className='ubb'>
					<select onChange={this.changeSelect}>
						<option value='all'>所有人</option>
						{
							newUsers.map(function(elem, index) {
								return <option key={index} value={elem.id}>{elem.name}</option>;
							})
						}
					</select>
					<input ref='myInput' type='text' placeholder='这里可以聊天哦...'
						onFocus={this.focus.bind(null,true)}
						onBlur={this.blur.bind(null,false)}
						onKeyDown={this.downEvent} />
				</div>
			</div>
		)
	}
})