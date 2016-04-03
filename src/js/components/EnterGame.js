var React = require('react');
var observer = require('../managerEvent');
var ACT = require('../action');
var _t = require('../tools');

module.exports = React.createClass({
	getInitialState:function(){
		return {
			currentSrc:null,
			currentIndex:0,
			finish:false
		}
	},
	selectFace:function(src,i){
		this.setState({
			currentSrc:src,
			currentIndex:i
		})
	},
	submit:function(){
		var name = this.refs.myInput.value;
		if(!this.state.currentSrc){
			alert('选一个自己喜欢的人物吧');
		}else if(_t.filterString(name) && name){
			observer.dispatchEvent({
				action:ACT.SAVE_USER_INFO,
				data:{
					name:name.substring(0,10),
					src:this.state.currentSrc
				}
			})
			this.setState({
				finish:true
			})
		}else{
			alert('名字为空或有敏感字符');
		}
	},
	downEvent:function(e){
		if(e.keyCode == 13){
			this.submit();
		}
	},
	render:function(){
		var picData = [];
		for(var i=1;i<=19;i++){
			var isOn = (this.state.currentIndex == i) ? "on" : "";
			var src = 'src/img/role/r'+i+'.jpg'
			picData.push(
				<li key={i} onClick={this.selectFace.bind(this,src,i)} className={isOn} style={{background:'url('+src+')'}}></li>
			)
		}
		return(
			<div className='enter-game' style={{display:this.state.finish?'none':'block'}}>
				<div className='pic-box'>
					<ul className='clear'>
						{picData}
					</ul>
				</div>
				<div className='btn'>
					<p><input ref='myInput' type='text' placeholder='取个名字吧' onKeyDown={this.downEvent}/></p>
					<p><button onClick={this.submit}>进入游戏大厅</button></p>
				</div>
			</div>
		)
	}
})