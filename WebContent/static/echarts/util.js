if (!Array.prototype.indexOf){  
    Array.prototype.indexOf = function(elt /*, from*/){  
    var len = this.length >>> 0;  
    var from = Number(arguments[1]) || 0;  
    from = (from < 0)  
         ? Math.ceil(from)  
         : Math.floor(from);  
    if (from < 0)  
      from += len;  
    for (; from < len; from++)  
    {  
      if (from in this &&  
          this[from] === elt)  
        return from;  
    }  
    return -1;  
  };  
}

try{
$.ajaxSetup({cache:false});
}catch(e){;}
//判读变量是否为空
function isEmpty(value) {
	if(value==undefined || value==null || value=="" ){
		return true;
	} else {
		return false;
	}
}

//tip上数据格式的转换(6+1 mtbf)
function  dateFormatterMtbf(data){
	var minute =data[0][2]; 
	minute=new Number(minute);
    var dateinfo = '0天0时0分';
    if (typeof(minute) != "undefined") {
        minute = parseInt(minute);
        var MIN_PER_HOUR = 60;   //1min * 60 = 60min
        var MIN_PER_DAY = 1440;  //60min * 24 = 1440min
        var day = parseInt(minute / MIN_PER_DAY);
        var hour = parseInt((minute - day * 24 * MIN_PER_HOUR) / MIN_PER_HOUR);
        var min = minute - day * 24 * MIN_PER_HOUR - hour * MIN_PER_HOUR;
        dateinfo = day + '天' + hour + '时' + min + '分';
    }
    
    return '指标名称:健康运行时长<br/>'+data[0][1]+':'+dateinfo;
}
	
//坐标轴的值转换为天(6+1 mtbf)
function  dateFormatterDayMtbf(value){
    var MIN_PER_DAY = 1440;  //60min * 24 = 1440min
    var day = parseFloat(value/ MIN_PER_DAY).toFixed(0);
    return day;
}

//获取点击图例中的KPIID
function  getKpiidFromLegen(option, param){
	var kpiid = "";
	for ( var i = 0,len = option.legend.data.length; i < len; i++) {
		if(param.target == option.legend.data[i].name) {
			kpiid = option.legend.data[i].kpiid;
			break;
		}
	}
	return kpiid;
}

//点击雷达图从Indicator中获取KPIID和Dimension1值
function  getKpiidAndDimension1FromIndicator(option,paramName){
	var resultArray ={"kpiid":"","dimension1":""};
	var dimension1 = "";
	var kpiid =option.legend.data[0].kpiid;
	for(var i=0,len=option.polar[0].indicator.length;i<len;i++){
		if(paramName == option.polar[0].indicator[i].text){
			dimension1 = option.polar[0].indicator[i].dimension1;
		}
	}
	resultArray.kpiid = kpiid;
	resultArray.dimension1 = dimension1;
	return resultArray;
}
//获取点击图例中的KPIID和Dimension1
function  getKpiidAndDimension1(option,paramName){
	var resultArray ={"kpiid":"","dimension1":""};
	var dimension1 = "";
	var kpiid = "";
	for(var i=0,len=option.legend.data.length;i<len;i++){
		if(paramName == option.legend.data[i].name){
			kpiid = option.legend.data[i].kpiid;
		}
	}
	
	var series = option.series[0].data;
	for(var z=0;z<series.length;z++){
		if(paramName == series[z].name){
			dimension1 = series[z].dimension1;
		}
	}
	resultArray.kpiid = kpiid;
	resultArray.dimension1 = dimension1;
	return resultArray;
}


//tip上数据格式的转换(6+1去除统计数据)
function  dateFormatterGet(data){
	var returninfo='时间:'+data[0][1]+'<br/>';
	if(data.length>0){
		for(var i=0;i<data.length;i++){
			var obj=data[i];
			var temp = null;
			var arr = new Array();
			arr = obj[0].split(' ');
			if(arr.length == 3){
				temp = obj[2] + obj[0].split(' ')[2];
			}else{
				temp = obj[2];
			}
			
			returninfo +=obj[0].split(' ')[0]+':'+temp+'<br/>';
		}
	}
    return returninfo;
}
//tip上数据格式的转换(6+1去除统计数据)
function  dateFormatterGetinfo(data){
	var returninfo='时间:'+data[1]+'<br/>'+data[0].split(' ')[0]+':'+data[2]+'<br/>';
    return returninfo;
}
//获取json数组中的元素
function  dateFormatterGetinfo_1(data){
	//var param =$.toJSON(data);
	//var returninfo='时间:'+param[1]+'<br/>'+param[0].split(' ')[0]+':'+param[2]+'<br/>';
    var returninfo='时间:'+data[0][1]+'<br/>'+data[0][0].split(' ')[0]+':'+data[0][2]+'<br/>';
    return returninfo;
}

//tip上数据格式的转换(6+1去除统计数据)
function  dateFormatterGetRadar(data){
	var returninfo='';
	if(data.length>0){
		for(var i=0;i<data.length;i++){
			var obj=data[i];
			var temp = null;
			var arr = new Array();
			arr = obj[1].split(' ');
			if(arr.length == 3){
				temp = obj[2] + obj[1].split(' ')[2];
			}else{
				temp = obj[2];
			}
			returninfo+='指标名称:'+obj[1].split(' ')[0]+'<br/>'+obj[3]+':'+temp+'<br/>';
		}
	}
    return returninfo;
}

//健康运行时长分钟转
function  gettimeinfo(data){
	var minute =data; 
	minute=new Number(minute);
    var dateinfo = '0天0时0分';
    if (typeof(minute) != "undefined") {
        minute = parseInt(minute);
        var MIN_PER_HOUR = 60;   //1min * 60 = 60min
        var MIN_PER_DAY = 1440;  //60min * 24 = 1440min
        var day = parseInt(minute / MIN_PER_DAY);
        var hour = parseInt((minute - day * 24 * MIN_PER_HOUR) / MIN_PER_HOUR);
        var min = minute - day * 24 * MIN_PER_HOUR - hour * MIN_PER_HOUR;
        dateinfo = day + '天' + hour + '时' + min + '分';
    }
    return dateinfo;
}

//运行时长秒转X天X时X分(传入的数据以秒为单位)
function  getSecondInfo(data){
	var second = data;
	second=new Number(second);
    var dateinfo = '0天0时0分';
    if (typeof(second) != "undefined") {
    	second = parseInt(second);
    	var MIN_PER_MINUTE = 60;    //1second * 60 = 60second
        var MIN_PER_HOUR = 3600;   //1minute * 60 = 60minute
        var MIN_PER_DAY = 86400;  //60min * 24 = 1440min
        var day = parseInt(second / MIN_PER_DAY);
        var hour = parseInt((second - day * 24 * MIN_PER_HOUR) / MIN_PER_HOUR);
        var min = parseInt((second - day * 24 * MIN_PER_HOUR -hour * MIN_PER_HOUR)/MIN_PER_MINUTE);
        var sec = data - (day * 86400 + hour * 3600 + min * 60);
        /*--var min = min.toFixed(2);*/
        dateinfo = day + '天' + hour + '时' + min + '分' + sec + '秒';
    }
    return dateinfo;
}
/**
 * 王锋
 * Memory(内存)总量格式化 格式为：###,###GB
 */
function memorySumFormat(str){
	var newStr = "";
	var count = 0;
	 
	if(str.indexOf(".")==-1){
	   for(var i=str.length-1;i>=0;i--){
	 if(count % 3 == 0 && count != 0){
	   newStr = str.charAt(i) + "," + newStr;
	 }else{
	   newStr = str.charAt(i) + newStr;
	 }
	 count++;
	   }
	   str = newStr + ".00"; //自动补小数点后两位
	}
	else
	{
	   for(var i = str.indexOf(".")-1;i>=0;i--){
	 if(count % 3 == 0 && count != 0){
	   newStr = str.charAt(i) + "," + newStr;
	 }else{
	   newStr = str.charAt(i) + newStr; //逐个字符相接起来
	 }
	 count++;
	   }
	   str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
	 }
	return str;
}


/**
 * 王锋
 * storage(存储)总量格式化 格式为：<1T时，建议显示###,###.#GB，>1T时，再显示###,###.#TB
 */
function storageSumFormat(str){
	
	if(parseInt(str)>1024){
		str=(parseInt(str)/1024).toString();
		
		var newStr = "";
		var count = 0;
		 
		if(str.indexOf(".")==-1){
		   for(var i=str.length-1;i>=0;i--){
		 if(count % 3 == 0 && count != 0){
		   newStr = str.charAt(i) + "," + newStr;
		 }else{
		   newStr = str.charAt(i) + newStr;
		 }
		 count++;
		   }
		   str = newStr + ".00"; //自动补小数点后两位
		}
		else
		{
		   for(var i = str.indexOf(".")-1;i>=0;i--){
		 if(count % 3 == 0 && count != 0){
		   newStr = str.charAt(i) + "," + newStr;
		 }else{
		   newStr = str.charAt(i) + newStr; //逐个字符相接起来
		 }
		 count++;
		   }
		   str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
		 }
		return str+"TB";
	}else{
		var newStr = "";
		var count = 0;
		 
		if(str.indexOf(".")==-1){
		   for(var i=str.length-1;i>=0;i--){
		 if(count % 3 == 0 && count != 0){
		   newStr = str.charAt(i) + "," + newStr;
		 }else{
		   newStr = str.charAt(i) + newStr;
		 }
		 count++;
		   }
		   str = newStr + ".00"; //自动补小数点后两位
		}
		else
		{
		   for(var i = str.indexOf(".")-1;i>=0;i--){
		 if(count % 3 == 0 && count != 0){
		   newStr = str.charAt(i) + "," + newStr;
		 }else{
		   newStr = str.charAt(i) + newStr; //逐个字符相接起来
		 }
		 count++;
		   }
		   str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
		 }
		return str+"GB";
	}
	
	
}

function formatTime1(longTime) {
	//转化为 日+小时+分+秒
	var time = parseFloat(longTime);
	if (time != null && time != ""){
		if (time < 60) {
			var s = time;
			time = s + '秒';
		} else if (time > 60 && time < 3600) {
			var m = parseInt(time / 60);
			var s = parseInt(time % 60);
			time = m + "分钟" + s + "秒";
		} else if (time >= 3600 && time < 86400) {
			var h = parseInt(time / 3600);
			var m = parseInt(time % 3600 / 60);
			var s = parseInt(time % 3600 % 60 % 60);
			time = h + "小时" + m + "分钟" + s + "秒";
		} else if (time >= 86400) {
			var d = parseInt(time / 86400);
			var h = parseInt(time % 86400 / 3600);
			var m = parseInt(time % 86400 % 3600 / 60)
			var s = parseInt(time % 86400 % 3600 % 60 % 60);
			time = d + '天' + h + "小时" + m + "分钟" + s + "秒";
		}
	}	
	return time;	
}

//获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
	return currentdate;
}

//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) 
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//根据指标频率返回日期配置
function DateCfgUtil(freq){
	this.date = new Date();
	this.freq = freq; // 指标频率
	this.config = {
		readOnly:true,
		isShowToday:false,
		isShowClear:false
	};
	
	if(freq == "1DAY") {
		this.freqName = "日";
		this.buttonName = "月";
		this.dateFmt = "yyyy-MM-dd";
		this.startDateFmt = "yyyy-MM-01";
		this.endDateFmt = "yyyy-MM-dd";
		this.minDate = '#F{$dp.$D(\'line_start_time\')||\'%y-%M-01\'}';
		this.maxDate = '#F{$dp.$D(\'line_end_time\')||\'%y-%M-%d\'}';
		this.compDateFmt = "yyyy-MM";
		this.compMinDate = '%y-#{%M-6}';
		this.compMaxDate = '%y-#{%M-1}';
	} else {
		this.buttonName = "日";
		if(freq == "1HOUR") {
			this.freqName = "小时";
			this.hmsMenuCfg = {H: [1, 6]};
			this.dateFmt = "yyyy-MM-dd HH";
			this.startDateFmt = 'yyyy-MM-dd 00';
			this.endDateFmt = 'yyyy-MM-dd HH';
			this.minDate = '#F{$dp.$D(\'line_start_time\')||\'%y-%M-%d 00\'}';
			this.maxDate = '#F{$dp.$D(\'line_end_time\')||\'%y-%M-%d %H\'}';
		} else {
			if(freq == "15MIN") {
				this.freqName = "15分钟";
				this.hmsMenuCfg = {H: [1, 6], m: [15, 6]};
			} else if(freq == "5MIN") {
				this.freqName = "5分钟";
				this.hmsMenuCfg = {H: [1, 6], m: [5, 6]};
			} 
			this.dateFmt = "yyyy-MM-dd HH:mm";
			this.startDateFmt = 'yyyy-MM-dd 00:00';
			this.endDateFmt = 'yyyy-MM-dd HH:mm';
			this.minDate = '#F{$dp.$D(\'line_start_time\')||\'%y-%M-%d 00:00\'}';
			this.maxDate = '#F{$dp.$D(\'line_end_time\')||\'%y-%M-%d %H:%m\'}';
		}
		
		this.compDateFmt = "yyyy-MM-dd";
		this.compMinDate = '%y-%M-#{%d-30}';
		this.compMaxDate = '%y-%M-#{%d-1}';
	}
	this.startDate = this.date.Format(this.startDateFmt);
	this.endDate = this.date.Format(this.endDateFmt);
	/**
	 * 获取开始日期
	 * date 开始日期
	 * n 日期间隔
	 */
	this.getStartDate = function(date, n) {
		debugger;
		if(date.length == 13) {
			date += ":00:00";
		}
		if(date.length == 16) {
			date += ":00";
		}

		var t = new Date(Date.parse(date.replace(/-/g,"/")));
		if(freq == "1DAY") {
			t.setMonth(t.getMonth() + n);
		} else {
			t.setDate(t.getDate() + n);
		}
		return t.Format(this.startDateFmt);
	};
	/**
	 * 获取结束日期
	 * date 结束日期
	 * n 日期间隔
	 */
	this.getEndDate = function(date, n) {
		debugger;
		if(date.length == 13) {
			date += ":00:00";
		}
		if(date.length == 16) {
			date += ":00";
		}

		var t = new Date(Date.parse(date.replace(/-/g,"/")));
		if(freq == "1DAY") {
			t.setMonth(t.getMonth() + n + 1);
			t.setDate(1);
			t.setDate(t.getDate() - 1);
		} else {
			t.setDate(t.getDate() + n);
		}
		return t.Format(this.endDateFmt);
	};
	
	this.getStartDateCfg = function() {
		this.config.dateFmt = this.dateFmt;
		//this.config.minDate = this.startDate;
		//this.config.maxDate = '#F{$dp.$D(\'line_end_time\')||\'%y-%M-%d \'}';
		this.config.hmsMenuCfg = this.hmsMenuCfg;
		return this.config;
	};
	
	this.getEndDateCfg = function() {
		this.config.dateFmt = this.dateFmt;
		//this.config.minDate = '#F{$dp.$D(\'line_start_time\')||\'%y-%M-01\'}';
		//this.config.maxDate = this.endDate;
		this.config.hmsMenuCfg = this.hmsMenuCfg;
		return this.config;
	};
	
	this.getCompDateCfg = function() {
		this.config.dateFmt = this.compDateFmt;
		//this.config.minDate = this.compMinDate;
		//this.config.maxDate = this.compMaxDate;
		return this.config;
	};
	
	function allPrpos ( obj ) { 
		// 用来保存所有的属性名称和值 
		var props = "" ; 
		// 开始遍历 
		for ( var p in obj ){ // 方法 
			if ( typeof ( obj [ p ]) == " function " ){ 
				obj [ p ]() ; 
			} else { // p 为属性名称，obj[p]为对应属性的值 
				props += p + " = " + obj [ p ] + " /t " ; 
			} 
		} // 最后显示所有的属性 
		alert ( props ) ;
	};
	
}

/*
 * Author：樊超
 * 告警中的人员及设备选择控件
 * 人员选择：
 * 使用方法：如<input onclick="Picker.peoples('fieldId', callbackFn)"/>
 * 参数说明：fieldId：当用户选中并点击“确定”按钮后，将会使用页面上ID为该参数指定的input域接收返回的json数据。如：<input type="hidden" id="peoples"/>
 *  	  callbackName:若需要在用户点击“确定”按钮后调用一个js函数，则可将函数名写入该函数
 * 其他调用方法：1.不使用回调函数：<input onclick="Picker.peoples('fieldId')"/>
 *           2.不使用接收域：<input onclick="Picker.peoples(callbackFn)"/>
 * 使用方法：在用户选择后，控件首先会将用户的选择项封装成json字符串，并将其填充到fieldId指定的input域中。之后会调用callbackFn指定的函数，将json对象作为参数传入。
 * 设备选择：（目前只支持阀值规则新增中的设备选择）
 * 使用方法：<input type="button" value="选择设备" onclick="Picker.devices('model','params','fieldId', callback)"/>
 * 参数说明：第一个参数为模式，若设置为'0'，第二参数留空''，则进入所有设备选择。页面中会有类型选择框。
 *                    '1':阀值规则设备选择模式。
 * 					  '2':根据告警类型的选择设备的模式
 *       params：附带的参数，当模式为'1'时，该参数如'01,0101'，逗号前为大分类，逗号后为子分类。若省略子分类，则页面中会有子分类选择框。
 *       fieldId和callback参照人员选择的参数说明。
 * 其他调用方式：参照人员选择的调用方式。
 */
var Picker = {
	url : "../../login/alarm/alarm_pick_peoples",
	deviceUrl : "../../login/alarm/alarm_pick_devices",
	peoples : function(params, fieldId, callbackFn) {
		var _this = this;
		var trueUrl = _this.url + "?params=" + params ;
		if(fieldId && callbackFn) {
			trueUrl += "&fieldId=" + fieldId + "&callbackName=" + (callbackFn.toString().replace(/function\s?/mi,"").split("("))[0];
		} else if(fieldId && !callbackFn) {
			if(_this.isFunction(fieldId)) {
				trueUrl += "&fieldId=&callbackName=" + (fieldId.toString().replace(/function\s?/mi,"").split("("))[0];
			} else {
				trueUrl += "&fieldId=" + fieldId;
			}
		} else {
			alert("Picker参数错误！");
			return false;
		}
		
		layer.open({
		    type: 2, //iframe 弹出
		    title: "通知对象选择",
		    shade: 0.3,  //遮罩浓度
		    fix: false,  //最大化按钮
		    area: ["80%", "80%"], //宽高比例
		    skin: "layui-layer-rim", //边框Q
		    content: [trueUrl, "no"]
		}); 
	},
	devices : function(model, params, fieldId, callbackFn) {
		
		var _this = this;
		var trueUrl = _this.deviceUrl + "?model=" + model + "&params=" + params;
		if(fieldId && callbackFn) {
			trueUrl += "&fieldId=" + fieldId + "&callbackName=" + (callbackFn.toString().replace(/function\s?/mi,"").split("("))[0];
		} else if(fieldId && !callbackFn) {
			if(_this.isFunction(fieldId)) {
				trueUrl += "&fieldId=&callbackName=" + (fieldId.toString().replace(/function\s?/mi,"").split("("))[0];
			} else {
				trueUrl += "&fieldId=" + fieldId;
			}
		} else {
			alert("Picker参数错误！");
			return false;
		}
		
		layer.open({
		    type: 2, //iframe 弹出
		    title: "设备选择",
		    shade: 0.3,  //遮罩浓度
		    fix: false,  //最大化按钮
		    area: ["80%", "90%"], //宽高比例
		    skin: "layui-layer-rim", //边框Q
		    content: [trueUrl, "no"]
		});
	},
	isFunction : function(fn) {
		
		return (!!fn&&!fn.nodename&&fn.constructor!=String&&fn.constructor!=RegExp&&fn.constructor!=Array&&/function/i.test(fn+""));
	}
};

/*
 * 运行中的告警信息公共组件
 * 使用方法：opts为json对象传入{"ctx":"${ctxBase}","resourceId":"xxx", "boxId":"xx"}，其中的boxId为父容器div的id
 */
var AlertInfo = {
	opts : {},
	load : function (opts) {
		opts = $.extend(this.opts, opts);
		var $box = $("#" + opts.boxId);
		if($box.height() == '0'){
			$box.html("<iframe frameborder='0' id='_alertInfo' height='185' width='"+$box.width()+"' src='"+opts.ctx+"/login/run/common/alert_info?resourceId="+opts.resourceId+"'></iframe>");
		}else{
			$box.html("<iframe frameborder='0' id='_alertInfo' height='"+$box.height()+"' width='"+$box.width()+"' src='"+opts.ctx+"/login/run/common/alert_info?resourceId="+opts.resourceId+"'></iframe>");
		}
	}
};

/*
 * 根据分钟返回保留两位小数的小时
 */
function getHourFromMinute(data){
	
	var minute =data; 
	minute=new Number(minute);
    var hour = (data / 60).toFixed(2);
    return hour;
}

/*
 * 根据毫秒返回保留两位小数的秒数
 */
function getSecondFromMs(data) {
	
	var ms =data; 
	ms=new Number(ms);
    var second = (data / 1000).toFixed(2);
    
    return second;
}

/*
 * 根据byte转换其他单位
 */
function formatBytes(bytes) {
	
	if(isNaN(bytes)) {
		return "--";
	}
	
	if (bytes === 0) return '0 B';  
	  
    var k = 1024;  
    var sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
    var i = Math.floor(Math.log(bytes) / Math.log(k));  

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];            
}

/*
 * @Author fanchao
 * @date 2016-03-23
 * 将时间进行转换，原则是取整数位的单位，如500ms则显示为500毫秒,1000ms则显示为1秒。
 * 参数说明：
 * 		time:整数类型的时间
 * 		unit：时间单位。可取的值：ms,s,m,h,d,y。该取值也决定了最终生成的字符串的最小单位
 */
function formatTime(time, unit) {
	
	function _formatTime(unit, recursive, timeStr) {
		var unitArray = ["ms", "s", "m", "h", "d", "y"];
		var unitArrayCn = ["毫秒", "秒", "分", "小时", "天", "年", "年"];
		var factorArray = [1, 1000, 60, 60, 24, 365, 10000];
		var unitPosition = 0;
		if("ms" == unit) {
			unitPosition = 0;
		} else if("s" == unit) {
			unitPosition = 1;
		} else if("m" == unit) {
			unitPosition = 2;
		} else if("h" == unit) {
			unitPosition = 3;
		} else if("d" == unit) {
			unitPosition = 4;
		} else if("y" == unit) {
			unitPosition = 5;
		}
		
		if(!recursive) {
			if(!time || isNaN(time)) {
				return "--";
			}
			time=new Number(time);
		}

		var timeStrTmp = "";
		if(timeStr) {
			timeStrTmp = timeStr;
		}

		if(time >= factorArray[unitPosition+1]) {

			var mod = time % factorArray[unitPosition+1];
			time = time / factorArray[unitPosition+1];
			time = parseInt(time);

			if(mod > 0) {
				timeStrTmp = mod + unitArrayCn[unitPosition] + timeStrTmp;
			} else {
				timeStrTmp = "0" + unitArrayCn[unitPosition] + timeStrTmp;
			}

			return _formatTime(unitArray[unitPosition+1], true, timeStrTmp);
		} else {
			return time + unitArrayCn[unitPosition] + timeStrTmp;
		}
	}

	return _formatTime();
}


	//转换性能指标的频率 frequency
	
	function frequency(data){
		var data = data;
		if(data=="1DAY"){
			return "日";
		}else if(data=="5MIN"){
			return "5分钟";
		}else if(data=="15MIN"){
			return "15分钟";
		}else if(data=="30MIN"){
			return "30分钟";
		}else if(data=="1H"){
			return "小时";
		}else{
			return "月";
		}
	}
	
	//取得KPI指标Id对应的周期信息
	function getTipFrequencyByKpiId(url,kpiIds){
		var result = "";
		$.ajax({
			type: "GET",
			url : url + "/login/common/getTipFrequencyByKpiId?kpiIds=" + kpiIds,
			async : false, //异步执行
			data : "",
			dataType : "json", //返回数据形式为json
			success : function(data) {
				if (data != null){
					//data.forEach(function(e){  
					//	result= result + "\n" + e;
					//})
					for (var i=0,len=data.length; i<len; i++){
						result= result + "\n" + data[i];
					}
				}
			},
			error : function() {
				console.log("从dictdba.STATKPI表中获取指标id：" + kpiId + "的数据异常！");
			}
		});
		
		return result != "" ? result.substring(1) : result;
	}
	
	//取得KPI指标Id对应的周期信息
	function getAlertTip(url){
		var result = "";
		$.ajax({
			type: "GET",
			url : url + "/login/alarm/getAlertTip",
			async : false, //异步执行
			data : "",
			dataType : "json", //返回数据形式为json
			success : function(data) {
				result = "\n" + data;
			},
			error : function() {
				console.log("从dictdba.STATKPI表中获取指标id：" + kpiId + "的数据异常！");
			}
		});
		
		return result;
	}
	
	//页面元素行专列
	function gettitlename(name){
		var namen="<ul style='list-style:none;padding:0;margin:0;vertical-align:middle;' align='center' title='"+name+"'>";
		if(name!=''){
			if(name.length>6){
				name=name.substring(0,6)+"...";
				for (var i=0,len=name.length; i<len; i++){
					namen+="<li style='padding:0;margin:0'>"+name[i]+"</li>";
				}
			}else{
				for (var i=0,len=name.length; i<len; i++){
					namen+="<li style='padding:0;margin:0'>"+name[i]+"</li>";
				}
			}
		}else{
			namen=name;
		}
		return namen+"</ul>";
	}
	
	//界面元素展现处理
	function axisLabeldateSub(value){
	    var valuelength =value.length;
	    if(valuelength>3){
	    	value=value.substring(0,3)+"...";
	    }else{
	    	value=value;
	    }
	    return value;
	}