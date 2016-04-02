var React = require('react');

module.exports = React.createClass({
	render:function(){
		var isWhisper = (this.props.type === 'all') ? false:true;
		return (
			<p className='chat-content'>
				<span className='whisper' style={{display:isWhisper?'inline-block':'none'}}>[悄悄话] </span>
				<span className='name'>{this.props.name}: </span>
				<span className='msg'>{this.props.msg}</span>
			</p>
		)
	}
})