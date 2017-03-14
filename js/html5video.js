/*
 * 作者：djl
 * 邮箱：474569696@qq.com
 * 日期：2017-2-22
 * 名称：DJLVideo
 * 注释：html5 video 接口封装
 */
function DJLVideo(id) {
	this.id = document.getElementById(id);
	this.listening = function(events, val, fn) {
		var thisid = this.id,total = 0;
		thisid.addEventListener(events, function() {
			total = thisid[val]; //获取总时长
			fn(total);
		}, false);
	};
}
DJLVideo.prototype = {
	//播放
	"play": function() {
		this.id.play();
	},
	"readyState":function(){
		return this.id.readyState;
	},
	"controls":function(boolenval){
		this.id.controls = boolenval;
	},
	//静音
	"mute":function(flag){
		this.id.muted = flag;
	},
	"progress":function(fn){
		this.listening("progress", 'progress', fn);
	},
	//暂停
	"pause": function() {
		this.id.pause();
	},
	//总时长
	"duration": function(fn) {
		this.listening("loadedmetadata", 'duration', fn);
	},
	//播放时间点更新时
	"timeupdate": function(fn) {
		this.listening("timeupdate", 'currentTime', fn);
	},
	//设置播放点,快进快退
	"playtoseconds": function(num, step) {
		var thisid = this.id;
		if(!num){
			num = 0;
		}
		if(arguments.length == 2) {
			thisid.currentTime = num + step;
		} else {
			thisid.currentTime = num;
		}
	},
	//音量改变时
	"volumchange": function(fn) {
		this.listening("volumechange", 'volume', fn);
	},
	//音量改变时
	"volumset": function(num) {
			this.id.volume = num;
		}
	}
/*
 * 作者：djl
 * 邮箱：474569696@qq.com
 * 日期：2017-2-22
 * 名称：DJLVideoPlay
 * 注释：html5 video ui接口封装
 */
function DJLVideoPlay(obj) {
	var defaultObj = {
		"poster":"",
		"liveStreams":{},
		"father":"videopart",
		"id":"myVideo", //id
		"controlbtn":{//如需自定义，请全部自定义controlbtn按钮样式表名称，这里不再做默认和自定义判断，否则会报错
			"control":"control",
			"play":"play",
			"pause":"pause",
			"nowtime":"nowtime",
			"scroll":{//音量
				"volumscroll":"scroll",//音量父元素 
				"volumscrollson":"scrollson",//音量圆
				"volumscrollbg":"scrollsonbg",//音量背景
			},
			"timeline":{
				"timeline":"timeline",
				"playin":"playin",
				"playbg":"playinbg"
			},
			"volum":"volum",
			"fullscreen":"fullscreen",
			"totaltime":"totaltime",
			"playbtn":"playbtn"
		},
		"videoPart":["tag","body",0],//type,class/id,index
	}
	this.controlbtn = obj.controlbtn?obj.controlbtn:defaultObj.controlbtn;
	this.scroll     = this.controlbtn.scroll?this.controlbtn.scroll:defaultObj.controlbtn.scroll;
	this.timeline   = this.controlbtn.timeline?this.controlbtn.timeline:defaultObj.controlbtn.timeline;
	this.scroll.volumf  = this.controlbtn.scroll.volumscroll;
	this.scroll.volums  = this.controlbtn.scroll.volumscrollson;
	this.scroll.bg      = this.controlbtn.scroll.volumscrollbg;
	this.timeline.linef = this.timeline.timeline;
	this.timeline.playin = this.timeline.playin;
	this.timeline.playbg = this.timeline.playbg;
	this.control         = this.controlbtn.control;
	this.play            = this.controlbtn.play;
	this.pause           = this.controlbtn.pause;
	this.nowtime         = this.controlbtn.nowtime;
	this.volum           = this.controlbtn.volum;
	this.totaltime       = this.controlbtn.totaltime;
	this.playbtn         = this.controlbtn.playbtn;
	this.fullscreen      = this.controlbtn.fullscreen;
	
	if(obj){
		this.id = obj.id?obj.id:defaultObj.id;
		this.father          = obj.father?obj.father:defaultObj.father;
		this.htmlappendTo   = obj.videoPart?obj.videoPart:defaultObj.videoPart;
		
		this.poster       = obj.poster?obj.poster:defaultObj.poster;
		this.liveStreams  = obj.liveStreams?obj.liveStreams:defaultObj.liveStreams;
	}else{
		this.id = defaultObj.id;
		this.father          = defaultObj.father;
		this.htmlappendTo   = defaultObj.videoPart;
		 
		this.poster       = defaultObj.poster;
		
		this.liveStreams  = defaultObj.liveStreams;
	}
	this.init(this);
}
DJLVideoPlay.prototype={
	"DJLVolumScroll":function(thisobj, father, son, sonbg, volumval, fn){//音量模拟滚动条
		var tid, tfather, tson, tsonbg, tsonval, leftval = 0,tfahterhei, tsonhei;
		tid        = thisobj.selfid.parentNode;
		tfather    = tid.getElementsByClassName(father)[0];
		tson       = tfather.getElementsByClassName(son)[0];
		tsonbg     = tfather.getElementsByClassName(sonbg)[0];
		tfahterwid = parseInt(this.getStyle(tfather, "width"));
		tsonwid    = parseInt(this.getStyle(tson, "width"));
		//初始化音量50%
		if(volumval) {
			tson.style.left      = (tfahterwid - tsonwid ) / 2 + "px";
			tsonbg.style.width = tfahterwid  / 2 + "px";
		}
		var flag = false;
		var tfatheroffsetleft = thisobj.getOffset(tfather);
		tfather.onmousedown = function() {
			flag = true;
			document.body.onselectstart = function (){
				return false;
			}
			
			if(flag) {
				document.onmousemove = function(e) {
					var ev = window.event||e;
					var eval = ev.pageX||ev.clientX;
					var fixleft          = tfatheroffsetleft.left;
					leftval              = eval - fixleft;
					tson.style.left      = (leftval) + "px"; //正常音量
					tsonbg.style.width = (leftval) + "px";
					if(leftval>= tfahterwid-tsonwid) { //音量最大
						tson.style.left      = (tfahterwid - tsonwid) + "px";
						tsonbg.style.width = tfahterwid+"px";
						leftval              = tfahterwid - tsonwid;
					}
					if(eval - fixleft - tsonwid < 0) { //音量无
						tson.style.left   = "0px";
						tsonbg.style.width       = "0px";
						leftval = 0;
					}
					fn(leftval);
				}
			}
		}
		tfather.onmouseup = function(e) {
			var ev = window.event||e;
			var eval = ev.pageX||ev.clientX;
			flag = false;
			timelineflag = false;
			document.body.onselectstart = null;
			document.onmousemove = null;
			var fixleft          = tfatheroffsetleft.left;
			leftval              = eval - fixleft;
			if(leftval>100){
				leftval = 100;
			}else if(leftval<=0){
				leftval = 0;
			}
			tson.style.left      = (leftval) + "px"; //正常音量
			tsonbg.style.width = (leftval) + "px";
			fn(leftval);
		}
		document.onmouseup = function(e) {
			flag = false;
			timelineflag = false;
			document.onmousemove = null;
			document.body.onselectstart = null;
		}
	},
	"timeformcat":function(total){//格式化时分秒
		var hour = parseInt(total / 3600);
		var minutes = parseInt((total - hour * 3600) / 60);
		var seconds = parseInt(total - hour * 3600 - minutes * 60);
		return(hour < 10 ? ("0" + hour) : hour) + ":" + (minutes < 10 ? ("0" + minutes) : minutes) + ":" + (seconds < 10 ? ("0" + seconds) : seconds);
	},
	//初始化长度
	"intwid":function(selfobj,flag) {
		var obj = selfobj.selfid.parentNode;
		if(!flag){
			obj.setAttribute("originhei", this.getStyle(obj, "height"));
			obj.setAttribute("originwid", this.getStyle(obj, "width"));
			selfobj.timelineObj.setAttribute("originwid",selfobj.timelineObj.clientWidth);
		}else{
			selfobj.timelineObj.removeAttribute("style");
		}
	},
	//获取样式表
	"getStyle":function (obj, attr) {
		if(obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	},
	//全屏方法调用
	"FullScreen": function(El) {
		if(El.requestFullScreen) {
			El.requestFullScreen();
		} else if(El.mozRequestFullScreen) {
			El.mozRequestFullScreen();
		} else if(El.webkitRequestFullScreen) {
			El.webkitRequestFullScreen();
		} else if(El.msRequestFullScreen) {
			El.msRequestFullScreen();
		} else {
			return false;
		}
	},
	//取消全屏方法调用
	"CancelFullScreen": function() {
		var DT = document;
		if(DT.exitFullscreen) {
			DT.exitFullscreen();
		} else if(DT.mozCancelFullScreen) {
			DT.mozCancelFullScreen();
		} else if(DT.webkitCancelFullScreen) {
			DT.webkitCancelFullScreen();
		} else if(DT.msExitFullscreen) {
			DT.msExitFullscreen();
		} else {
			return false;
		}
		var videoObj     = this.selfid;
		var parentobj    = videoObj.parentNode;
		parentobj.removeAttribute("style");
		videoObj.removeAttribute("style");
		this.fullscreenbtnObj.style.backgroundPosition = "8px -74px";
		this.fullscreenbtnObj.setAttribute("fs", "false");
		var timelenwid   = this.timelineObj.getAttribute("originwid");
		this.timelineObj.style.width = timelenwid + "px";
		var stylecopy    = parentobj.getAttribute("stylecopy");
		if(stylecopy){
			parentobj.setAttribute("style",stylecopy);
		}
	},
	"escFullScreen": function(self) {
		if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			//退出全屏执行
			self.CancelFullScreen();
		}
	},
	//dom填充
	"htmlappend":function(){
		var html = '';
			html += '<div class="'+this.father+'" >';
				html += '<video id="'+this.id+'" poster="'+this.poster +'" src="'+this.liveStreams+'"  type="video/mp4"></video>';
				html += '<div class="'+this.control+'" >';
					html += '<div class="'+this.play+'"></div>';
					html += '<div class="'+this.pause+'"></div>';
					html += '<div class="'+this.nowtime+'">00:00:00</div>';
					html += '<div class="'+this.timeline.linef+'">';	
						html += '<div class="'+this.timeline.playin+'" ></div>';	
						html += '<div class="'+this.timeline.playbg+'"></div>';	
					html += '</div>';	
					html += '<div class="'+this.fullscreen+'"></div>';	
					html += '<div class="'+this.scroll.volumf+'">';	
						html += '<div class="'+this.scroll.volums+'"></div>';	
						html += '<div class="'+this.scroll.bg+'"></div>';	
					html += '</div>';		
					html += '<div class="'+this.volum+'"></div>';
					html += '<div class="'+this.totaltime+'"></div>';
				html += '</div>';	
				html += '<div class="'+this.playbtn+'"></div>';	
			html += '</div>';
		if(this.htmlappendTo[0]=="class"){
			document.getElementsByClassName(this.htmlappendTo[1])[this.htmlappendTo[2]].innerHTML=html;
		}else if(this.htmlappendTo[0]=="tag"){
			document.getElementsByTagName(this.htmlappendTo[1])[this.htmlappendTo[2]].innerHTML=html;
		}else{
			document.getElementById(this.htmlappendTo[1]).innerHTML=html;
		}
	},
	"getOffset":function(Node, offset) {
	    if (!offset) {
	        offset = {};
	        offset.top = 0;
	        offset.left = 0;
	    }
	
	    if (Node == document.body) {//当该节点为body节点时，结束递归
	        return offset;
	    }
	    var nodeposition  = this.getStyle(Node,"position");
		if(nodeposition=="absolute"||nodeposition=="relative"||nodeposition=="fixed"){
			offset.top += Node.offsetTop;
	    	offset.left += Node.offsetLeft;
		}else{
			offset.top +=0;
	   		offset.left += 0;
		}
		return this.getOffset(Node.parentNode, offset);//向上累加offset里的值
	    
	},
	//初始化操作
	"init":function(self){
		
		var volumf = this.scroll.volumf;
		var volums = this.scroll.volums;
		var bg     = this.scroll.bg;
		var _self = this
		var parentobj,myvideo,volumval=0.5;
		this.htmlappend();
		this.selfid  = document.getElementById(this.id);
		parentobj     = this.selfid.parentNode;
		this.fullscreenbtnObj = parentobj.getElementsByClassName(this.fullscreen)[0];
		this.timelineObj      = parentobj.getElementsByClassName(this.timeline.linef)[0];
		this.playbtnObj  = parentobj.getElementsByClassName(this.playbtn)[0];
		this.pausebtnObj      = parentobj.getElementsByClassName(this.pause)[0];
		this.playObj          = parentobj.getElementsByClassName(this.play)[0];
		this.playinbtnObj     = parentobj.getElementsByClassName(this.timeline.playin)[0];
		this.totaltimeObj     = parentobj.getElementsByClassName(this.totaltime)[0];
		this.nowtimeObj       = parentobj.getElementsByClassName(this.nowtime)[0];
		this.mutevolumObj     = parentobj.getElementsByClassName(this.volum)[0];
		this.intwid(this,false);
		myvideo       = new DJLVideo(this.id);
		myvideo.controls(false);
		myvideo.volumset(volumval);

		
		this.DJLVolumScroll(this, volumf, volums, bg, volumval, function(val) {
			myvideo.volumset(parseFloat(val/100).toFixed(1));
		})
		//初始化时间总长
		myvideo.duration(function(total) {
			if(!(navigator.userAgent.match(/(iPhone|Android|iPad|Mobile)/i))) {
				_self.totaltimeObj.innerText = _self.timeformcat(total);
				_self.totaltimeObj.setAttribute("total", parseInt(total));
				
			}
		});
		
		//当前播时间
		myvideo.timeupdate(function(now) {
			_self.timeupdateNow = now;
			var totaltimeval = _self.totaltimeObj.getAttribute("total");
			_self.playinbtnObj.style.width = _self.timelineObj.clientWidth / parseInt(totaltimeval) * parseInt(now) + "px";
			_self.nowtimeObj.innerHTML =_self.timeformcat(now);
			if(!(navigator.userAgent.match(/(iPhone|Android|iPad|Mobile)/i))||(navigator.userAgent.match(/(chrome)/i))) {
				if(parseInt(totaltimeval) == parseInt(now)) {
					_self.playbtnObj.style.display = "block";
					_self.playObj.style.display = "block";
					_self.playbtnObj.setAttribute("loops", "2");
					_self.playinbtnObj.style.width = "100%";
					_self.pausebtnObj.style.display = "none";
					myvideo.playtoseconds(0);
					myvideo.pause();
					_self.timeupdateNow = 0;
				}
			}
		});
		
		//播放
		_self.playObj.onclick = function() {
			myvideo.play();
			_self.playObj.style.display = "none";
			_self.playbtnObj.style.display = "none";
			_self.pausebtnObj.style.display = "block";
		}
		//暂停
		_self.pausebtnObj.onclick = function() {
			myvideo.pause();
			_self.playObj.style.display = "block";
			_self.playbtnObj.style.display = "block";
			_self.pausebtnObj.style.display = "none";
		}
		//点击音量,静音
		_self.mutevolumObj.onclick = function() {
			var flag = this.getAttribute("mute");
			if(flag=="false"||flag==null){
				this.setAttribute("mute","true");
				this.setAttribute("style","background-position:-34px -166px;");
				myvideo.mute(true);
			}else{
				this.setAttribute("mute","false");
				this.removeAttribute("style");
				myvideo.mute(false);
			}
		}
		
		//点击跳转时间
		var timelineobjoffsetleft =  _self.getOffset(_self.timelineObj);
		_self.timelineObj.onclick = function(e) {
			var ev = window.event||e;
			var eval = ev.pageX||ev.clientX;
			var totaltimeval = _self.totaltimeObj.getAttribute("total");
			var fixleft = timelineobjoffsetleft.left+document.documentElement.scrollLeft;
			var clicktime = parseInt((eval - fixleft) / (_self.timelineObj.clientWidth / parseInt(totaltimeval)))
			myvideo.playtoseconds(clicktime + 1);
		}
		//
		var timelineflag = false;
		_self.timelineObj.onmousedown = function() {
			timelineflag = true;
			if(timelineflag){
				this.onmousemove = function(e) {
					var ev = window.event||e;
					var eval = ev.pageX||ev.clientX;
					if(timelineflag) {
						var totaltimeval = _self.totaltimeObj.getAttribute("total");
						var clicktime = parseInt((eval - timelineobjoffsetleft) / (_self.timelineObj.clientWidth / parseInt(totaltimeval)))
						myvideo.playtoseconds(clicktime);
					}
				}
			}
		}
		_self.timelineObj.onmouseup = function() {
			timelineflag = false;
			_self.timelineObj.onmousemove = null;
		}
		_self.timelineObj.onmouseout = function() {
			timelineflag = false;
			_self.timelineObj.onmousemove = null;
		}
		
		//全屏
		//判断当前状态是否全屏 f11
		var screenwid = screen.width,screenhei = screen.height;
		var documentelementobj = document.documentElement;
		var docwid = documentelementobj.clientWidth;
		var dochei = documentelementobj.clientHeight;
		if(screenwid == docwid && screenhei == dochei) {
			_self.fullscreenbtnObj.setAttribute("fs", "true");
			_self.fullscreenbtnObj.style.backgroundPosition = "8px -107px";
		} else {
			_self.fullscreenbtnObj.setAttribute("fs", "false");
			_self.fullscreenbtnObj.style.backgroundPosition = "8px -74px";
		}
		if(!(navigator.userAgent.match(/(iPhone|Android|iPad|Mobile)/i))||navigator.userAgent.match(/(chrome)/i)) {
			_self.fullscreenbtnObj.onclick = function() {
				var flag = this.getAttribute("fs");
				if(flag == "false") {
					if(parentobj.getAttribute("style")){
						parentobj.setAttribute("stylecopy",parentobj.getAttribute("style"));
					}
					var videoobj = this.parentNode.previousElementSibling;
					
					var fullwidhei = 'width:' + screenwid + 'px;height:' + (screenhei) + 'px;';
					
					_self.FullScreen(videoobj.parentNode);
				
					parentobj.setAttribute("style", 'position: absolute;left:0;top:0;' + fullwidhei)
					videoobj.setAttribute("style", fullwidhei);
					this.style.backgroundPosition = "8px -107px";
					this.setAttribute("fs", "true");
					_self.intwid(_self,true);
				
				} else {
					_self.CancelFullScreen();
					_self.intwid(_self,false);
					var stylecopy = parentobj.getAttribute("stylecopy");
					if(stylecopy){
						parentobj.setAttribute("style",stylecopy);
					}
				}
			}
		}
		
		//点击视频播放
		document.getElementById(_self.id).onclick = function() {
			if(_self.pausebtnObj.clientWidth == 0) {
				_self.playObj.click();
			} else {
				_self.pausebtnObj.click();
			}
		}
		_self.playbtnObj.onclick = function() {
			_self.playbtnObj.style.display = "none";
			_self.playObj.click();
		}
		document.addEventListener && (document.addEventListener('webkitfullscreenchange', function(){_self.escFullScreen(_self)}, false) ||
		document.addEventListener('mozfullscreenchange', function(){_self.escFullScreen(_self)}, false) ||
		document.addEventListener('fullscreenchange',  function(){_self.escFullScreen(_self)}, false) ||
		document.addEventListener('webkitfullscreenchange', function(){_self.escFullScreen(_self)}, false));
		document.attachEvent && document.attachEvent('msfullscreenchange',function(){_self.escFullScreen(_self)});
		
		document.addEventListener("keyup",function(e){
			if(e.keyCode=="116"&&parentobj.clientWidth<screenwid){
				_self.fullscreenbtnObj.setAttribute("fs", "false");
				_self.fullscreenbtnObj.style.backgroundPosition = "8px -74px";
			}
		},false)

		
	}
}
