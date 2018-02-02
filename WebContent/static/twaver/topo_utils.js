/**
 * 拓扑图逻辑通用类
 * @author CsWang
 * @date 2015-12-03
 */

/**
 * 标题修改
 */
var titleInput = document.createElement('input');

/**
 * 加载标题
 * @param topoInfo
 * @param type
 * @returns {twaver.Node}
 */
function createTitleNode(topoInfo){
	var titleId = "Title_"+topoInfo["topoId"];
	var titleNode = new twaver.Node(titleId);
	titleNode.setClient("type","Title");
	titleNode.setClient("appsystemId",appsystemId);
	titleNode.setName(topoInfo["topoName"]);
	if (topoInfo["fontSize"] != 0) {
		titleNode.setStyle("label.font",topoInfo["fontSize"] + "px 微软雅黑");
		titleNode.setClient("fontSize", topoInfo["fontSize"]);
	} else {
		titleNode.setStyle("label.font", "30px 微软雅黑");
		titleNode.setClient("fontSize", "30");
	}
	if (topoInfo["fontColor"] != null) {
		titleNode.setStyle('label.color',"#" + topoInfo["fontColor"]);
		titleNode.setClient("fontColor",topoInfo["fontColor"]);
	} else {
		titleNode.setStyle('label.color', "#000000");
		titleNode.setClient("fontColor","000000");
	}
	titleNode.setImage('');
	titleNode.setStyle("label.position","right");
	titleNode.setStyle("select.style","shadow");
	titleNode.setStyle("select.color","rgba(0,0,150,0.7)");
	//titleNode.setToolTip("双击可修改标题，回车保存！");
	var posX = topoInfo["posX"];
	var posY = topoInfo["posY"];
	titleNode.setLocation(posX,posY);
	
	return titleNode;
}

/**
 * 添加图例
 * @param topoInfo
 * @returns {twaver.Node}
 */
function createLegend(image, posX, posY){
	var legend = new twaver.Node(image);
	legend.setClient("type","Legend");
	legend.setImage(image);
	legend.setLocation(posX,posY);
	elementBox.add(legend);
}

/**
 * 加载节点
 * @param device 节点信息
 * @returns {twaver.Node}
 */
function createNodeGroup(nodeGroup){
	var group = new twaver.Group(nodeGroup.nodeGroupId);
	group.setName(nodeGroup.nodeGroupName);
	group.setClient("groupId",nodeGroup.nodeGroupId);
	group.setClient("groupType",nodeGroup.groupType);
	group.setClient("nodeType","group");

	//设置提示信息
	if(nodeGroup["tipInfo"] != null){
		var toolTip = '';
		$.each(nodeGroup["tipInfo"], function(i, n){
			if(i>0)
				toolTip+='<br>';
			toolTip+=n;
		});
		group.setToolTip(toolTip);
	}

	if (nodeGroup.groupType == 0) {
		group.s('node.image',"Clound.png");
		group.s('group.fill.color',"#"+nodeGroup.groupColor);
		group.s('label.font',nodeGroup.fontSize+"px 微软雅黑");
		group.s('label.color',"#"+nodeGroup.fontColor);
		group.s('group.outline.width', nodeGroup.lineWidth);
		group.s('group.outline.color', "#"+nodeGroup.lineColor);
		//边框虚线设定
		if (nodeGroup.lineType == 1) {
			group.s('vector.outline.pattern', [12,3]);
		}
		group.setLocation(nodeGroup.xPos, nodeGroup.yPos);
		group.setStyle("select.style","shadow");
		setFontLocation(group,nodeGroup.groupLocation);
		group.setExpanded(true);
		if(nodeGroup.parentId != null){
			group.setParent(elementBox.getDataById(nodeGroup.parentId));
		}
	} else {
		//图例Group
		group.setName(nodeGroup.nodeGroupName);
		group.s("label.xoffset",50);
		group.s("label.position","right.left");
		group.s('group.fill.color',"#FFFFFF");
		group.s("select.style","shadow");
		group.setExpanded(true);
		group.s('network.doubleClickToGroupExpand', false);
		if(nodeGroup.parentId != null){
			group.setParent(elementBox.getDataById(nodeGroup.parentId));
		}
	}
	elementBox.add(group);
}

function setFontLocation(group,num){
	
	switch (parseInt(num)){
	
		case 1:
			group.s("label.position","topleft.bottomright");
			break;
		
		case 2:
			group.s("label.position","top.bottom");
			break;
		
		case 3:
			group.s("label.position","topright.bottomleft");
			break;
		
		case 4:
			group.s("label.position","left.right");
			break;
			
		case 5:
			group.s("label.position","center");
			break;
		
		case 6:
			group.s("label.position","right.left");
			break;
		
		case 7:
			group.s("label.position","bottomleft.topright");
			break;
		
		case 8:
			group.s("label.position","bottom.top");
			break;
		
		case 9:
			group.s("label.position","bottomright.topleft");
			break;
		
		default: ;
	}
}

/**
 * 加载节点
 * @param device 节点信息
 * @returns {twaver.Node}
 */
function createNode(device, alarmImageName, alarmImageNameOfSys){
	var nodeId = "Node_"+device["nodeId"];
	if(elementBox.getDataById(nodeId) != null){
		return null;
	}
	var node = new twaver.Node(nodeId);
	node.setClient("type","Node");
	node.setClient("nodeId",device["nodeId"]);
	node.setName(device["nodeName"]);
	node.setClient("resourceId",device["resourceId"]);
	node.setClient("ipAddress",device["ipAddress"]);
	node.setClient("nodeType",device["nodeType"]);
	node.setClient("className",device["className"]);//记录设备类型，跳转详情用.
	node.setClient("nodeType",device["nodeType"]);
	node.setClient("graphName",device["graphName"]);
	node.setClient("fontSize",device["fontSize"]);
	node.setClient("fontColor",device["fontColor"]);
	node.setClient("divType",device["divType"]);
	node.setImage(device["graphName"]);

	if(device.perfSection != null){
		if (device.quotaArray != null) {
			var quotaArray = device.quotaArray.split(",");
			var quotaLength =  quotaArray.length;
		}
		var kpiArr = device.perfSection;
		var arrLength = device.perfSection.length;
		var newKpiArray = new Array();
		var kpiStatusImage = ''; //显示kpi状态的图片
		for(var i=0;i<arrLength;i++){
			if (device.quotaArray != null) {
				for(var j=0;j<quotaLength;j++){
					if(kpiArr[i].kpiId == quotaArray[j]){
						newKpiArray.push(kpiArr[i]);
					}
				}
			}
			var kpiName = kpiArr[i].kpiName;
			var value = kpiArr[i].subResourceId;
			if (kpiName == 'Status' || kpiName == 'runState') {
				if(value == 0){
					kpiStatusImage = 'statered';
				}else if(value == 1){
					kpiStatusImage = 'stategreen';
				}else{
					kpiStatusImage = 'stategray';
				}
			} else if (kpiName == 'RunningStatus') {
				//设置中间件2状态图标
				if(value=="1"){
					kpiStatusImage = 'stategreen';
				}else if(value=="0"){
					kpiStatusImage = 'statered';
				}else if(value=="2"){
					kpiStatusImage = 'stateyellow';
				}else{
					kpiStatusImage = 'stategray';
				}
			} else if (kpiName == 'DatabaseStatus') {
				//设置数据库状态图标
				if(value==1 || value =="ACTIVE"){
					kpiStatusImage = 'stategreen';
				}else if(value==0 || value == "SUSPENDED"){
					kpiStatusImage = 'statered';
				}else if(value == "--" || value == null || value == ''){
					kpiStatusImage = 'stategray';
				}else if(value == "INSTANCE RECOVERY"){
					kpiStatusImage = 'stateyellow';
				}
			 }
		}
			regKpiDuotaImage(newKpiArray, kpiStatusImage, device, (device["nodeType"] != 5 ? alarmImageName : alarmImageNameOfSys));
			node.setStyle('icons.names', device.nodeId);
			node.setStyle('icons.position', 'bottomright.topleft')
	}

	if(device["nodeGroupId"] != null){
		node.setParent(elementBox.getDataById(device["nodeGroupId"]));
	}
	// 设置属性：设备过滤时候用
	node.setClient("deviceType",device["deviceType"]);//记录设备类型，跳转详情用
	node.setClient("brand",device["brand"]);//记录设备类型，跳转详情用
	node.setClient("appsystemId",device["appsystemId"]);//记录设备类型，跳转详情用
	
	//设置提示信息
	if(device["tipInfo"] != null){
		var toolTip = '';
		$.each(device["tipInfo"], function(i, n){
			if(i>0)
				toolTip+='<br>';
			toolTip+=n;
		});
		node.setToolTip(toolTip);
	}

	var posX = device["posX"];
	var posY = device["posY"];
	//纯文本处理
	if(device["brand"] == "Font"){
		node.setImage('');
		node.setStyle("select.style","shadow");
	} 
	if (device["fontSize"] != 0 && device["fontSize"] != null) {
		node.setStyle("label.font", device["fontSize"] + "px 微软雅黑");
	} else {
		node.setStyle("label.font","8px 微软雅黑");
	}
	if (device["fontColor"] != "" && device["fontColor"] != null) {
		node.setStyle("label.color","#" + device["fontColor"]);
	} else {
		node.setStyle("label.color","#000000");
	}
	
	if(device["brand"] == "statu1"){
		node.setStyle("icons.names","statu1");
		node.setStyle("icons.position","topright");
	}
	var width = device["width"];
	if (width != 0 && width != null){
		node.setWidth(width);
	}
	var height = device["height"];
	if (height != 0 && height != null){
		node.setHeight(height);
	}
	//node.setStyle('label2.font',device["fontSize"] + "px 微软雅黑");
	node.setLocation(posX,posY);
	
	return node;
}

//显示节点状态及绑定kpi进步率图标
function regKpiDuotaImage(perfSectionArray, kpiStatusImage, device, alarmimageName){
	var imageName = device.nodeId;
	var height = device.height;
	var width = device.width;
	var x = device.posX;
	var y = device.posY;

	var topPresentText;
	var topPresentValue;
	var topSchedule;
	var topName;
	
	var buttomPresentText;
	var buttomPresentValue;
	var buttomSchedule;
	var buttomName;
	
	for(var i=0;i<perfSectionArray.length;i++){
		if(i == 0){
			topPresentText = perfSectionArray[i].subResourceId +"%";
			topPresentValue = perfSectionArray[i].subResourceId/100;
			topSchedule = 60*topPresentValue;
			topName = perfSectionArray[i].kpiName;
		}
		if(i == 1){
			buttomPresentText = perfSectionArray[i].subResourceId +"%";
			buttomPresentValue = perfSectionArray[i].subResourceId/100;
			buttomSchedule = 60*buttomPresentValue;
			buttomName = perfSectionArray[i].kpiName;
		}
		
	}
	
	//设置告警状态图标
	//表示没有kpi指标 只显示状态
	if(topName == null || topName == undefined){
		twaver.Util.registerImage(imageName,{
			 w: width,
			 h: height,  
			 v: [{
				    shape: 'vector',
					name: alarmimageName,
					x: -width*2/3,
					y: -height*2/3,
					w: (height + width)/3, 
					h: (height + width)/3,	
				},{
				    shape: 'vector',
					name: kpiStatusImage,
					x: width/2,
					y: height/2,
					w: (height/4 + width/4)/2, 
					h: (height/4 + width/4)/2,	
				}],
			
		})
	}else if(buttomName == null){ //表示只有一个kpi指标系数
		twaver.Util.registerImage(imageName, {
			 w: width,
			  h: height,  
			  v: [{
				    shape: 'vector',
					name: alarmimageName,
					x: -width*2/3,
					y: -height*2/3,
					w: (height + width)/3, 
					h: (height + width)/3,	
				},{
				    shape: 'vector',
					name: kpiStatusImage,
					x: width/2,
					y: height/2,
					w: (height/4 + width/4)/2, 
					h: (height/4 + width/4)/2,	
				},{
					shape: 'text',
					text: topName,
					fill:'black',
					x:-30,
					y:10,
					font: '11px',
				},{
					
					shape: 'rect',
					x: 9,
					y: 4, 
					w: 60, 
					h: 12,			
					fill: 'black',
					lineColor:'black',
					
				},{
					shape: 'rect',
					x: 10,
					y: 5, 
					w: 58, 
					h: 10,			
					fill: '#FFFCF0',
					lineWidth: 0,
				},{
					shape: 'rect',
					x: 10,
					y: 5, 
					w: 0, 
					h: 10,		
					fill: '#14FF47',
					lineWidth:0,
					animate: [{
						attr: 'w',
						to: topSchedule, //进度条的进度
						dur: 1000,//完成时间
						reverse: false,
						repeat: false
					}]
				},{
					shape: 'text',
					text: topPresentText,
					fill:'black',
					x:40,
					y:10,
					font: '11px',
				}],
			});
	}else{    
		//表示两个指标都有
		twaver.Util.registerImage(imageName, {
			  w: width,
			  h: height,  
			  v: [{
				    shape: 'vector',
					name: alarmimageName,
					x: -width*2/3,
					y: -height*2/3,
					w: (height + width)/3, 
					h: (height + width)/3,	
				},{
				    shape: 'vector',
					name: kpiStatusImage,
					x: width/2,
					y: height/2,
					w: (height/4 + width/4)/2, 
					h: (height/4 + width/4)/2,	
				},{
					shape: 'text',
					text: topName,
					fill:'black',
					x:-30,
					y:10,
					font: '11px',
				},{
					
					shape: 'rect',
					x: 9,
					y: 4, 
					w: 60, 
					h: 12,			
					fill: 'black',
					lineColor:'black',
					
				},{
					shape: 'rect',
					x: 10,
					y: 5, 
					w: 58, 
					h: 10,			
					fill: '#FFFCF0',
					lineWidth: 0,
				},{
					shape: 'rect',
					x: 10,
					y: 5, 
					w: 0, 
					h: 10,		
					fill: '#14FF47',
					lineWidth:0,
					animate: [{
						attr: 'w',
						to: topSchedule, //进度条的进度
						dur: 1000,//完成时间
						reverse: false,
						repeat: false
					}]
				},{
					shape: 'text',
					text: topPresentText,
					fill:'black',
					x:40,
					y:10,
					font: '11px',
				},{   //第二个进度条
					shape: 'text',
					text: buttomName,
					fill:'black',
					x:-30,
					y:25,
					font: '11px',
				},{            
					
					shape: 'rect',
					x: 9,
					y: 19, 
					w: 60, 
					h: 12,			
					fill: 'black',
					lineColor:'black',
					
				},{
					shape: 'rect',
					x: 10,
					y: 20, 
					w: 58, 
					h: 10,			
					fill: '#FFFCF0',
					lineWidth: 0,
				},{  
					shape: 'rect',
					x: 10,
					y: 20, 
					w: 0, 
					h: 10,		
					fill: '#14FF47',
					lineWidth:0,
					animate: [{
						attr: 'w',
						to: buttomSchedule, //进度条的进度
						dur: 1000,//完成时间
						reverse: false,
						repeat: false
					}]
				},{  //bottom百分比
					shape: 'text',
					text: buttomPresentText,
					fill:'black',
					x:40,
					y:25,
					font: '11px',
				}],
		});
	}
}

function getImageName(topoType,deviceType,nodeStatus){
	var img;
	$.ajax({
		type: "GET",
		url : ctxBase + "/index/network/topo/getImageByDeviceType?deviceType=" + deviceType + "&topoType=" + topoType+"&imageStatus="+nodeStatus,
		async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
			if(data){
				img = data.imageName;
			}
			
		},
		error : function() {
			showTipMessage("获取节点图片异常！",150,20);
		}
	});
	return img;
}

/**
 * 加载图例节点
 * @param device
 * @returns
 */
function createNodeLegend(device, j, k){
	var nodeId = "Node_"+device["nodeId"];
	if(elementBox.getDataById(nodeId) != null){
		return null;
	}
	var node = new twaver.Node(nodeId);
	node.setSize(0,0);
	node.setClient("type","Node");
	node.setClient("nodeId",device["nodeId"]);
	node.setClient("stdId",device["stdId"]);
	node.setClient("resourceId",device["resourceId"]);
	node.setClient("ipAddress",device["ipAddress"]);
	node.setClient("nodeType",device["nodeType"]);
	node.setClient("className",device["className"]);//记录设备类型，跳转详情用
	if(device["nodeGroupId"] != null){
		node.setParent(elementBox.getDataById(device["nodeGroupId"]));
	}

	// 设置属性：设备过滤时候用
	node.setClient("deviceType",device["deviceType"]);//记录设备类型，跳转详情用
	node.setClient("brand",device["brand"]);//记录设备类型，跳转详情用
	node.setClient("appsystemId",device["appsystemId"]);//记录设备类型，跳转详情用
	
	//设置提示信息
	if(device["tipInfo"] != null){
		var toolTip = '';
		$.each(device["tipInfo"], function(i, n){
			if(i>0)
				toolTip+='<br>';
			toolTip+=n;
		});
		node.setToolTip(toolTip);
	}
	
	//node.putLabelColor(Color.cyan);

	
	var posX = device["posX"];
	if(posX == 0){
		posX = 100 + k*100;
	}
	var posY = device["posY"];
	if(posY == 0){
		posY = 100 + j*20;
	}
	
	//纯文本处理
	if(device["brand"] == "Font"){
		node.setStyle("label.font","20px 微软雅黑");
		node.setImage('');
		node.setStyle("select.style","shadow");
	}
	if(device["brand"] == "statu1"){
		node.setStyle("icons.names","statu1");
		node.setStyle("icons.position","topright");
	}
	node.setLocation(posX,posY);
	return node;
}


/**
 * 加载链路
 * @param item 链路对象
 * @returns {twaver.Link}
 */
function createLink(item){
	if(item.lnodeId == null || item.rnodeId == null){
		item.lnodeId = '';
		item.rnodeId = '';
	}
	var A_NENode;
	var Z_NENode;
	if(item.lnodeId.substring(0,1) == 'G' && item.rnodeId.substring(0,1) == 'G'){ //from和to节点都为group
		A_NENode = elementBox.getDataById(item.lnodeId);
		Z_NENode = elementBox.getDataById(item.rnodeId);
	}else if(item.lnodeId.substring(0,1) == 'G'){
		A_NENode = elementBox.getDataById(item.lnodeId);
		Z_NENode = elementBox.getDataById("Node_"+item["rnodeId"]);
	}else if(item.rnodeId.substring(0,1) == 'G'){
		A_NENode = elementBox.getDataById("Node_"+item["lnodeId"]);
		Z_NENode = elementBox.getDataById(item.rnodeId);
	}else{
		A_NENode = elementBox.getDataById("Node_"+item["lnodeId"]);
		Z_NENode = elementBox.getDataById("Node_"+item["rnodeId"]);
	}
	
	if(A_NENode == null || Z_NENode==null){
		return null;
	}
	var linkId = item["linkId"];
	if(elementBox.getDataById(linkId) != null){
		return null;
	}
	
	//创建折线或曲线 （目前type为2创建的是折线和曲线）
	if(item.linkType == 2 || (item.linkType == 1 && item.extendType == 5)){
		return createShapeLink(linkId, A_NENode, Z_NENode,item);
	}else{
		var link = new twaver.Link(linkId, A_NENode, Z_NENode);
		link.setClient("type","Link");
		link.setClient("linkType",item.linkType);
		link.setClient("linkDiv",item.linkDiv);
		link.setClient("linkId",linkId);
		link.setClient("link.node.from",A_NENode);
		link.setClient("link.node.to",Z_NENode);
		link.setClient("lnodeId",item["lnodeId"]);
		link.setClient("rnodeId",item["rnodeId"]);
		link.setClient("lnodeResId",item["lnodeResId"]);
		link.setClient("rnodeResId",item["rnodeResId"]);
		link.setClient("poxRange",item["poxRange"]);
		link.setClient("interfaceId",item["interfaceId"]);
		link.setClient("extendType",item["extendType"]);
		link.setClient("interfaceFailMin",item["interfaceFailMin"]);
		link.setClient("interfaceFailMax",item["interfaceFailMax"]);
		link.setClient("servicedomainResid",item.servicedomainResid);

		link.setName(item.linkName);
		//字体和颜色
		link.setStyle("label.color","#"+item.fontColor);
		link.setStyle("label.font",item.fontSize + "px 微软雅黑");
		//定义linkType
		if(item.linkType == 3){
			link.setClient('link.type','leftright');
			link.setClient('linkDirection',item.linkDirection);
			if(item.poxRange == 0){
				link.setClient("link.poxRange",30);
			}else{
				link.setClient("link.poxRange",item.poxRange);
			}
		} else if (item.linkType == 1){
			// 曲线拖拽保存（自定义以外）
			setExtendType(link,item);
			var linkUI = new twaver.canvas.LinkUI(canvasNetwork,link);
			var points = item["pointList"];
			if (points != null && points != '') {
				for(var i = 0; i < points.length; i++){
					linkUI.setControlPoint({x:points[i]["xPoint"], y:points[i]["yPoint"]});
				}
			}
		}
		//颜色与宽度
		if(item.stdId != null && item.stdId != '0'){
			link.setStyle("link.color", "#" + item.stdLineColor);
			link.setStyle("link.width", item.stdLineWidth);
			setLinkArrow(link,item.stdLineArrow, "#" + item.stdLineColor);
		}else{
			link.setStyle("link.color", "#" + item.lineColor);
			link.setStyle("link.width", item.lineWidth);
			setLinkArrow(link,item.lineArrow, "#" + item.lineColor);
		}
		
		//实线虚线
		if(item.stdId != null && item.stdId != '0'){ //link的style是引用图例
			if(item.stdLineType == 1){
				link.setStyle('link.pattern', [5, 2]);
			}
		}else{
			if(item.lineType == 1){
				link.setStyle('link.pattern', [5, 2]);
			}
		}

		link.setStyle("select.color","rgba(0,0,150,0.9)");
		link.setStyle("link.bundle.enable",true);
		link.setStyle("link.bundle.expanded",true);
		//设置group的连接位置
		if (item["linkDiv"] == 2) {
			if (item["lnodeId"].indexOf("G") > -1) {
				if (item["lgroupPos"] != null) {
					link.setStyle("link.from.position", item["lgroupPos"]);
				}
			} else {
				if (item["rgroupPos"] != null) {
					link.setStyle("link.to.position", item["rgroupPos"]);
				}
			}
		} else if (item["linkDiv"] == 3) {
			if (item["lgroupPos"] != null) {
				link.setStyle("link.from.position", item["lgroupPos"]);
			}
			if (item["rgroupPos"] != null) {
				link.setStyle("link.to.position", item["rgroupPos"]);
			}
		}

		return link;
	}
}

//注册图片
function registerImages() {
    twaver.Util.registerImage('error',{
        "w": 16,
        "h": 16,
        "origin": {
            "x": 0,
            "y": 0
        },
        "v": [
            {
                "shape": "path",
                "data": "M12.653,10.386L10.386,8.12l2.266-2.266c0.623-0.623,0.623-1.643,0-2.266c-0.623-0.624-1.644-0.623-2.268,0  L8.12,5.853L5.855,3.588c-0.624-0.624-1.645-0.623-2.267,0c-0.623,0.623-0.623,1.643,0,2.266L5.854,8.12l-2.266,2.266  c-0.623,0.623-0.623,1.644,0,2.267c0.623,0.622,1.643,0.622,2.266,0l2.267-2.267l2.268,2.267c0.622,0.622,1.643,0.622,2.266,0  C13.275,12.029,13.275,11.009,12.653,10.386z",
                "fill": "#FF0000"
            }
        ]
    });
    twaver.Util.registerImage('alarm',{
        "w": 16,
        "h": 16,
        "origin": {
            "x": 0,
            "y": 0
        },
        "v": [
            {
                "shape": "path",
                "data": "M12.653,10.386L10.386,8.12l2.266-2.266c0.623-0.623,0.623-1.643,0-2.266c-0.623-0.624-1.644-0.623-2.268,0  L8.12,5.853L5.855,3.588c-0.624-0.624-1.645-0.623-2.267,0c-0.623,0.623-0.623,1.643,0,2.266L5.854,8.12l-2.266,2.266  c-0.623,0.623-0.623,1.644,0,2.267c0.623,0.622,1.643,0.622,2.266,0l2.267-2.267l2.268,2.267c0.622,0.622,1.643,0.622,2.266,0  C13.275,12.029,13.275,11.009,12.653,10.386z",
                "fill": "#FFFF00"
            }
        ]
    });
}

//创建折线或曲线
function createShapeLink(linkId, A_NENode, Z_NENode,item){
	
	var link = new twaver.ShapeLink(linkId, A_NENode, Z_NENode);
	link.setClient("type","Link");
	link.setClient("linkType",item.linkType);
	link.setClient("linkDiv",item.linkDiv);
	link.setClient("linkId",linkId);
	link.setClient("link.node.from",A_NENode);
	link.setClient("link.node.to",Z_NENode);
	link.setClient("lnodeId",item["lnodeId"]);
	link.setClient("rnodeId",item["rnodeId"]);
	link.setClient("lnodeResId",item["lnodeResId"]);
	link.setClient("rnodeResId",item["rnodeResId"]);
	link.setClient("poxRange",item["poxRange"]);
	link.setClient("interfaceId",item["interfaceId"]);
	link.setClient("extendType",item["extendType"]);
	link.setClient("interfaceFailMin",item["interfaceFailMin"]);
	link.setClient("interfaceFailMax",item["interfaceFailMax"]);
	link.setClient("servicedomainResid",item.servicedomainResid);
	if(item.linkDiv == 2 || item.linkDiv == 3){
		setLinkPosition(link);//当曲线或者折线的from或to节点为group时设定link起点或终点位置
	}
	link.setName(item.linkName);
	//字体和颜色
	link.setStyle("label.color","#"+item.fontColor);
	link.setStyle("label.font",item.fontSize + "px 微软雅黑");
	
	//拐点坐标设定
	var points = item["pointList"];
	
	//设置折线和曲线的拖拽点
	if(item.linkType == 2 && points.length == 1){ //表示的是折线
		var point = {x: parseInt(points[0].xPoint), y: parseInt(points[0].yPoint)};
		link.addPoint(point);
	} else if(item.linkType == 1 && points.length == 4){ //曲线(自定义)
		var pointList = new twaver.List();
		for(var i=0;i<points.length;i++){
			var point = {x: parseInt(points[i].xPoint), y: parseInt(points[i].yPoint)};
			pointList.add(point);
		}
		link.setPoints(pointList);
	} else if(item.linkType == 1 && item.linkType !=5 && points.length == 1){ //曲线(自定义以外)
		var pointList = new twaver.List();
		var linkUI = new twaver.canvas.LinkUI(canvasNetwork,link);
			linkUI.setControlPoint({x:points[0]["xPoint"], y:points[0]["yPoint"]});
	}

	//颜色与宽度
	if(item.stdId != null && item.stdId != '0'){
		link.setStyle("link.color", "#" + item.stdLineColor);
		link.setStyle("link.width", item.stdLineWidth);
		setLinkArrow(link,item.stdLineArrow, "#" + item.stdLineColor);
	}else{
		link.setStyle("link.color", "#" + item.lineColor);
		link.setStyle("link.width", item.lineWidth);
		setLinkArrow(link,item.lineArrow, "#" + item.lineColor);
	}
	//实线虚线
	if(item.stdId != null && item.stdId != '0'){ //link的style是引用图例
		if(item.stdLineType == 1){
			link.setStyle('link.pattern', [5, 2]);
		}
	}else{
		if(item.lineType == 1){
			link.setStyle('link.pattern', [5, 2]);
		}
	}
	link.setStyle("select.color","rgba(0,0,150,0.9)");
	link.setStyle("link.bundle.enable",true);
	link.setStyle("link.bundle.expanded",true);

	//设置提示信息
	var toolTip = '';
	if (item.linkDiv == 4) {
		toolTip+="域名：" + item.linkName;
		toolTip+='<br>';
		toolTip+="接口总数：" + item.interfaceTotal;
		toolTip+='<br>';
		toolTip+="接口总调用次数：" + item.callTotal;
		toolTip+='<br>';
		toolTip+="接口总成功率：" + (item.callTotal == 0 ? 0 : 100*item.succTotal/item.callTotal).toFixed(2) + "%";
		toolTip+='<br>';
		toolTip+="接口总失败率：" + (item.callTotal == 0 ? 0 : 100*item.failTotal/item.callTotal).toFixed(2) + "%";
		link.setToolTip(toolTip);
	} else if(item.linkDiv == 0 && item.interfaceId !="" && item.interfaceId != null){
		if (item.interfaceId !="" && item.interfaceId != null){
			toolTip+="接口名称:" + item.interfaceName + ((item.interfaceSoaServiceName != null &&item.interfaceSoaServiceName != '') ?  "-" + item.interfaceSoaServiceName : "");
			toolTip+='<br>';
			toolTip+="服务调用明细统计";
			toolTip+='<br>';
			toolTip+="日调用服务次数：" + (item.servicecallDaycount == null ? "--" : item.servicecallDaycount);
			toolTip+='<br>';
			toolTip+="日调用服务成功次数：" + (item.servicecallDaysucccount == null ? "--" : item.servicecallDaysucccount);
			toolTip+='<br>';
			toolTip+="日调用服务失败次数：" + (item.servicecallDayfailcount == null ? "--" : item.servicecallDayfailcount);
			toolTip+='<br>';
			toolTip+="日调用服务平均响应时间：" + (item.servicecallDayavgresptime == null ? "--" : item.servicecallDayavgresptime) + "ms";
			toolTip+='<br>';
			toolTip+="日调用服务成功率：" + (item.servicecallDaysuccrate == null ? "--" : item.servicecallDaysuccrate) + "%";
			toolTip+='<br>';
			toolTip+="日调用服务失败率：" + (item.servicecallDayfailrate == null ? "--" : item.servicecallDayfailrate) + "%";
			link.setToolTip(toolTip);
		}
	} else {
		if(item["tipInfo"] != null){
			$.each(item["tipInfo"], function(i, n){
				toolTip+=n;
				toolTip+='<br>';
			});
			link.setToolTip(toolTip);
		}
	}
	

	//设置group的连接位置
	if (item["linkDiv"] == 2) {
		if (item["lnodeId"].indexOf("G") > -1) {
			if (item["lgroupPos"] != null) {
				link.setStyle("link.from.position", item["lgroupPos"]);
			}
		} else {
			if (item["rgroupPos"] != null) {
				link.setStyle("link.to.position", item["rgroupPos"]);
			}
		}
	} else if (item["linkDiv"] == 3) {
		if (item["lgroupPos"] != null) {
			link.setStyle("link.from.position", item["lgroupPos"]);
		}
		if (item["rgroupPos"] != null) {
			link.setStyle("link.to.position", item["rgroupPos"]);
		}
	}
	return link;
}

//设定曲线样式
function setExtendType(link,item){
	link.setStyle('link.xradius', 0);
	link.setStyle('link.yradius', 0);
	link.setStyle("link.from.xoffset",-8);
	link.setStyle("link.to.xoffset",5);
	switch (parseInt(item.extendType)){
		case 1:
			link.setStyle('link.type', 'extend.top');
			break;
		case 2:
			link.setStyle('link.type', 'extend.bottom');
			break;
		case 3:
			link.setStyle('link.type', 'extend.left');
			break;
		case 4:
			link.setStyle('link.type', 'extend.right');
			break;
		default: ;
			link.setStyle('link.type', 'orthogonal');
		break;
	}
}

function createLinkLegend(item){
	var A_NENode = elementBox.getDataById("Node_"+item["lnodeId"]);
	var Z_NENode = elementBox.getDataById("Node_"+item["rnodeId"]);
	if(A_NENode == null || Z_NENode==null){
		return null;
	}
	var linkId = item["linkId"];
	if(elementBox.getDataById(linkId) != null){
		return null;
	}
	
	var link = new twaver.Link(linkId, A_NENode, Z_NENode);
	link.setClient("type","Link");
	link.setClient("linkId",linkId);
	link.setClient("stdId",item.stdId);
	link.setClient("linkDiv",item.linkDiv);
	link.setClient("lnodeId",item["lnodeId"]);
	link.setClient("rnodeId",item["rnodeId"]);
	link.setStyle("link.width", item.stdLineWidth);
	link.setStyle("link.color", "#" + item.stdLineColor);

//	link.setName(item.linkName);
//	//字体和颜色
//	link.setStyle("label.position","to"); //设置linkName的位置
//	link.setStyle("label.xoffset",25);
	//设置箭头
	if(item.stdLineArrow != 0){
		setLinkArrow(link,item.stdLineArrow, "#" + item.stdLineColor);	
	}
	//实线虚线
	if(item.stdLineType == 1){
		link.setStyle('link.pattern', [5, 2]);
	}

	link.setStyle("select.color","rgba(0,0,150,0.9)");
	link.setStyle("link.bundle.enable",true);
	link.setStyle("link.bundle.expanded",false);
	
	return link;
}

function setLinkArrow(link, arrow, color){
	switch (arrow) {
	case 0:
		link.setStyle('arrow.from', false);
		link.setStyle('arrow.to', false);
		break;
	case 1:
		link.setStyle('arrow.from.color', color);
		link.setStyle('arrow.from', true);
		break;
	case 2: 
		link.setStyle('arrow.to.color', color);
		link.setStyle('arrow.to', true);
		break;
	case 3: 
		link.setStyle('arrow.from.color', color);
		link.setStyle('arrow.from', true);
		link.setStyle('arrow.to.color', color);
		link.setStyle('arrow.to', true);
		break;
	default: ;
	}
}

/**
 * 删除链路
 */
function deleteLinkById() {
	$("#divgroup").empty();
	var div = document.getElementById("divgroup");
	createHiddenValue(div,"topoId",topoId);
	//创建表单数据
	elementBox.getSelectionModel().getSelection().forEach(function (element) {
		if (element instanceof twaver.Link) {
        	var linkId = element.getClient("linkId");
        	createHiddenValue(div,"linkList",linkId);
        }
    });
	
	$.ajax({
		type: "POST",
		url : ctxBase + "/index/network/topo/deleteLinkById",
		data : $('#formGroup').serialize(),
		//async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
		    //数据接口成功返回
			if(data == "success"){
				showTipMessage("链路删除成功！",150,20);
			}else{
				showTipMessage("链路删除失败,请刷新页面重试！",150,20);
			}
		},
		error : function() {
			alert("error");
		}
	});
}

/**
 * 创建网元组
 * @param groupName 网元组名称
 * @returns {twaver.Group}
 */
function createGroupByName(groupName){
	var group = new twaver.Group();
	group.setName(groupName);
	group.setWidth(48);
	group.setHeight(48);
    //group.setStyle('group.fill.color', "#8DF135");
	group.setStyle('group.fill.color', "#E8EEF7");
    group.setStyle('group.padding', 2);
    group.setStyle('group.shape', 'roundrect');
    
    if('SYS' == topoType) {
    	group.setExpanded(true);
    } else {
    	group.setExpanded(false);
    }
    
    return group;
}



/**
 * 标题双击可编辑
 */
function initTitleEditEvent(){
	function enterIn(evt){
		var evt=evt?evt:(window.event?window.event:null);
		if (evt.keyCode==13){
			if(currentElement){
				var value = titleInput.value;
				if(value == null || value == ""){
					showTipMessage("请输入拓扑标题！",150,20);
				}else{
					saveTopoInfo(value,"");
				}
				titleInput.style.display='none';
			}
		}
	}
	titleInput.onkeydown = enterIn;
	
	network.addInteractionListener(function (e){
		if(e.kind === 'doubleClickElement'){
			var cx = network.getViewRect().x;
			var cy = network.getViewRect().y;
			currentElement = e.element;
			if(currentElement.getClient('type') != "Title") return;
			
			var cl = currentElement.getCenterLocation();
			var zoom = network.getZoom();
			var style = titleInput.style;
			style.padding = '0';
			style.margin = '0';
			style.position = 'absolute';
			titleInput.value = currentElement.getName();
			var titleWidth = titleInput.value.length*42+10;
			var titleHeight = 42;
			style.left = (cl.x * zoom + (-cx)) - (titleWidth-currentElement.getWidth())/2*zoom + 'px';
			style.top = (cl.y * zoom + (-cy)) + (titleHeight*1/4)*zoom+ 'px';
			titleWidth = titleWidth*zoom;
			titleHeight = titleHeight *zoom;
			var fontSize = (30*zoom);
			if(titleWidth < 120){
				titleWidth = 120;
			}
			style.width = titleWidth + 'px';
			if(titleHeight < 15){
				titleHeight = 15;
			}
			style.height = titleHeight + 'px';
			if(fontSize < 10){
				fontSize = 10;
			}
			style.fontSize = fontSize +'px';
			style.display='';
		    style.zIndex = 100;
		    var main = document.getElementById('main');
		    main.appendChild(titleInput);
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
function addAlarm(alarm,alarmID, elementID, alarmSeverity) {
	var alarm = new twaver.Alarm(alarmID, elementID, alarmSeverity);
	alarm.setClient("alarmData",alarm);
	alarm.setToolTip(alarm["ALARM_CAUSE"]);
	elementBox.getAlarmBox().add(alarm);
}

/**
 * 创建隐藏域表单数据
 * @param div图层
 * @param name 名称
 * @param value 值
 */
function createHiddenValue(div,name,value){
	var length = $("#" + ipt).length;
	var ipt = null;
	if(length == 0){
		ipt = document.createElement("input");
		ipt.setAttribute("type","hidden");
		ipt.setAttribute("name",name);
		ipt.setAttribute("value",value);
		div.appendChild(ipt);
	}else{
		ipt = $("#"+ipt);
		ipt.setAttribute("type","hidden");
		ipt.setAttribute("name",name);
		ipt.setAttribute("value",value);
	}
	
}

/**
 * 获取地址栏参数
 * @param key
 */
function getUrlParam(key){
	var url = document.URL;
	var stridx = url.indexOf("?");
	if(stridx > 0){
		var str = url.substr(stridx+1);
		strs = str.split('&');
		for(i=0;i<strs.length;i++){
			if(strs[i].split('=')[0] == key){
				var value = strs[i].split('=')[1];
				return value;
			}
		}
	}
	return "";
}

/**
 * 刷新周期设置
 */
function refreshPeriodSetup(){
	layer.open({
		type : 2, //iframe 弹出
		title : '刷新周期设置',
		shade : 0.3, //遮罩浓度
		fix : false, //最大化按钮
		area : [ "38%", "30%" ], //宽高比例
		skin : 'layui-layer-rim', //边框Q
		content : [ ctxBase + '/index/network/topo/networkJump?moduleName=refresh_period', 'yes' ]
	});
}

/**
 * 单击拓扑取消弹出层并清除数据
 * @param e
 */
function clickCancelLayerAndData(e){
	network.getView().removeEventListener('click', clickCancelLayerAndData);
	$("#divgroup").empty();
	$("#tiGroupName").val('');
	$("#divGroupEdit").hide();
	$("#diaolgView").hide();
	$("#tipmsg").html('');
}

/**
 * 创建网络组
 * ma_he add
 * @return
 */
function showCreateGroup() {
	var selectItems = new twaver.List();
	elementBox.getSelectionModel().getSelection().forEach(function (element) {
        if (element instanceof twaver.Node) {
        	selectItems.add(element);
        }
    });
	
    if (selectItems.size() < 2) {
    	showTipMessage("请至少选择2台设备！",150,20);
    } else {
    	$("#tiGroupName").show();
    	$("#tiColorName").hide();
    	$("#lblGroupName").html("网络组名称：");
    	$("#divGroupEdit").attr("style","width:290px;padding:2px 5px;background-color:#E8F2FE;margin-left:140px;");
    	$("#divGroupEdit").show();
    	network.getView().addEventListener('click', clickCancelLayerAndData);
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
 * 弹出图层消息
 * @param msg 消息内容
 * @param divwidth 弹出框宽度
 * @param divheight 弹出框高度
 */
function showTipMessage(msg, divwidth, divheight) {
	var left = ($(document).width() - divwidth) / 2;
	var top = ($(document).height() - divheight) / 2;
	$("#diaolgView").attr("style", "width:" + divwidth + "px;height:" + divheight + "px;"
		+ "background-color:#E2ECF8; position: absolute;padding:10px; top:" + top + ";left:" + left + ";");

	$("#tipmsg").html(msg);
	$("#diaolgView").show();

	network.getView().addEventListener('click', clickCancelLayerAndData);
	setTimeout(function() {
		clickCancelLayerAndData();
	}, 2000);
}

/**
 * 保存拓扑标题信息
 * @param title
 * @param bgcolor
 */
function saveTopoInfo(title,bgcolor){

	var topoJsonStr = '{ "topoId":"'+topoId+'"';
	var isTitle = false;
	if(title != null && title != ""){
		topoJsonStr = topoJsonStr + ',"topoName":"'+title+'"';
		isTitle = true;
	}
	if(bgcolor != null && bgcolor != ""){
		topoJsonStr = topoJsonStr + ',"topoBgcolor":"'+bgcolor+'"';
	}
	topoJsonStr = topoJsonStr +' }';
	
	$("#divgraphnode").empty();
	for(var i=0;i<2;i++){
		var div = document.getElementById("divgraphnode");
		createHiddenValue(div,"topoJsonInfo",topoJsonStr);
	}
	$.ajax({
		type: "POST",
		url : ctxBase + "/index/network/topo/saveTopoInfo",
		data : $('#formGraphNode').serialize(),
		//async : false, //同步执行
		dataType : "json", //返回数据形式为json
		success : function(data) {
		    //数据接口成功返回
			if(data == "success"){
				showTipMessage("修改成功！",150,20);
				if(isTitle){
					currentElement.setName(title);
				}else{
					network.getView().style.backgroundColor = bgcolor;
				}
				$("#divGroupEdit").hide();
				$("#tiGroupName").val('');
			}else{
				showTipMessage("修改失败,请刷新页面重试！",150,20);
			}
			$("#divgraphnode").empty();
		},
		error : function() {
			showTipMessage("修改失败,请刷新页面重试！",150,20);
			$("#divgraphnode").empty();
		}
	});
}



/**
 * 标题信息
 * @param {} titleDev
 */
function showTitleNode(titleDev){
	//标题信息
	var titleId = "Title_"+titleDev["resourceId"];
	if(elementBox.getDataById(titleId) == null){
		var titleNode = createTitleNode(titleDev,"network");
		elementBox.add(titleNode);
	}
	//$("#leftTimeInfo").html("最后更新时间：" + titleDev['model']);
	network.getView().style.backgroundColor = titleDev['deviceDesc'];
}
/**
 * 根据Json数据绘制链路
 * @param linkList
 */
function drawLinkByJsonList(linkList){
	var linkData = eval(linkList);
	var linkLen = linkData.length;
	for(var i = 0; i < linkLen; i++)
	{
		var item = linkData[i];
		var link = createLink(item,"network");
		if(link == null) continue;
		elementBox.add(link);
	}
}