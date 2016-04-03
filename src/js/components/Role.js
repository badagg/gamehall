var React = require('react');
var observer = require('../managerEvent');
var ACT = require('../action');

module.exports = React.createClass({
	getInitialState:function(){
		return {
			x:this.props.x || 0,
			y:this.props.y || 0,
			dir:this.props.dir || 0,
			walk:this.props.walk || 0,
			msg:'',
			isView:0,
			isWhisper:false
		}
	},
	getDefaultProps:function(){
		return {
			speed:5//小人走路的速度
		}
	},
	timer:null,
	componentWillMount:function(){
		var the = this;
		observer.addEvent(function(e){
			// if(e.action == ACT.KEY_DOWN_EVENT){
			// 	if(e.data['id'] == the.props.id){
			// 		the.downEvent(e.data['keyCode']);
			// 	}
			// }

			if(e.action == ACT.KEY_UP_EVENT){
				if(e.data['id'] == the.props.id){
					the.upEvent();
				}
			}
			//所有小人的状态都有服务端发送的指令来协调
			if(e.action == ACT.ROLE_STATE_ING){
				if(e.data['id'] == the.props.id){
					the.downEvent(e.data['keyCode']);
				}
			}

			//发送消息 以气泡的方式显示
			if(e.action == ACT.GET_NEW_MESSAGE){
				if(e.data['sender'] == the.props.id){
					var iswp = (e.data['type'] != 'all') ? true : false; //判断消息是否是私聊
					the.setState({
						msg:e.data['msg'],
						isView:1,
						isWhisper:iswp
					})
					//气泡在几秒之内自动隐藏
					clearTimeout(the.timer);
					the.timer = setTimeout(function(){
						the.setState({
							isView:0
						})
					},5000)
				}
			}

		})
	},
	downEvent:function(code){
		switch(code){
			case 37:
			case 65:
				var _x = this.state.x;
				_x -= this.props.speed;
				this.setState({dir:1,x:_x});
				break; // left
			case 38:
			case 87:
				var  _y = this.state.y;
				_y -= this.props.speed;
				this.setState({dir:3,y:_y});
				break; // up
			case 39:
			case 68:
				var _x = this.state.x;
				_x += this.props.speed;
				this.setState({dir:2,x:_x});
				break; // right
			case 40:
			case 83:
				var  _y = this.state.y;
				_y += this.props.speed;
				this.setState({dir:0,y:_y});
				break; // down
		}
		//让role走起来
		var kc = code;
		if(kc==37 || kc==38 || kc==39 || kc==40 || kc==65 || kc==68 || kc==83 || kc==87){
			var w = this.state.walk;
			w++;
			if(w>3) w = 0;
			this.setState({walk:w});
		}

		//发送自己的属性
		var the = this;
		observer.dispatchEvent({
			action:ACT.SAVE_ROLE_XY,
			data:{
				id:the.props.id,
				x:the.state.x,
				y:the.state.y,
				dir:the.state.dir,
				walk:the.state.walk
			}
		})
	},
	upEvent:function(){
		this.setState({walk:0});
	},
	render:function(){
		var _dir = -this.state.dir * 48;
		var _walk = -this.state.walk * 32;
		var msgClass = this.state.isWhisper ? "msg whisper" : "msg";

		return(
			<div className='role' style={{
				left:this.state.x,
				top:this.state.y,
				zIndex:this.state.y
			}}>
				<div className='pic' style={{
					backgroundImage:'url('+this.props.src+')',
					backgroundPosition:_walk+'px '+ _dir+'px'
				}}></div>
				<p className='name'>{this.props.name}</p>
				<p className={msgClass} style={{opacity:this.state.isView}}>{this.state.msg}</p>
			</div>
		)
	}
})
