/**
 * 拓扑图逻辑通用类
 * @author CsWang
 * @date 2015-12-03
 */
var topoId;//存储拓扑ID
var topoType;//存储拓扑类型
var topoView;//拓扑显示JSP页面
var appsystemId;//业务系统ID
var lnodeResId;//左节点业务系统ID
var rnodeResId;//右节点业务系统ID
var model; //跳转模式

var ctxBase;//根路径
var toolbar;//工具栏
var elementBox = new twaver.ElementBox();//节点DataBox
var network = new twaver.vector.Network(elementBox);//拓扑图画布
var canvasNetwork = new  twaver.canvas.Network(elementBox);//这个network用于得到GroupUI
var selectionModel = elementBox.getSelectionModel();//选中状态
var autoLayouter = new twaver.layout.AutoLayouter(elementBox);//自动布局
var popupMenu = new twaver.controls.PopupMenu(network);//右键菜单
var isRegisterImage = false;//图片是否已注册
var EnableAlarm = true;//是否启用告警
var lastLocateDev;//定位设备
var _filterNodeIds = new Array(); // 存储被过滤的nodeId，取消过滤时使用
var editModel; // 编辑模式标记

network.setLimitElementInPositiveLocation(true);//设置network当中网元的坐标不能为负值
elementBox.setClient('linkcurve',true);
twaver.Defaults.TOOLTIP_DISMISS_DELAY = 60000;


$(document).keydown(
	function(e) {
		var topoIdFrom = topoId;
		if (e.ctrlKey && e.which == 67) {
			copyTopoData();
		} else if (e.ctrlKey && e.which == 86) {
			if (editModel){
				$.ajax({
					type: "GET",
					url : ctxBase+"/index/network/topo/existCopyTopoData",
					async : true, //同步执行
					data : "",
					dataType : "json", //返回数据形式为json
					success : function(data) {
						if(!data) {
							showTipMessage("请选中网元按下CTRL+C复制后，再按下CTRL+V进行粘贴！", 300, 20);
						} else { 
							pasteData();
						}
					},
					error : function() {
						showTipMessage("获取网元组数据异常！",150,20);
					}
				});
			}
		}
	});

/**
 * 粘贴拷贝的所有对象
 */
function copyTopoData(){
	if (editModel){
		var copyItems = new twaver.List();
		if (copyItems.size != 0) {
			copyItems = new twaver.List();
		}
		if(elementBox.getSelectionModel().getSelection().size() == 0) {
			showTipMessage("请选中网元后，再按下CTRL+C进行复制！", 300, 20);
		} else {
			//取得选择对象
			elementBox.getSelectionModel().getSelection().forEach(
					function(element) {
						if (element instanceof twaver.Group
								|| element instanceof twaver.Node
								|| element instanceof twaver.Link) {
							//图例时取得图例节点
							if (element instanceof twaver.Group && element.getClient('groupType') == 1) {
								var stdNodes = element.getChildren();
								var stdLink = null;
								//循环追加图例节点信息
								stdNodes.forEach(function(e) {
										copyItems.add(e);
										var stdLinks = e.getLinks();
										//追加图例链路信息
										stdLinks.forEach(function(el) {
											stdLink = el;
									});
								});
								copyItems.add(stdLink);
							}
							copyItems.add(element);
						}
					});
			//取得选择的节点组id、节点id以及链路id一览
			var groupIds = "";
			var nodeIds = "";
			var linkIds = "";
			copyItems.forEach(function(element) {
				if (element instanceof twaver.Group) {
					groupIds += ',' + element.getClient('groupId');
				} else if (element instanceof twaver.Node) {
					if (element.getClient('type') == "Node") {
						nodeIds += ',' + element.getClient('nodeId');
					}
				} else if (element instanceof twaver.Link) {
					linkIds += ',' + element.getClient('linkId');
				}
			});
			if (groupIds != "") {
				groupIds = groupIds.substring(1);
			}
			if (nodeIds != "") {
				nodeIds = nodeIds.substring(1);
			}
			if (linkIds != "") {
				linkIds = linkIds.substring(1);
			}

			//保存选择的拓扑数据
			$.ajax({
				type: "POST",
				url : ctxBase+"/index/network/topo/copyTopoData",
				data : {"topoIdFrom" : topoId, "groupIds" : groupIds, "nodeIds" : nodeIds, "linkIds" : linkIds},
				dataType : "json", //返回数据形式为json
				success : function(data) {
				    //数据接口成功返回
					 if(data == "success"){
						 refreshTopoData();
						 showTipMessage("已成功复制选中的网元，请按下CTRL+V进行粘贴！", 300, 20);
					}else{
						showTipMessage("复制失败,请刷新页面。重新复制！",300, 20);
					}
				},
				error : function() {
					showTipMessage("复制失败,请刷新页面。重新复制！",300, 20);
				}
			});
		}
	}
}

/**
 * 粘贴拷贝的所有对象
 */
function pasteData(){
	$.ajax({
		type: "POST",
		url : ctxBase+"/index/network/topo/pasteTopoData",
		data : {"topoId" : topoId},
		dataType : "json", //返回数据形式为json
		success : function(data) {
		    //数据接口成功返回
			 if(data == "success"){
				 refreshTopoData();
				 showTipMessage("粘贴成功！",150,20);
			}else{
				showTipMessage("粘贴失败,请刷新页面。重新选择网元后粘贴！",300, 20);
			}
		},
		error : function() {
			showTipMessage("粘贴失败,请刷新页面。重新选择网元后粘贴！",300, 20);
		}
	});
}

//初始化network用来设置是否为弧线
network.setLinkPathFunction(function (linkUI, defaultPoints) {
	var iscurve = elementBox.getClient('linkcurve');
	if(!iscurve) return defaultPoints;
	
	if(linkUI.getElement().getClient('linkDiv') == 3){ //group与group之间的链路
		
		var from = linkUI.getElement().getClient('link.node.from');
		var to   = linkUI.getElement().getClient('link.node.to');
		
		var link = elementBox.getDataById(linkUI.getElement().getClient('linkId'));
		
		var fcenter = from.getCenterLocation();
		var tcenter = to.getCenterLocation();
		
		var guif= new twaver.vector.GroupUI(canvasNetwork,from);
		var guit = new twaver.vector.GroupUI(canvasNetwork,to);
		
		var gWidthf = guif.getBodyRect().width/2;
		var gHeightf = guif.getBodyRect().height/2;
		
		var gWidtht = guit.getBodyRect().width/2;
		var gHeightt = guit.getBodyRect().height/2;
		
		var leftFx = fcenter.x - gWidthf;
		var rightFx = fcenter.x + gWidthf;
		var topFy = fcenter.y - gHeightf;
		var bottomFy =  fcenter.y + gHeightf;
		
		var leftTx = tcenter.x - gWidtht;
		var rightTx = tcenter.x + gWidtht;
		var topTy = tcenter.y - gHeightt;
		var bottomTy = tcenter.y + gHeightt;
		
		if((topFy > bottomTy) &&  ((leftTx < rightFx) && (leftFx < rightTx)) ){ //结束节点在起始节点的上方
			link.s("link.from.position","top");
			link.s("link.to.position","bottom");
		}else if((bottomFy < topTy) && ((leftTx < rightFx) && (leftFx < rightTx))){
			link.s("link.from.position","bottom");
			link.s("link.to.position","top");
		}else if(rightFx < leftTx){
			link.s("link.from.position","right");
			link.s("link.to.position","left");
		}else if(rightTx < leftFx){
			link.s("link.from.position","left");
			link.s("link.to.position","right");
		}else{
			link.s("link.from.position","center");
			link.s("link.to.position","center");
		}
	}else if(linkUI.getElement().getClient('linkDiv') == 2){
		
		var f = linkUI.getFromPoint();
		var t = linkUI.getToPoint();
		
		var nodeFrom = linkUI.getElement().getClient('link.node.from');
		var nodeTo   = linkUI.getElement().getClient('link.node.to');
		var link = elementBox.getDataById(linkUI.getElement().getClient('linkId'));
		
		if(nodeFrom instanceof twaver.Group){
			//var group3 = box.getDataById("group3");
			var center = nodeFrom.getCenterLocation();
			var gui = new twaver.vector.GroupUI(canvasNetwork,nodeFrom);
			
			var gLeftX = center.x - gui.getBodyRect().width/2;
			var gRightX = center.x + gui.getBodyRect().width/2;
			var gTopY = center.y - gui.getBodyRect().height/2;
			var gBottomY = center.y + gui.getBodyRect().height/2;
			if(t.x < gLeftX){
				link.s("link.from.position","left");
			}else if(t.x > gRightX){
				link.s("link.from.position","right");
			}else if((t.y > gBottomY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.from.position","bottom");
			}else if((t.y  < gTopY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.from.position","top");
			}else{
				link.s("link.from.position","center");
			}
			
		}else{
			//var group3 = box.getDataById("group3");
			var center = nodeTo.getCenterLocation();
			var gui = new twaver.vector.GroupUI(canvasNetwork,nodeTo);
			
			var gLeftX = center.x - gui.getBodyRect().width/2;
			var gRightX = center.x + gui.getBodyRect().width/2;
			var gTopY = center.y - gui.getBodyRect().height/2;
			var gBottomY = center.y + gui.getBodyRect().height/2;
			
			if(f.x < gLeftX){
				link.s("link.to.position","left");
			}else if(f.x > gRightX){
				link.s("link.to.position","right");
			}else if((f.y > gBottomY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.to.position","bottom");
			}else if((f.y  < gTopY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.to.position","top");
			}else{
				link.s("link.to.position","center");
			}
		}
	}
	
	//折线设定
	var poxRange = linkUI.getElement().getClient('link.poxRange');
	var link = elementBox.getDataById(linkUI.getElement().getClient('linkId'));
	if(linkUI.getElement().getClient('link.type') === 'Polyline'){
		var f = linkUI.getFromPoint();
		var t = linkUI.getToPoint();
		
		//斜率
		var k = (t.y - f.y)/(t.x - f.x);
		var k_1 = -1/k;
		var b = Math.sqrt(poxRange*poxRange/(1+k_1*k_1));
		var a = k_1*b;
		
		var points = new twaver.List();
		points.add(f);
		points.add(t);

		var p11 = {
			x: f.x,
			y: f.y 
		}
		var p12;
		
		if(f.y == t.y){
			p12 = {
					x: 	(f.x + t.x)/2,
					y: (f.y + t.y)/2 + poxRange
				} 
		}else{
			p12 = {
					x: 	(f.x + t.x)/2  + -b,
					y: (f.y + t.y)/2 + -a
				} 
		}

		var cps = new twaver.List();
		cps.add(f);
		cps.add(p12); 

		var p21 = {
			x: t.x,
			y: t.y
		}
		 var p22 = {
			x: t.x,
			y: t.y
		} 
		var cps2 = new twaver.List();
		cps2.add(p21);
		cps2.add(p22);
		cps2.add(t);

		points.removeAt(1);
		points.add(cps);
		points.add(cps2);

		return points;
	//弧线的高度
	}else if(linkUI.getElement().getClient('link.type') === 'leftright'){
		
		var f = linkUI.getFromPoint();
		var t = linkUI.getToPoint();
		var link = elementBox.getDataById(linkUI.getElement().getClient('linkId'));
		var linkDirection =  linkUI.getElement().getClient('linkDirection');
		var points = new twaver.List();
		points.add(f);
		points.add(t);

		var lineLength = _twaver.math.getDistance(f, t);
		var p2;
		
		//斜率
		var k = (t.y - f.y)/(t.x - f.x);
		var k_1 = -1/k;
		var b = Math.sqrt(poxRange*poxRange/(1+k_1*k_1));
		var a = k_1*b;
		if(linkDirection == 0){
			p2 = {
					x: 	(f.x + t.x)/2  - b,
					y: (f.y + t.y)/2 - a	
				}
		}else if(linkDirection == 1){
			p2 = {
					x: 	(f.x + t.x)/2  + b,
					y: (f.y + t.y)/2 + a	
				}
		} else {
			p2 = {
					x: 	(f.x + t.x)/2  + b,
					y: (f.y + t.y)/2 + a	
				}
		}

		link.s("label.yoffset", (p2.y - (f.y + t.y)/2)/2);
		var cps = new twaver.List();
		cps.add(p2);
		cps.add(t);

		points.removeAt(1);
		points.add(cps);

		return points;
	}else {
		return defaultPoints;
	}
});


//配置图片灰度化
twaver.Defaults.PIXEL_FILTER_FUNCTION = function(sourceColor, filterColor) {
	if (!filterColor) {
		return sourceColor;
	}
	filterColor = {
		r : 255,
		g : 255,
		b : 255
	};
	var brightness = sourceColor.r * 0.30 + sourceColor.g * 0.59 + sourceColor.b * 0.11;
	// 灰度化
	return {
		r : Math.floor(filterColor.r * brightness / 255),
		g : Math.floor(filterColor.g * brightness / 255),
		b : Math.floor(filterColor.b * brightness / 255),
	}
	// 二值化
	/*
	if (brightness > 100) {
		brightness = 255;
	} else {
		brightness = 0;
	}
	return {
		r : Math.floor(brightness),
		g : Math.floor(brightness),
		b : Math.floor(brightness),
	}
	*/
}
// Array增加contains方法
Array.prototype.contains = function(item){
    for(i=0;i<this.length;i++){
        if(this[i]==item){return true;}
    }
    return false;
};
Array.prototype.removeAt = function(index) {
	this.splice(index, 1);
}
Array.prototype.remove = function(obj) {
	var index = this.indexOf(obj);
	if (index >= 0) {
		this.removeAt(index);
	}
} 


network.addInteractionListener(function (e){
	//当shapeLink的from和to节点为group时设定link起点和终点位置
	if(e.kind == 'liveMoveEnd'){
		var lastData = network.getSelectionModel().getLastData();
		if(lastData instanceof twaver.Group){
			var linkList = lastData.getFromLinks();
			linkList.forEach(function(e){
				if(e.getClient("linkType") == 2 || e.getClient("linkType") == 1){
					
					setLinkPosition(e);
				}
			});
		}else if(lastData instanceof twaver.Node){
			
			var linkList = lastData.getFromLinks();
			if(linkList != undefined && linkList.size() > 0){
				linkList.forEach(function(e){
					if(e.getClient("linkType") == 2 || e.getClient("linkType") == 1){
						
						setLinkPosition(e);
					}
				});
			}
		}
	}
	
});

/**
 * 设置在浏览模式下不能拖动节点
 */
network.setMovableFunction(function (element) {
	if(!editModel){
		return false;
	}else{
	    return true;	
	}
});

/**
 * 节点编辑状态控制
 */
network.setEditInteractions();
network.setEditableFunction(function (element) { 
	if(!editModel){
		return false;
	}else{
		if (element instanceof twaver.Node && 
				(element.getClient("nodeType") == 3 || element.getClient("nodeType") == 4 || element.getClient("nodeType") == undefined)){
			return false;	
		} else {
			return true;
		}
	}
});


/**
 * 初始化数据
 */
function initBase(ctxbase){
	ctxBase = ctxbase;
	//取得拓扑配置信息
	getTopoConfig();

	var main = document.getElementById('main');
	main.appendChild(network.getView());
	
	//创建工具栏 第二个为type  加到有base  待研究
	toolbar = createNetworkToolbar(network,"network");
	var centerPane = new twaver.controls.BorderPane(network, toolbar);
    centerPane.setTopHeight(26);
    demo.Util.appendChild(centerPane.getView(), main, 0, 0, 0, 0);
	//鹰眼
    var smallview = document.getElementById('smallview');
    var overview = new twaver.vector.Overview(this.network);
    demo.Util.initOverviewPopupMenu(overview);
    overview.adjustBounds({x:0, y:0, width:160, height:120});
    var smallPane = new twaver.controls.BorderPane(overview);
    demo.Util.appendChild(smallPane.getView(), smallview, 0, 2, 2, 0);
    
    window.onresize = function (e) {
        smallPane.invalidate();
        centerPane.invalidate();
    };
    //右键事件共通
    initPopupMenuUtil();
    //注册图片集合
	registerImage();
    //初始化拓扑数据
    initTopoData();
    //初始化标题编辑
    initTitleEditEvent();
    //全局设置网元
    twaver.Styles.setStyle("select.color","rgba(200,0,0,0.7)");
    twaver.Styles.setStyle("select.style","border");
	layer.config({
	    extend: 'extend/layer.ext.js'
	});
}

/**
 * 显示网络拓扑设备详情
 */
function showNodeDetail(url){
	var url = ctxBase+url;
	var title = "设备详情";
	var $newTab = $("<a href='" + url + "' target='mainFrame' class='newTabFlag'>" + title + "</a>");
	if (typeof(parent.addTab) == "undefined"){
		parent.parent.addTab($newTab, true);
	}else{
		parent.addTab($newTab, true);
	}
	
}

//链路尺寸自定义
function definedLinkSize(){
	layer.open({
		type : 2, //iframe 弹出
		title : '链路尺寸自定义',
		shade : 0.3, //遮罩浓度
		fix : false, //最大化按钮
		area : [ "50%", "45%" ], //宽高比例
		skin : 'layui-layer-rim', //边框Q
		content : [ '${ctxBase}/index/network/topo/networkJump?moduleName=defined_link&flag=1', 'yes' ]
	});
}
//链路下标自定义
function definedLinkSubscript(){
	layer.open({
		type : 2, //iframe 弹出
		title : '链路下标自定义',
		shade : 0.3, //遮罩浓度
		fix : false, //最大化按钮
		area : [ "50%", "45%" ], //宽高比例
		skin : 'layui-layer-rim', //边框Q
		content : [ '${ctxBase}/index/network/topo/networkJump?moduleName=defined_link&flag=2', 'yes' ]
	});
}
//链路tip信息自定义
function definedLinkTip(){
	layer.open({
		type : 2, //iframe 弹出
		title : '链路tip信息自定义',
		shade : 0.3, //遮罩浓度
		fix : false, //最大化按钮
		area : [ "50%", "45%" ], //宽高比例
		skin : 'layui-layer-rim', //边框Q
		content : [ '${ctxBase}/index/network/topo/networkJump?moduleName=defined_link&flag=3', 'yes' ]
	});
}

/**
 * 刷新拓扑数据
 */
function refreshTopoData(){
	saveAllNodePostion(1);
}

/**
 * 定时刷新拓扑
 */
function refreshTopo(){
	elementBox.clear();
	initTopoData();
}

/**
 * 数据的初始化加载
 */
function initTopoData(){
	// 初始化标题
	initTopoTitle();
	//初始化NODE_GROUP
	initTopoNodeGroup();
	//初始化节点
	initTopoNode();
}

/**
 * 取得拓扑配置信息
 */
function getTopoConfig(){
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getTopoConfig",
		async : false, //同步执行
		data : {"topoId":topoId, "topoType":topoType, "model":model},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if (data !=null && data != "") {
				topoId = data.defaultId;
				topoView = data.topoView;
			} else {
				showTipMessage("获取拓扑配置信息异常！",150,20);
			}
		},
		error : function() {
			showTipMessage("获取拓扑配置信息异常！",150,20);
		}
	});
}

/**
 * 初始化网元组group
 */
function initTopoNodeGroup(){
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getsTopoNodeGroupByTopoId",
		async : true, //同步执行
		data : {"topoId" : topoId},
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data.length > 0){
				for(var i =0;i<data.length;i++){
					createNodeGroup(data[i]);
				}
			}
		},
		error : function() {
			showTipMessage("获取网元组数据异常！",150,20);
		}
	});
}

/**
 * 注册图片集合
 */
function registerImage(){
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getDeviceImage",
		data : {"topoType":topoType},
		async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			//图片集合数据接口成功返回
			$.each(data, function(i, n){
				demo.Util.registerImageByWh(ctxBase + "/"+n.imagePath, n.imageWidth, n.imageHeight, network);
			});
		},
		error : function() {
			showTipMessage("注册图片集合异常！",150,20);
		}
	});
}

/**
 * 初始化标题
 * ma_he add
 */
function initTopoTitle(){
	//使用本地JSON数据
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getTopoInfo?topoId="+topoId,
		async : true, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			//节点数据接口成功返回标题信息
			var topoInfo = eval(data);
			var titleId = "Title_" + topoInfo["topoId"];
			if(elementBox.getDataById(titleId) == null){
				var titleNode = createTitleNode(topoInfo,"network");
	    		elementBox.add(titleNode);
			}
			// 初始化背景颜色
			elementBox.setStyle('background.type', 'vector');
			elementBox.setStyle("background.vector.fill",true);
			elementBox.setStyle("background.vector.fill.color",'#' + (topoInfo['topoBgcolor'] == null || topoInfo['topoBgcolor']=='' ? "FFFFFF" : topoInfo['topoBgcolor']));

			//$("#leftTimeInfo").html("最后更新时间："+topoInfo['updateTime']);

		},
		error : function() {
			showTipMessage("初始化标题异常！",150,20);
		}
	});
}

/**
 * 初始化节点
 * ma_he add
 */
function initTopoNode(){
	//使用本地JSON数据
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getTopoNodeList?topoId=" + topoId + "&topoType=" + topoType,
		async : true, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			//节点数据接口成功返回
			var result = eval(data);
			var length = result.length;
			var j = 0; //图例个数
			var stdId = "";
			var k = 0; //图例节点数
			//图元
			for(var i = 0;i < length; i++) {
				var device = result[i];
				var alarmImageName = "";
				var alarmImageNameOfSys = "";
				if(device == null) continue;
				
				//如果stdId不是0的就是图例节点
				if(device["stdId"] == 0 || device["stdId"] == null){
					if(device.nodeType == 1){
						var kpiInfo = getNodeStatus(device);
						device.perfSection = kpiInfo;
					}
/*					//取得设备告警信息
					if (device["resourceId"] != null || device["nodeType"] == 2){
						alarmImageName = getAlarmImageName(device);
					}
					//取得系统告警信息
					if (device["nodeType"] == 5){
						alarmImageNameOfSys = getAlarmImageNameOfSys(device["resourceId"]);
					}*/
					
					var node = createNode(device, alarmImageName, alarmImageNameOfSys);
				}else{
					if (device["stdId"] != stdId) {
						j++;
						stdId = device["stdId"];
						k = 1;
					} else {
						k++;
					}
					var node = createNodeLegend(device, j, k);
				}
				
				if(node == null) continue;
	    		elementBox.add(node);
			}
			//初始化链路
			initTopoLink();
		},
		error : function() {
			showTipMessage("获取节点数据异常！",150,20);
		}
	});
}

/**
 * 得到节点的状态
 * @param node
 */
function getNodeStatus(node){
	var kpiInfo;
	var divType = node.className;
	if (divType == 'DatabaseSoftware' || divType == 'MiddlewareSoftware') {
		divType = node.divType;
	}
	$.ajax({
		type: "GET",
		url : ctxBase + "/index/network/topo/getNodeStatusByClassName?className=" + divType + "&resourceId=" + node.resourceId,
		async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data){
				kpiInfo = data;
			}
		},
		error : function() {
			showTipMessage("获取节点状态异常！",150,20);
		}
	});
	return kpiInfo;
}

/**
 * 取得告警图标
 * @param device
 */
function getAlarmImageName(device){
	var alarmImageName = "";
	var url = ctxBase + "/index/network/topo/getAlarmMaxLevelId?resourceId=" + device["resourceId"];
	if (device["nodeType"] == 2) {
		url = ctxBase + "/index/network/topo/getAlarmMaxLevelId?nodeId=" + device["nodeId"];
	}
	$.ajax({
		type: "GET",
		url : url,
		async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
				if (data == '99') {
					alarmImageName = 'other';
				} else if (data == '04') {
					alarmImageName = 'urgent';
				} else if (data == '03') {
					alarmImageName = 'great';
				} else if (data == '02') {
					alarmImageName = 'ordinary';
				} else if (data == '01') {
					alarmImageName = 'suggestive';
				}
			},
			error : function() {
				showTipMessage("取得告警级别数据异常！",150,20);
			}
		});
	return alarmImageName;
}

/**
 * 取得系统告警图标
 * @param device
 */
function getAlarmImageNameOfSys(sysId){
	var alarmImageName = "";
	var url = ctxBase+"/index/network/topo/getAlarmMaxLevelId?sysId="+ sysId;
	$.ajax({
		type: "GET",
		url : url,
		async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
				if (data == '99') {
					alarmImageName = 'other';
				} else if (data == '04') {
					alarmImageName = 'urgent';
				} else if (data == '03') {
					alarmImageName = 'great';
				} else if (data == '02') {
					alarmImageName = 'ordinary';
				} else if (data == '01') {
					alarmImageName = 'suggestive';
				}
			},
			error : function() {
				showTipMessage("取得系统告警级别数据异常！",150,20);
			}
		});
	return alarmImageName;
}
/**
 * 初始化链路
 * ma_he  add
 */
function initTopoLink(){
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getTopoLinkList?topoId="+ topoId + "&topoType=" + topoType,
		async : true, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			//链路数据接口成功返回
			var result = eval(data);
			var length = result.length;
			for(var i = 0;i<length;i++){
				//链路区分:0设备链路 ,1：图例链路 
				if(result[i].linkDiv == 1){
					var link = createLinkLegend(result[i]);
				}else{
					var link = createLink(result[i]);
				}
				
				if(link == null) continue;
				elementBox.add(link);
			}

			//自适应显示
			network.zoomOverview();
			showScaling();
		},
		error : function() {
			showTipMessage("获取链路数据异常！",150,20);
		}
	});
}

/**
 * 初始化网元组
 * ma_he add
 */
function initTopoGroup(){
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/getGroupNameList?topoId="+topoId,
		async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			//网元组数据接口成功返回
			var result = eval(data);
			var length = result.length;
			for(var i = 0;i<length;i++) {
				var item = result[i];
				var groupName = item["GroupName"];
				var group = createGroupByName(groupName);
			    
				var IdList = item["list"];
				for(var j = 0;j<IdList.length;j++) {
					var element = elementBox.getDataById("Node_"+IdList[j]);
					if(element == null) continue;
					if (element instanceof twaver.Node) {
			            group.addChild(element);
			        }
				}
				elementBox.add(group);
			}
			locateDevByUrlUtil();
		},
		error : function() {
			showTipMessage("获取网元组数据异常！",150,20);
		}
	});
}

/**
 * 调整链路幅度
 */
function addPox(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var item = elementBox.getSelectionModel().getFirstData();
		if(item instanceof twaver.Link){
			layer.prompt({
				  value: item.getClient("poxRange"),
				  title: '请输入调整幅度的值'
				}, function(value, index, elem){
				  layer.close(index);
					$.ajax({
						type: "POST",
						url : ctxBase+"/index/network/topo/addTopoLinkPoxRange?linkId="+item.getClient("linkId") + "&poxRange=" + value,
						dataType : "json", //返回数据形式为json
						success : function(data) {
						    //数据接口成功返回
							if(data == "success"){
								refreshTopoData();
								showTipMessage("调整幅度成功！",150,20);
							}else{
								showTipMessage("调整幅度失败,请刷新页面重试！",150,20);
							}
						},
						error : function() {
							alert("error");
						}
					});
			});
		}
	}
}

/**
 * 设置接口阀值
 */
function setInterfaceLevel(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var item = elementBox.getSelectionModel().getFirstData();
		var url = ctxBase + "/index/network/topo/networkJump?topoType=" + topoType + "&topoId=" + topoId + "&topoView=" + topoView;
		if(item instanceof twaver.Link){
			url = url + "&moduleName=define_interface&linkId=" + item.getClient("linkId") + "&interfaceFailMax=" + item.getClient("interfaceFailMax") + "&interfaceFailMin=" + item.getClient("interfaceFailMin");
			//获取拓扑新增设备
			layer.open({
				type : 2, // iframe 弹出
				title : "设置接口调用失败率阀值",
				shade : 0.3, // 遮罩浓度
				fix : false, // 最大化按钮
				scrollbar: false, //不显示滚动条
				area : [ "50%", "45%" ], // 宽高比例
				skin : 'layui-layer-rim', // 边框Q
				content : [ url, "no" ],
				
			});
		}
	}
}

/**
 * 外观设置
 */
function defineStyle(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var url = ctxBase + "/index/network/topo/networkJump?topoType=" + topoType + "&topoId=" + topoId + "&topoView=" + topoView + "&appsystemId=" + appsystemId;
		var item = elementBox.getSelectionModel().getFirstData();
		var title= "外观设置";
		//节点
		if (item instanceof twaver.Group) {
			//网元组
			url = url + "&moduleName=define_link&groupId="
			+ item.getClient("groupId") + "&model=" + 3;
		} else if (item instanceof twaver.Node) {
			if (item.getClient("type") == "Title") {
				//取得拓扑标题的字体和颜色
				var nodeId = item.getClient("topoId");
				var nodeType = "Title";
				var nodeName = item.getName();
				var fontSize = item.getClient("fontSize");
				if (fontSize == undefined) {
					fontSize = "30";
				}
				var fontColor = item.getClient("fontColor");
				if (fontColor == undefined) {
					fontColor = "#000000";
				}
				url = url + "&moduleName=define_node&nodeId=" + topoId + "&nodeType=" + nodeType + "&nodeName=" + nodeName + "&fontSize=" + fontSize + "&fontColor=" + fontColor;
			} else {
				//取得图元的字体和颜色
				var nodeId = item.getClient("nodeId");
				var nodeType = item.getClient("nodeType");
				var nodeName = item.getName();
				var fontSize = item.getClient("fontSize");
				var fontColor = item.getClient("fontColor");
				var graphName = item.getImage();
				var divType = item.getClient("divType");
				if (divType == undefined) {
					divType = item.getClient("className");
				}
				url = url + "&moduleName=define_node&nodeId=" + nodeId + "&nodeType=" + nodeType + "&fontSize=" + fontSize + "&fontColor=" + fontColor + "&graphName=" + graphName + "&nodeName=" + nodeName + "&divType=" + divType;
			} 
		} else if (item instanceof twaver.Link) {
			if (item.getClient("linkDiv") == 1) {
				//图例
				url = url + "&moduleName=define_link&linkId="
				+ item.getClient("linkId") + "&model=" + 1;
			} else {
				//链路
				url = url + "&moduleName=define_link&linkId="
				+ item.getClient("linkId") + "&model=" + 2;
			}
		}
		//获取拓扑新增设备
		layer.open({
			type : 2, // iframe 弹出
			title : title,
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar: false, //不显示滚动条
			area : [ "50%", "55%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ url, "yes" ],
			
		});
	}else{
		showTipMessage("请选择1台设备！",150,20);
	}
}

/**
 * kpi指标
 */
function kpiQuota(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var item = elementBox.getSelectionModel().getFirstData();
		var nodeId = item.getClient("nodeId");
		var divType = item.getClient("divType");
		if (divType == undefined) {
			divType = item.getClient("className");
		}
		var url = ctxBase + "/index/network/topo/networkJump?topoType=" + topoType + "&topoId=" + topoId + "&moduleName=define_kpiQuota&nodeId=" +nodeId + "&divType=" +divType;
		//获取拓扑新增设备
		layer.open({
			type : 2, // iframe 弹出
			title : "KPI指标选择",
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar: false, //不显示滚动条
			area : [ "50%", "45%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ url, "yes" ],
			
		});
	}
}



/**
 * 远程测试
 */
function remoteTest(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var url = ctxBase + "/index/network/topo/networkJump?moduleName=remote_test";
		var item = elementBox.getSelectionModel().getFirstData();
		if (item instanceof twaver.Node) {
			var ipAddress = item.getClient("ipAddress");
			if(ipAddress == 'null'){
				showTipMessage("获取设备节点IP失败,请刷新页面重试！",150,20);
				return false;
			}
			url += "&ipAddress="+ipAddress;
		}else{
			showTipMessage("非设备节点不支持远程测试！",150,20);
			return false;
		}
		layer.open({
			type : 2, // iframe 弹出
			title : false,
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			area : [ "50%", "45%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ url, "yes" ]
		});
	}else{
		showTipMessage("请选择1台设备！",150,20);
	}
}

/**
 * 删除设备
 */
function deleteNodeById() {
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var node = elementBox.getSelectionModel().getFirstData();
		layer.confirm('确认删除？', {
			  title:'确认',
			  time: 0, //不自动关闭
			  btn: ['确认', '取消'],
			  yes: function(index){
			    layer.close(index);
				$.ajax({
				type: "POST",
				url : ctxBase+"/index/network/topo/deleteNodeById",
				data : {"nodeId":node.getClient("nodeId")},
				//async : false, //同步执行
				dataType : "json", //返回数据形式为json
				success : function(data) {
				    //数据接口成功返回
					 if(data == "success"){
						 showTipMessage("设备删除成功！",150,20);
						 elementBox.removeById(node.getId());
						 refreshTopoData();
					}else{
						showTipMessage("设备删除失败,请刷新页面重试！",150,20);
					}
				},
				error : function() {
							showTipMessage("设备删除异常！",150,20);
						}
				});
			  }
		});
	}
}

/**
 * 删除图例
 */
function deleteTopoStd() {
	//图例时取得图例节点
	var element = elementBox.getSelectionModel().getFirstData();
	if (element instanceof twaver.Group && element.getClient('groupType') == 1) {
		var items = new twaver.List();
		var link = null;
		var stdId = null;
		var stdNodes = element.getChildren();
		items.add(element);
		//循环追加图例节点信息
		if (stdNodes != undefined) {
			stdNodes.forEach(function(e) {
				items.add(e);
				var stdLinks = e.getLinks();
				//追加图例链路信息
				if (stdLinks!= undefined) {
					stdLinks.forEach(function(el) {
						link = el;
					});
				}
			});
		}
		if (link != null) {
			items.add(link);
			stdId = link.getClient('stdId');
		}

		//取得节点Id一览
		var groupIds = "";
		var linkIds = ""
			items.forEach(function(element) {
				if (element instanceof twaver.Group) {
					groupIds += ',' + element.getClient('groupId');
				} else if (element instanceof twaver.Link) {
					linkIds += ',' + element.getClient('linkId');
				}
			});
			if (groupIds != "") {
				groupIds = groupIds.substring(1);
			}
			if (linkIds != "") {
				linkIds = linkIds.substring(1);
			}
		//确认删除后发起删除请求
		layer.confirm('确认删除？', {
			  title:'确认',
			  time: 0, // 不自动关闭
			  btn: ['确认', '取消'],
			  yes: function(index){
				layer.close(index);
				$.ajax({
					type: "POST",
					url : ctxBase+"/index/network/topo/deleteTopoStd",
					data : {"topoId" : topoId, "stdId" : stdId, "stdGroupId" : groupIds, "stdLinkId" : linkIds},
					// async : false, //同步执行
					dataType : "json", // 返回数据形式为json
					success : function(data) {
					    // 数据接口成功返回
						 if(data == "success"){
							 showTipMessage("图例删除成功！",150,20);
							 refreshTopoData();
						}else{
							showTipMessage("图例删除失败,请刷新页面重试！",150,20);
						}
					},
					error : function() {
						showTipMessage("图例删除异常！",150,20);
					}
				});
			  }
		});
	}
}

/**
 * 删除链路
 */
function deleteLinkById() {
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var link = elementBox.getSelectionModel().getFirstData();
		if (link instanceof twaver.Link) {
			layer.confirm('确认删除？', {
				  title:'确认',
				  time: 0, //不自动关闭
				  btn: ['确认', '取消'],
				  yes: function(index){
					layer.close(index);
					$.ajax({
						type: "POST",
						url : ctxBase+"/index/network/topo/deleteLinkById",
						data : {"linkId":link.getClient("linkId")},
						//async : false, //同步执行
						dataType : "json", //返回数据形式为json
						success : function(data) {
						    //数据接口成功返回
							 if(data == "success"){
								 showTipMessage("链路删除成功！",150,20);
								 elementBox.removeById(link.getId());
								 refreshTopoData();
							}else{
								showTipMessage("链路删除失败,请刷新页面重试！",150,20);
							}
						},
						error : function() {
							showTipMessage("链路删除异常！",150,20);
						}
					});
				  }
			});
		}	
	}
}

/**
 * 标题双击可编辑
 */
function initTitleEditEvent(){
//    if(editModel){
//		function enterIn(evt){
//			var evt=evt?evt:(window.event?window.event:null);
//			if (evt.keyCode==13){
//				if(currentElement){
//					var value = titleInput.value;
//					if(value == null || value == ""){
//						showTipMessage("请输入拓扑标题！",150,20);
//					}else{
//						saveTopoInfo(value,"");
//					}
//					titleInput.style.display='none';
//				}
//			}
//		}
//		titleInput.onkeydown = enterIn;
//    }

	network.addInteractionListener(function (e){
//		//曲线拖拽点拖动后判断
//		if(e.kind == 'liveMovePointEnd') {
//			var lastData = network.getSelectionModel().getLastData();
//			var linkUI = new twaver.canvas.LinkUI(canvasNetwork,lastData);
//			if (lastData != null) {
//				if ((lastData.getClient("linkType") == 1 && lastData.getClient("extendType") == 5) || lastData.getClient("linkType") == 2) {
//					var points = lastData._points._as;
//					var i =0;
//					points.forEach(function (e) {
//						var fromNode = lastData.getFromNode();
//						if (lastData.getClient("linkType") == 1 && lastData.getClient("extendType") == 5) {
//							if (i== 1) {
//							lastData.setStyle("label.xoffset",parseInt(e.x - fromNode.getX()));
//							lastData.setStyle("label.yoffset",parseInt(e.y - fromNode.getY()-20));
//							}
//						} else if (lastData.getClient("linkType") == 2) {
//							lastData.setStyle("label.xoffset",parseInt(e.x - fromNode.getX()));
//							lastData.setStyle("label.yoffset",parseInt(e.y - fromNode.getY()-20));
//						}
//						if (parseInt(e.x) < 0 || parseInt(e.y) <0) {
//							alert("移动范围超出，请重新移动。",150,20);
//							return;
//						}
//						i++;
//					});
//				}
//			}
//		});
		//双击事件
		if(e.kind == 'doubleClickElement'){
			var lastData = network.getSelectionModel().getLastData();
			var servicedomainResid = lastData.getClient("servicedomainResid");
			var nodeId = lastData.getClient("nodeId");
			var nodeType = lastData.getClient("nodeType");
			var linkDiv = lastData.getClient("linkDiv");
			var resourceId = lastData.getClient("resourceId");
			var lnodeResId = lastData.getClient("lnodeResId");
			var rnodeResId = lastData.getClient("rnodeResId");
			//SOA拓扑中链路(域)双击事件（浏览模式和编辑模式下都可以跳转）
			if (servicedomainResid != undefined  && linkDiv == 4 && lastData instanceof twaver.Link) {
				var url = ctxBase + "/index/network/topo/topoJump?topoType="
						+ servicedomainResid + "&model=SOA&lnodeResId="+ lnodeResId + "&rnodeResId=" + rnodeResId;
				var title = lastData.getName();
				var $newTab = $("<a href='" + url
						+ "' target='mainFrame' class='newTabFlag'>" + title
						+ "</a>");
				parent.addTab($newTab, true);
			} 
	
			if (lastData instanceof twaver.Node && nodeType == 5) {
				//节点为系统时双击跳转
				var url = ctxBase + "/index/network/topo/topoJump?topoType=" + resourceId;
				var title = lastData.getName();
				var $newTab = $("<a href='" + url
						+ "' target='mainFrame' class='newTabFlag'>" + title
						+ "</a>");
				parent.addTab($newTab, true);
			}else if (lastData instanceof twaver.Node && lastData.getClient("graphName") == "Clound" && nodeType == 2) {
				//应用拓扑中的虚拟中间件双击跳转至中间件拓扑页面
				var url = ctxBase + "/index/network/topo/topoJump?topoType="
						+ nodeId + "&model=MID&appsystemId=" + topoType;
				var title = lastData.getName();
				var $newTab = $("<a href='" + url
						+ "' target='mainFrame' class='newTabFlag'>" + title
						+ "</a>");
				if (typeof(parent.addTab) == "undefined"){
					parent.parent.addTab($newTab, true);
				}else{
					parent.addTab($newTab, true);
				}
				parent.addTab($newTab, true);
			} else if (lastData instanceof twaver.Node && lastData.getClient("type") == "Title"&& lastData.getClient("appsystemId") != "" && topoView == "app_topo") {
				var topoType = lastData.getId();
				var title = lastData.getName();
				jumpToAppLogicTopo(topoType, title);
				
//				var cx = network.getViewRect().x;
//				var cy = network.getViewRect().y;
//				currentElement = e.element;
//				if(currentElement.getClient('type') != "Title") 
//					return;
//				
//				var cl = currentElement.getCenterLocation();
//				var zoom = network.getZoom();
//				var style = titleInput.style;
//				style.padding = '0';
//				style.margin = '0';
//				style.position = 'absolute';
//				titleInput.value = currentElement.getName();
//				var titleWidth = titleInput.value.length*42+10;
//				var titleHeight = 42;
//				style.left = (cl.x * zoom + (-cx)) - (titleWidth-currentElement.getWidth())/2*zoom + 'px';
//				style.top = (cl.y * zoom + (-cy)) + (titleHeight*1/4)*zoom+ 'px';
//				titleWidth = titleWidth*zoom;
//				titleHeight = titleHeight *zoom;
//				var fontSize = (30*zoom);
//				if(titleWidth < 120){
//					titleWidth = 120;
//				}
//				style.width = titleWidth + 'px';
//				if(titleHeight < 15){
//					titleHeight = 15;
//				}
//				style.height = titleHeight + 'px';
//				if(fontSize < 10){
//					fontSize = 10;
//				}
//				style.fontSize = fontSize +'px';
//				style.display='';
//			    style.zIndex = 100;
//			    var main = document.getElementById('main');
//			    main.appendChild(titleInput);
			}
		}else{
			titleInput.style.display='none';
		}
	});
}

/**
 * 添加显示告警
 * @param alarmID 告警Id
 * @param elementID 网元ID
 * @param alarmSeverity 告警级别
 */
function jumpToAppLogicTopo(topoType, title) {
	$.ajax({
		type: "GET",
		url : ctxBase+"/index/network/topo/addAppLogicTopo?topoType="+topoType+"&title="+title,
		async : true, //同步执行
		data : "",
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data == "success") {
				//跳转至应用系统逻辑拓扑页面
				var url = ctxBase + "/index/network/topo/topoJump?topoType=" + topoType;
				var $newTab = $("<a href='" + url 
						+ "' target='mainFrame' class='newTabFlag'>" + title + "逻辑拓扑"
						+ "</a>");
				parent.addTab($newTab, true);
			} else { 
				showTipMessage("获取应用系统逻辑拓扑ID异常！", 250, 20);
			}
		},
		error : function() {
			showTipMessage("获取应用系统逻辑拓扑信息异常！",150,20);
		}
	});
}

/**
 * 添加显示告警
 * @param alarmID 告警Id
 * @param elementID 网元ID
 * @param alarmSeverity 告警级别
 */
function addAlarm(alarm,alarmID, elementID, alarmSeverity) {
	var alarm = new twaver.Alarm(alarmID, elementID, alarmSeverity);
	alarm.setClient("alarmData",alarm);
	alarm.setToolTip(alarm["ALARM_CAUSE"]);
	elementBox.getAlarmBox().add(alarm);
}


/**
 * 拓扑定位
 * ma_he
 */
function locateDevByUrlUtil(){
	var locResId = getUrlParam("locateDev");
	if(locResId == null || locResId == "") 
		return;
	var node = null;
	elementBox.getDatas().forEach(function(element){
		if (element instanceof twaver.Node){
			if(element.getClient("resourceId") == locResId){
				node = element;
			}
		}
	});
	if(node == null){
		return;
	}
		
	selectionModel.clearSelection();
	var selectNode = new twaver.List();
    selectNode.add(node);
	selectionModel.appendSelection(selectNode);
	lastLocateDev = node;
	//添加事件监听
	network.addViewListener(locateDevListener,node);
	
}
/**
 * 
 * @param e
 */
function locateDevListener(e){
 	if(e.kind == "validateEnd"){
 		network.removeViewListener(locateDevListener,lastLocateDev);
 		network.centerByLogicalPoint(lastLocateDev.getX(),lastLocateDev.getY(),true);
		lastLocateDev = null;
 	}
}

/**
 * 设备绑定
 * 
 */
function deviceBound(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var item = elementBox.getSelectionModel().getFirstData();
		var content = ctxBase + "/index/network/topo/networkJump?moduleName=topo_devices&topoId=" + topoId + "&topoType=" + topoType + "&topoView=" + topoView + "&model=" + 1 + "&nodeId=" + item.getClient("nodeId");
		//获取设备一览
		layer.open({
			type : 2, // iframe 弹出
			title : "设备绑定",
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar: false, //不显示滚动条
			area : [ "80%", "70%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ content, "yes" ],
			
		});
	}else{
		showTipMessage("请选择1台设备！",150,20);
	}
}

/**
 * 链路绑定
 * 
 */
function linkBound(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var item = elementBox.getSelectionModel().getFirstData();
		var linkId = item.getClient("linkId");
		var lnodeResId = item.getClient("lnodeResId");
		var rnodeResId = item.getClient("rnodeResId");
		var content = ctxBase + "/index/network/topo/networkJump?moduleName=bound_link&topoId=" + topoId + "&linkId=" + linkId + "&lnodeResId=" + lnodeResId + "&rnodeResId=" + rnodeResId;
		//获取设备一览
		layer.open({
			type : 2, // iframe 弹出
			title : "链路绑定",
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar: false, //不显示滚动条
			area : [ "50%", "50%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ content, "yes" ],
			
		});
	}else{
		showTipMessage("请选择1条链路！",150,20);
	}
}

/**
 * 撤销组合
 * 
 */
function cancelGroup(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var node = elementBox.getSelectionModel().getFirstData();
		//确认后提交请求
		layer.confirm('确认撤销？', {
			  title:'确认',
			  time: 0, //不自动关闭
			  btn: ['确认', '取消'],
			  yes: function(index){
			    layer.close(index);
				$.ajax({
				type: "POST",
				url : ctxBase+"/index/network/topo/deleteGroupIdOfNodeById",
				data : {"nodeId":node.getClient("nodeId")},
				//async : false, //同步执行
				dataType : "json", //返回数据形式为json
				success : function(data) {
				    //数据接口成功返回
					 if(data == "success"){
						 refreshTopoData();
						 showTipMessage("撤销组合成功！",150,20);
					}else{
						showTipMessage("撤销组合失败,请刷新页面重试！",150,20);
					}
				},
				error : function() {
							showTipMessage("撤销组合异常！",150,20);
						}
				});
			  }
		});
	}else{
		showTipMessage("请选择1台设备！",150,20);
	}
}
/**
 * 属性一览
 * 
 */
function deviceProperty(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var url = ctxBase + "/index/network/topo/networkJump?topoId=" + topoId;
		var item = elementBox.getSelectionModel().getFirstData();
		var title= "";
		if (item instanceof twaver.Group) {
			url = url + "&moduleName=device_property&divId=" + item.getClient("groupId") + "&proDiv=" + 1;
			title = "设备组属性一览";
		} else if (item instanceof twaver.Node) {
			url = url + "&moduleName=device_property&divId=" + item.getClient("nodeId") + "&proDiv=" + 0;
			title = "设备属性一览";
		}
		//获取拓扑新增设备
		layer.open({
			type : 2, // iframe 弹出
			title : title,
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar: false, //不显示滚动条
			area : [ "50%", "45%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ url, "yes" ],
			
		});
	}else{
		showTipMessage("请选择1台设备！",150,20);
	}
}

/**
 * 告警一览
 * 
 */
function deviceAlarm() {
	if (elementBox.getSelectionModel().getSelection().size() == 1) {
		var item = elementBox.getSelectionModel().getFirstData();
		var resourceId = item.getClient("resourceId");
		var nodeType = item.getClient("nodeType");
		var url = "";
		var alarmFlag = "0";
		if(nodeType == "5"){
			alarmFlag = "1"
		}
		url = ctxBase + "/index/network/topo/networkJump?&moduleName=alarm_info&resourceId=" + resourceId + "&alarmFlag=" + alarmFlag;
		var title = "告警一览";
		// 获取拓扑新增设备
		layer.open({
			type : 2, // iframe 弹出
			title : "告警一览",
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar : false, // 不显示滚动条
			area : [ "98%", "90%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ url, "yes" ],

		});
	} else {
		showTipMessage("请选择1台设备！", 150, 20);
	}
}
/**
 * 初始化右键
 * ma_he  add 20160314
 */
function initPopupMenuUtil() {
	var lastData, lastPoint, magnifyInteraction;
	popupMenu.setWidth(150);
	popupMenu.onMenuShowing = function (e) {
		lastData = network.getSelectionModel().getLastData();
		lastPoint = network.getLogicalPoint(e);
		return true;
	};
	
	//动作处理
	popupMenu.onAction = function (menuItem) {
		//网元组
		if (menuItem.label == '展开分组'|| menuItem.label == '合并分组') {
			lastData.reverseExpanded();
		}else if (menuItem.label == '取消分组') {
			cancelNetGroup();
		}else if (menuItem.label == '删除图例') {
			deleteTopoStd();
		}else if(menuItem.label == '刷新拓扑'){
			refreshTopoData();
		}else if(menuItem.label == '保存坐标'){
			saveAllNodePostion(0)
		}else if(menuItem.label == '自动布局'){
			autoLayouter.doLayout('symmetry');
		}else if(menuItem.label == '设备全选'){
			SelectAllNode();
		}else if(menuItem.label == '链路全选'){
			SelectAllLink();
		}else if(menuItem.label == '调整幅度'){
			addPox();
		}else if(menuItem.label == '接口阀值'){
			setInterfaceLevel();
		}else if(menuItem.label == '展开链路'|| menuItem.label == '合并链路'){
			lastData.reverseBundleExpanded();
		}else if(menuItem.label == '删除链路'){
			deleteLinkById();
		}else if(menuItem.label == '删除设备'){
			deleteNodeById();
		}else if(menuItem.label == '外观设置'){
			defineStyle();
		}else if(menuItem.label == '属性一览'){
			deviceProperty();
		}else if(menuItem.label == '告警一览'){
			deviceAlarm();
		}else if(menuItem.label == 'KPI设定'){
			kpiQuota();
		}else if(menuItem.label == '撤销组合'){
			cancelGroup();
		}else if(menuItem.label == '设备绑定'){
			deviceBound();
		}else if(menuItem.label == '链路绑定'){
			linkBound();
		}else if(menuItem.label == '远程测试'){
			remoteTest();
		}else if(menuItem.label == '运行详情'){
			if(menuItem.group == 'Node'){
				//设备类型
				var className = lastData.getClient("className");
				//资源ID
				var resourceId=lastData.getClient("resourceId");
				//子分类
				var divType=lastData.getClient("divType");
				$.ajax({
					type: "GET",
					url : ctxBase+"/index/network/topo/getDeviceInfoURL?topoType="+topoType+"&className="+className+"&resourceId="+resourceId,
					async : true, //同步执行
					data : "",
					dataType : "json", //返回数据形式为json
					success : function(data) {
						if(data != null && data !="") {
							showTipMessage(data, 250, 20);
						} else { 
							//数据库或中间件子分类转换
							if(divType != null && divType !='') {
								className = divType;
							}
							var runDetail = "/index/network/topo/deviceJump?topoType="+topoType+"&className="+className+"&resourceId="+resourceId;
							//将设备类型和资源ID当做参数来传递
							showNodeDetail(runDetail);
						}
					},
					error : function() {
						showTipMessage("获取设备运行详情跳转信息异常！",150,20);
					}
				});
			}
		}else if(menuItem.label == '显示鹰眼'){
			$("#smallview").show();
		}else if(menuItem.label == '隐藏鹰眼'){
			$("#smallview").hide();
		}else if(menuItem.label == '新增设备'){
			addDevice(event);
		}//else if(menuItem.label == '设备过滤'){
			//filterTopoNodes(event, true);
		//}else if(menuItem.label == '取消过滤'){
		//	filterTopoNodes(event, false);
		//}
	};
	
	//新增设备
	function addDevice(e){
		getTopoNewDevice(e.pageX,e.pageY);
	}
	
	//显示控制
	popupMenu.isVisible = function (menuItem) {
		if (magnifyInteraction) {
			return menuItem.group == 'Magnify';
		} else {
			if (lastData) {
				if (lastData instanceof twaver.Node && menuItem.group == 'Node' 
					&& !(lastData instanceof twaver.Group)) {
//					if(lastData.getClient("type") == "Title"){
//						return false;
//					}
					return true;
				}else if (lastData instanceof twaver.Link && menuItem.group == 'Link') {
					return true;
				}else if (lastData instanceof twaver.Group && menuItem.group == 'Group') {
					return true;
				}
				return menuItem.group == 'Element';
			} else {
				return menuItem.group == 'Topo';
			}
		}
	};
	//启用控制
	popupMenu.isEnabled = function (menuItem) {
		if (lastData) {
			if (lastData instanceof twaver.Group && menuItem.group == 'Group') {
				var expanded = lastData.isExpanded();
				if(lastData.getClient("groupType") == 1){
					if (menuItem.label == '展开分组' || menuItem.label == '合并分组'
						|| menuItem.label == '外观设置' || menuItem.label == '取消分组'
							|| menuItem.label == '属性一览') {
						return false;
					}
				} else {
					if (menuItem.label == '删除图例') {
						return false;
					}
				}
				if(menuItem.label == '取消分组'){
					return true;
				}
				return menuItem.expand ? !expanded : expanded;
			}
			if (lastData instanceof twaver.Link && menuItem.group == 'Link') {
				var expanded = lastData.getStyle("link.bundle.expanded");
				var linkType = lastData.getClient("linkType");
				var linkDiv = lastData.getClient("linkDiv");
				var interfaceId = lastData.getClient("interfaceId");
				//图例中的链路只能操作外观设置
				if (linkDiv == 1 && (menuItem.label == '删除链路' || menuItem.label == '展开链路')) {
					return false;
				}
				//网络拓扑可以执行链路绑定
				if(topoType != 'WAN' && topoType != 'LAN' && menuItem.label == '链路绑定'){ 
					return false; 
				}
				if((interfaceId == null && linkDiv != 4) && menuItem.label == '接口阀值'){ 
					return false; 
				}
				if(linkType != 3 && menuItem.label == '调整幅度'){ 
					return false; 
				}
				if (menuItem.label == '删除链路'
						|| menuItem.label == '外观设置') {
					return true;
				}
				return menuItem.expand ? !expanded : expanded;
			}
			if (lastData instanceof twaver.Node && menuItem.group == 'Node') {
				if (lastData.getClient("type") == "Title" && menuItem.label == '删除设备'){
					return false;
				}
				if (lastData.getParent() != null && menuItem.label == '撤销组合') {
					return true;
				}
				if (lastData.getClient('nodeType') == 1) {
					if (menuItem.label == '运行详情' || menuItem.label == '外观设置'
							|| menuItem.label == '删除设备' || menuItem.label == '属性一览'
							|| menuItem.label == '远程测试' || menuItem.label == '告警一览'
							|| menuItem.label == 'KPI设定' || menuItem.label == '设备绑定') {
						return true;
					} else {
						return false;
					}
				} else if (lastData.getClient('nodeType') == 5) {
					if (menuItem.label == '外观设置' || menuItem.label == '删除设备' || menuItem.label == '属性一览'
						|| menuItem.label == '告警一览') {
							return true;
					} else {
						return false;
					}
				} else if (lastData.getClient('nodeType') == 2 && (menuItem.label == '设备绑定' || menuItem.label == '属性一览')) {
					return true;
				} else if (menuItem.label == '运行详情' || menuItem.label == '远程测试' || menuItem.label == '属性一览'
						|| menuItem.label == '告警一览' || menuItem.label == '设备绑定' || menuItem.label == 'KPI设定' || menuItem.label == '撤销组合') {
						return false;
				}
			}
		}
		return true;
	};
	//菜单项设置
	if(editModel){
		popupMenu.setMenuItems([
			//{ label: 'Remove', group: 'Element' },
			{ label: '删除设备', group: 'Node', expand: true},
			{ label: '外观设置', group: 'Node', expand: true},
			{ label: '远程测试', group: 'Node' },
			{ label: '运行详情', group: 'Node' },
			{ label: '属性一览', group: 'Node' },
			{ label: '告警一览', group: 'Node' },
			{ label: '设备绑定', group: 'Node' },
			{ label: 'KPI设定', group: 'Node' },
			{ label: '撤销组合', group: 'Node' },
			
			// { label: '查看运行详情', group: 'Link' },
			{ label: '删除链路', group: 'Link', expand: true},
			{ label: '外观设置', group: 'Link', expand: true},
			{ label: '展开链路', group: 'Link', expand: true},
			{ label: '合并链路', group: 'Link' },
			{ label: '调整幅度', group: 'Link' },
			{ label: '接口阀值', group: 'Link' },
			{ label: '链路绑定', group: 'Link' },
			
			{ separator: true, group: 'Group' },
			{ label: '展开分组', group: 'Group', expand: true },
			{ label: '合并分组', group: 'Group' },
			{ label: '外观设置', group: 'Group' },
			{ label: '取消分组', group: 'Group' },
			{ label: '属性一览', group: 'Group' },
			{ label: '删除图例', group: 'Group' },
			
			{ label: '新增设备', group: 'Topo' },
			{ label: '刷新拓扑', group: 'Topo' },
			{ label: '保存坐标', group: 'Topo' },
			{ label: '自动布局', group: 'Topo' },
			
			//{ separator: true, group: 'Topo' },
			//{ label: '设备过滤', group: 'Topo' },
			//{ label: '取消过滤', group: 'Topo' },
			
			{ separator: true, group: 'Topo' },
			{ label: '设备全选', group: 'Topo' },
			{ label: '链路全选', group: 'Topo' },
			{ separator: true, group: 'Topo' },
			{ label: '显示鹰眼', group: 'Topo' },
			{ label: '隐藏鹰眼', group: 'Topo' }
		]);
	}else{
		popupMenu.setMenuItems([
			//{ label: 'Remove', group: 'Element' },
			{ label: '运行详情', group: 'Node' },
			{ label: '告警一览', group: 'Node' },
			{ label: '远程测试', group: 'Node' },
			
			{ label: '刷新拓扑', group: 'Topo' },
			//{ separator: true, group: 'Topo' },
			//{ label: '设备过滤', group: 'Topo' },
			//{ label: '取消过滤', group: 'Topo' },
			
			{ separator: true, group: 'Topo' },
			{ label: '显示鹰眼', group: 'Topo' },
			{ label: '隐藏鹰眼', group: 'Topo' }
		]);
	}
}

/**
 * 创建网络组
 * ma_he add
 * @return
 */
function showCreateGroup() {
	var selectItems = new twaver.List();
	var groupFlag = false;
	var nodeFlag = false;
	elementBox.getSelectionModel().getSelection().forEach(function (element) {
        if (element instanceof twaver.Group) {
        	selectItems.add(element);
        	groupFlag = true;
        } else if (element instanceof twaver.Node) {
        	selectItems.add(element);
        	nodeFlag = true;
        }
    });
	
    if (selectItems.size() < 2 || (groupFlag && nodeFlag)) {
    	showTipMessage("请至少选择2台设备或设备组！",150,20);
    } else {
    	layer.open({
    		type : 2, //iframe 弹出
    		title : '网络组自定义',
    		shade : 0.3, //遮罩浓度
    		fix : false, //最大化按钮
    		scrollbar: false, //不显示滚动条
    		area : [ "50%", "45%" ], //宽高比例
    		skin : 'layui-layer-rim', //边框Q
    		content : [ ctxBase + '/index/network/topo/networkJump?moduleName=define_link&topoId=' + topoId + "&topoType=" + topoType + "&model=" + 3, 'yes' ]
    	});
    }
}

/**
 * 自定义网络组
 * ma_he add
 * @return
 */
function addToGroup() {
	var selectItems = new twaver.List();
	elementBox.getSelectionModel().getSelection().forEach(function (element) {
        if (element instanceof twaver.Node) {
        	selectItems.add(element);
        }
    });
    if (selectItems.size() < 2) {
    	showTipMessage("请至少选择2台设备！",170,20);
    	return;
    } else {
    	var groupIdFrom = null;
    	var groupIdFromName = null;
    	var groupIdTo = null;
    	var groupIdToName = null;
    	var nodeId = null;
    	var nodeIdName = null;
    	elementBox.getSelectionModel().getSelection().forEach(function (element) {
            //取得选择的groupId
    		if (element instanceof twaver.Group) {
            	if (groupIdFrom == null) {
            		groupIdFrom = element.getClient("groupId");
            		groupIdFromName = element.getName();
            	} else {
            		groupIdTo = element.getClient("groupId");
            		groupIdToName = element.getName();
            	}
            } else if (element instanceof twaver.Node) {
            //取得选择的nodeId
            	nodeId = element.getClient("nodeId");
            	nodeIdName = element.getName();
            }
        });
    	//选择的都是node时，创建网元组
    	if (groupIdFrom == null && groupIdTo == null) {
    		showTipMessage("请至少选择1个设备组！",170,20);
        	return;
        } 
    	//更新确认信息
    	var context = null;
    	var url = null;
    	var data = null;
    	if (nodeId == null){
    		context = '确认将网元组（'+ (groupIdFromName == null ? "" : groupIdFromName) + '）追加到网元组（'+ (groupIdToName == null ? "" : groupIdToName) + '）吗？';
    		url = ctxBase+"/index/network/topo/addNodeGroupToNodeGroup";
    		data = {"groupIdFrom":groupIdFrom,"groupIdTo":groupIdTo};
    	} else {
    		context = '确认将网元（'+ (nodeIdName == null ? "" : nodeIdName) + '）追加到网元组（'+ (groupIdFromName == null ? "" : groupIdFromName) + '）吗？';
    		url = ctxBase+"/index/network/topo/addNodeToNodeGroup";
    		data = {"nodeId":nodeId,"groupId":groupIdFrom}
    	}
    	//确认后提交请求
    	layer.confirm(context, {
			  title:'确认',
			  time: 0, //不自动关闭
			  btn: ['确认', '取消'],
			  yes: function(index){
			    layer.close(index);
				$.ajax({
				type: "POST",
				url : url,
				data : data,
				//async : false, //同步执行
				dataType : "json", //返回数据形式为json
				success : function(data) {
				    //数据接口成功返回
					 if(data == "success"){
						 showTipMessage("自定义网络组成功！",150,20);
						 refreshTopoData();
					}else{
						showTipMessage("自定义网络组失败,请刷新页面重试！",150,20);
					}
				},
				error : function() {
							showTipMessage("自定义网络组异常！",150,20);
						}
				});
			  }
		});
    }
}
/**
 * 设置背景色
 * @return
 */
function showBgColorText(){
	$("#lblGroupName").html("拓扑背景色：");
	$("#tiGroupName").hide();
	$("#tiColorName").show();
	$("#divGroupEdit").attr("style","width:290px;padding:2px 5px;background-color:#E8F2FE;margin-left:140px;");
	$("#divGroupEdit").show();
	network.getView().addEventListener('click', clickCancelLayerAndData);
}


/**
 * 创建网元组表单数据并请求后台
 */
function createNetGroup(groupName){
	$("#divgroup").empty();
	var div = document.getElementById("divgroup");
	createHiddenValue(div,"groupName", groupName);
	createHiddenValue(div,"topoId",topoId);
	//创建表单数据
	elementBox.getSelectionModel().getSelection().forEach(function (element) {
        if (element instanceof twaver.Node) {
        	var nodeId = element.getClient("nodeId");
        	createHiddenValue(div,"groupList",nodeId);
        }
    });
	
	$.ajax({
		type: "POST",
		url : ctxBase+"/index/network/topo/saveNodeGroup",
		data : $('#formGroup').serialize(),
		//async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
		    //数据接口成功返回
			if(data == "exists"){
				showTipMessage("该网元组已存在！",150,20);
			}else if(data == "success"){
				var group = createGroupByName(groupName);
				elementBox.getSelectionModel().getSelection().forEach(function (element) {
			        if (element instanceof twaver.Node) {
			            group.addChild(element);
			        }
			    });
				elementBox.add(group);
				$("#divgroup").empty();
				$("#divGroupEdit").hide();
				$("#tiGroupName").val('');
				showTipMessage("网元组创建成功！",150,20);
			}else{
				showTipMessage("创建网元组失败,请刷新页面重试！",150,20);
			}
		},
		error : function() {
			showTipMessage("创建网元组失败,请刷新页面重试！",150,20);
		}
	});
}

/**
 * 取消网元组
 */
function cancelNetGroup(){
	if(elementBox.getSelectionModel().getSelection().size() == 1){
		var group = elementBox.getSelectionModel().getFirstData();
		if (group instanceof twaver.Group) {
			var groupId = group.getClient("groupId");
			$("#divgroup").empty();
			var div = document.getElementById("divgroup");
			createHiddenValue(div,"groupId",groupId);
			createHiddenValue(div,"topoId",topoId);
			var item = group._childList._as;
			var nodeCount = 0;
			var groupCount = 0;
			item.forEach(function (element) {
				if (element instanceof twaver.Group) {
					groupCount++;
				} else if (element instanceof twaver.Node) {
					nodeCount++
				}
			});
			createHiddenValue(div,"nodeCount", nodeCount);
			createHiddenValue(div,"groupCount",groupCount);
			$.ajax({
				type: "POST",
				url : ctxBase+"/index/network/topo/deleteTopoNodeGroup",
				data : $('#formGroup').serialize(),
				//async : false, //同步执行
				dataType : "json", //返回数据形式为json
				success : function(data) {
				    //数据接口成功返回
					 if(data == "success"){
						 group.clearChildren();
						 elementBox.removeById (group.getId());
						 $("#divgroup").empty();
						 showTipMessage("网元组取消成功！",150,20);
					}else{
						showTipMessage("取消网元组失败,请刷新页面重试！",150,20);
					}
				},
				error : function() {
					showTipMessage("取消网元组失败,请刷新页面重试！",150,20);
					$("#divgroup").empty();
				}
			});
		}
	}
}


/**
 * 保存拓扑节点坐标
 */
function saveAllNodePostion(type){
	//保存节点坐标后刷新
	$("#divgraphnode").empty();
	var div = document.getElementById("divgraphnode");
	createHiddenValue(div,"topoId",topoId);
	var json = "";
	var selectedType = "";
	elementBox.getDatas().forEach(function (element) {
		if (element instanceof twaver.Link) {
			var linkId = element.getClient("linkId");
			var linkType = element.getClient("linkType");
			var linkDiv = element.getClient("linkDiv");
			var extendType = element.getClient("extendType");
			var lgroupPos = "";
			var rgroupPos = "";
			var pointStr = "";
			
			//曲线为节点到group或者group到group时，保存group的节点位置
			if (linkDiv == 2) {
				//node-group
				var lnodeId = element.getClient("lnodeId");
				if (lnodeId.indexOf("G") > -1) {
					lgroupPos = element.getStyle("link.from.position");
				} else {
					rgroupPos = element.getStyle("link.to.position");
				}
			} else if (linkDiv == 3) {
				//group-group
				lgroupPos = element.getStyle("link.from.position");
				rgroupPos = element.getStyle("link.to.position");
			}

			if (linkType == 1 && extendType != 5) {
				//曲线（自定义以外拖拽点保存）
				var linkUI = new twaver.canvas.LinkUI(canvasNetwork,element);
				var linkControlPoint = linkUI.getControlPoint();
				if (linkControlPoint != null) {
					pointStr = parseInt(linkControlPoint.x) + ' '+ parseInt(linkControlPoint.y);
				}
			} else {
				if (element._points != undefined) {
					//曲线或折线（自定义拖拽点保存）
					var points = element.getPoints();
					points.forEach(function (e) {
						pointStr = pointStr + ','+ parseInt(e.x) + ' '+ parseInt(e.y);
					});
				}
			}
			
			if (pointStr != "") {
				pointStr = pointStr.indexOf(",") > -1 ? pointStr.substring(1) : pointStr;
				var groupPosStr = (linkDiv == 2 || linkDiv == 3) ? ('","lgroupPos":"'+ lgroupPos +'","rgroupPos":"'+ rgroupPos) : "";
				json = '{"linkId":"'+ linkId +'","linkType":"'+ linkType +'","pointArray":"'+ pointStr + groupPosStr +'"}';
			} else if (linkDiv == 2 || linkDiv == 3) {
				json = '{"linkId":"'+ linkId +'","linkType":"'+ linkType + '","lgroupPos":"'+ lgroupPos +'","rgroupPos":"'+ rgroupPos +'"}';
			}
			createHiddenValue(div,"graphList",json);
		} else if (element instanceof twaver.Node && !(element instanceof twaver.Group)) {
        	//创建节点坐标数据
        	var nodeId = element.getClient("nodeId");
        	var height = parseInt(element.getHeight());
        	var width  = parseInt(element.getWidth());
        	if (element.getClient("nodeId") == undefined) {
        		nodeId = "T"+topoId;
        	}
        	var jsonStr = '{"topoId":"'+topoId+'","nodeId":"'+nodeId+'","posX":'+element.getX() +',"posY":'+element.getY()+',"height":'+height+',"width":'+width+'}';
        	createHiddenValue(div,"graphList",jsonStr);
        }
    });
	$.ajax({
		type: "POST",
		url : ctxBase+"/index/network/topo/saveGraphNode",
		data : $('#formGraphNode').serialize(),
		//async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
		    //数据接口成功返回
			if(data == "success"){
				//点击保存坐标按钮以外时，自动保存坐标
				if (type == 1) {
					elementBox.clear();
					initTopoData();
				} else {
					showTipMessage("拓扑坐标保存成功！",150,20);
				}
			}else{
				showTipMessage("拓扑坐标保存失败,请刷新页面重试！",150,20);
			}
			$("#divgraphnode").empty();
		},
		error : function() {
			showTipMessage("拓扑坐标保存失败,请刷新页面重试！",150,20);
			$("#divgraphnode").empty();
		}
	});
}

/**
 * 修改拓扑信息
 * @param title
 * @param bgcolor
 */
function saveTopoInfo(topoName, topoBgcolor, frequency){
	$.ajax({
		type: "POST",
		url : ctxBase+"/index/network/topo/saveTopoInfo",
		data : {
			"topoId": topoId,
			"topoName" : topoName,
			"topoBgcolor" : topoBgcolor,
			"frequency" : frequency
		},
		//async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
		    //数据接口成功返回
			if(data == "success"){
				showTipMessage("修改拓扑信息成功！",150,20);
				$("#divGroupEdit").hide();
				$("#tiGroupName").val('');
			
				if(topoBgcolor != null && topoBgcolor != "" && typeof(topoBgcolor) != "undefined"){
					elementBox.setStyle('background.type', 'vector');
					elementBox.setStyle("background.vector.fill",true);
					elementBox.setStyle("background.vector.fill.color", '#' + topoBgcolor);
				}
				if(topoName != null && topoName != "" && typeof(topoName) != "undefined"){
					currentElement.setName(topoName);
				}
				
			}else{
				showTipMessage("修改拓扑信息失败,请刷新页面重试！",150,20);
			}
			$("#divgraphnode").empty();
		},
		error : function() {
			showTipMessage("修改拓扑信息失败,请刷新页面重试！",150,20);
			$("#divgraphnode").empty();
		}
	});
}

/**
 * 加载节点告警信息
 */
function loadElementAlarm(){
	console.log("topoId: "+topoId);
	$.ajax({
		type: "POST",
		url : ctxBase+"/index/network/topo/getAlarmByActivity?topoId="+topoId,
		dataType : "json", //返回数据形式为json
		success : function(data){
			console.log(data);
		    //数据接口成功返回
			var result = eval(data);
			for(var i=0; i<result.length; i++)
			{
				var alarm = result[i];
				var alarmCount = alarm["ALARM_COUNT"];
				var alertTip = "告警总数："+alarmCount+"项";
				
				var nodeId = alarm["NODE_ID"];
				var element = elementBox.getDataById("Node_"+nodeId);
				
				var severity = "";
				var linkColor = "";
				if(alarmCount!="0"){
					severity = twaver.AlarmSeverity.CRITICAL;
					linkColor = "#FF0000";
				}
				
				//设告警颜色
				for(var j = 0; j< alarmCount; j++){
					var alarmId = "Alarm_node_"+j+"_"+nodeId+Math.random();
					addAlarm(alarm,alarmId,element.getId(),severity);
				}
			}
		},
		error : function() {
			showTipMessage("加载节点告警信息异常！",150,20);
		}
	});
}

/**
 * 显示设备过滤页面
 */
function filterTopoNodes(event, isFilter){
	// 过滤
	if(isFilter){
		//获取拓扑新增设备
		layer.open({
			type : 2, // iframe 弹出
			title : false,
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			area : [ "50%", "45%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ ctxBase + '/index/network/topo/networkJump?moduleName=topo_filter&topoType=' + topoType + '&topoId=' + topoId, 'yes' ]
		});
	} else {
		// 恢复所有被过滤node的图标
		elementBox.forEach(function(_node){
			if (_node instanceof twaver.Node && _filterNodeIds.contains(_node._id)) {
				_filterNodeIds.remove(_node._id);
				_node.setStyle('inner.color', '');
	        }
		});
		showTipMessage("操作成功！",150,20);
	}
}


function setLinkPosition(link){
	  
	if(link.getClient('linkDiv') == 3){ //group与group之间的链路
		
		var from = link.getClient('link.node.from');
		var to   = link.getClient('link.node.to');
		
		//var link = elementBox.getDataById(linkUI.getElement().getClient('linkId'));
		
		var fcenter = from.getCenterLocation();
		var tcenter = to.getCenterLocation();
		
		var guif= new twaver.vector.GroupUI(canvasNetwork,from);
		var guit = new twaver.vector.GroupUI(canvasNetwork,to);
		
		var gWidthf = guif.getBodyRect().width/2;
		var gHeightf = guif.getBodyRect().height/2;
		
		var gWidtht = guit.getBodyRect().width/2;
		var gHeightt = guit.getBodyRect().height/2;
		
		var leftFx = fcenter.x - gWidthf;
		var rightFx = fcenter.x + gWidthf;
		var topFy = fcenter.y - gHeightf;
		var bottomFy =  fcenter.y + gHeightf;
		
		var leftTx = tcenter.x - gWidtht;
		var rightTx = tcenter.x + gWidtht;
		var topTy = tcenter.y - gHeightt;
		var bottomTy = tcenter.y + gHeightt;
		
		if((topFy > bottomTy) &&  ((leftTx < rightFx) && (leftFx < rightTx)) ){ //结束节点在起始节点的上方
			link.s("link.from.position","top");
			link.s("link.to.position","bottom");
		}else if((bottomFy < topTy) && ((leftTx < rightFx) && (leftFx < rightTx))){
			link.s("link.from.position","bottom");
			link.s("link.to.position","top");
		}else if(rightFx < leftTx){
			link.s("link.from.position","right");
			link.s("link.to.position","left");
		}else if(rightTx < leftFx){
			link.s("link.from.position","left");
			link.s("link.to.position","right");
		}else{
			link.s("link.from.position","center");
			link.s("link.to.position","center");
		}
	}else if(link.getClient('linkDiv') == 2){
		var linkUI = new twaver.canvas.LinkUI(canvasNetwork,link);
		var f = linkUI.getFromPoint();
		var t = linkUI.getToPoint();
		
		var nodeFrom = link.getClient('link.node.from');
		var nodeTo   = link.getClient('link.node.to');
		//var link = elementBox.getDataById(linkUI.getElement().getClient('linkId'));
		
		if(nodeFrom instanceof twaver.Group){
			//var group3 = box.getDataById("group3");
			var center = nodeFrom.getCenterLocation();
			var gui = new twaver.vector.GroupUI(canvasNetwork,nodeFrom);
			
			var gLeftX = center.x - gui.getBodyRect().width/2;
			var gRightX = center.x + gui.getBodyRect().width/2;
			var gTopY = center.y - gui.getBodyRect().height/2;
			var gBottomY = center.y + gui.getBodyRect().height/2;
			if(t.x < gLeftX){
				link.s("link.from.position","left");
			}else if(t.x > gRightX){
				link.s("link.from.position","right");
			}else if((t.y > gBottomY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.from.position","bottom");
			}else if((t.y  < gTopY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.from.position","top");
			}else{
				link.s("link.from.position","center");
			}
			
		}else{
			//var group3 = box.getDataById("group3");
			var center = nodeTo.getCenterLocation();
			var gui = new twaver.vector.GroupUI(canvasNetwork,nodeTo);
			
			var gLeftX = center.x - gui.getBodyRect().width/2;
			var gRightX = center.x + gui.getBodyRect().width/2;
			var gTopY = center.y - gui.getBodyRect().height/2;
			var gBottomY = center.y + gui.getBodyRect().height/2;
			
			if(f.x < gLeftX){
				link.s("link.to.position","left");
			}else if(f.x > gRightX){
				link.s("link.to.position","right");
			}else if((f.y > gBottomY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.to.position","bottom");
			}else if((f.y  < gTopY) && (f.x >gLeftX) && f.x <gRightX){
				link.s("link.to.position","top");
			}else{
				link.s("link.to.position","center");
			}
		}
	}
}
