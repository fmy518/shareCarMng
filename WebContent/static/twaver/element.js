var DataUtils = {};
			//var group = new twaver.Group("groupId");
			//group.setName("这个分组样式好丑好丑啊");
			//group.setWidth(48);
			//group.setHeight(48);
			//group.setStyle('group.fill.color', "#E8EEF7");
			//group.setStyle('group.padding', 10);
			//group.setStyle('group.shape', 'roundrect');
			//group.setExpanded(true);
			//group.setStyle("icons.names","statu1");
			//group.setStyle("icons.position","topright");
			//elementBox.add(group);
			//group.addChild(node);

//创建Group对象
DataUtils.createGroup=function(data){
	var group = new twaver.Group(data["groupId"]);
	group.setName(data["groupName"]);
	return group;
}

//转换GROUP JSON STR 成 GROUP元素
DataUtils.jsonGroup2Group=function(dataList){
	for(i=0;i<dataList.length;i++){
		var group = DataUtils.createGroup(dataList[i]["group"]);
		var nodeIdList = dataList[i]["list"];
		nodeIdList.forEach(function(e){
			var node = elementBox.getDataById(e);
			group.addChild(node);
		});
		
		elementBox.add(group);
	}
	
}


//创建NODE元素
DataUtils.createNode=function(data){
	var node = new twaver.Node(data["resourceId"]);
	node.setName(data["name"]);
	node.setImage(data["imageName"].toLowerCase());
	node.setLocation(data["posX"],data["posY"]);
	var clientKeyList = data["clientKeyList"];
	for(z=0;z<clientKeyList.length;z++){
		if(data[clientKeyList[z]]!=null){
			node.setClient(clientKeyList[z],data[clientKeyList[z]]);
		}
	}
	
	return node;
}

//转换NODE JSON STR 成NODE元素
DataUtils.jsonNode2Node=function(dataList){
	for(i=0;i<dataList.length;i++){
		var node = DataUtils.createNode(dataList[i]);
		//测试用避免脏数据的出现，这个地方感觉迟早是要删掉的。if判断哦
		var nodeId = node.getId();
		if(elementBox.getDataById(nodeId)==null){
			elementBox.add(node);
		}else{
			
		}
		
	}
	
}

//创建标题
DataUtils.createTitle=function(data){
	var title = DataUtils.createNode(data);
	title.setStyle("label.font","30px 微软雅黑");
	title.setStyle("label.position","right");
	title.setStyle("select.style","shadow");
	title.setStyle("select.color","rgba(0,0,150,0.7)");
	title.setToolTip("双击可修改标题，回车保存！");
	title.setImage("");
	elementBox.add(title);
}

DataUtils.createHiddenForm=function(e){
	//获取当前元素的x和y
	//left x-1/2width   bottom y-1/2height
	//创建text
	alert("aaa");
}

//创建link
DataUtils.createLink=function(data){
	var fromNode = elementBox.getDataById(data["device1ResourceId"]);			//fromID
	var toNode = elementBox.getDataById(data["device2ResourceId"]);				//toId
	var link = new twaver.Link(data["device1ResourceId"]+data["name"]+data["device2ResourceId"],fromNode,toNode);				// linkId fromNode toNode
	LinkUtils.setStyle(link,"ima-arrows");
	return link;
}

//转换linkJsonStr成link元素
DataUtils.jsonLink2Link=function(dataList){
	for(i=0;i<dataList.length;i++){
		var link = DataUtils.createLink(dataList[i]);
		elementBox.add(link);
	}
}

//创建告警
DataUtils.createAlarm=function(data){
	
	var severity=twaver.AlarmSeverity.CRITICAL;
	if(data["ALARM_LEVEL"]=="1"){
		severity = twaver.AlarmSeverity.CRITICAL;
	}
	var alarm = new twaver.Alarm(data["RES_OBJ_ID"]+Math.random(),data["RES_OBJ_ID"], twaver.AlarmSeverity.INDETERMINATE);		//告警ID，关联节点ID，告警级别
	alarm.setToolTip(data["ALARM_CAUSE"]);
	var obj = elementBox.getDataById(data["RES_OBJ_ID"]);
	if(obj instanceof twaver.Node){
		
	}
	if(obj instanceof twaver.Link){
		alert("这特么的是Link啊");
	}
	return alarm;
	
	
}

//转换告警jsonStr成告警元素
DataUtils.jsonAlarm2Alarm=function(dataList){
	for(i=0;i<dataList.length;i++){
		var alarm = DataUtils.createAlarm(dataList[i]);
		
		alarmBox.add(alarm);
	}
}



//获得所有Link
DataUtils.getAllLink=function(){
	return DataUtils.getAllElementByType("Link");
}
//获得所有Node
DataUtils.getAllNode=function(){
	return DataUtils.getAllElementByType("Node");
}


//获得所有选中Link
DataUtils.getAllSelectionLink=function(){
	return DataUtils.getSelectionElement("Link");
}
//获得所有选中Node
DataUtils.getAllSelectionNode=function(){
	return DataUtils.getSelectionElement("Node");
}

//根据类型获得选中Element
DataUtils.getSelectionElement=function(type){
	var elementArray = new twaver.List();
	elementBox.getSelectionModel().getSelection().forEach(function(element){
		if(type=="Node"){
			if(element instanceof twaver.Node){
				elementArray.add(element);
			}
		}
		if(type=="Link"){
			if(element instanceof twaver.Link){
				elementArray.add(element);
			}
		}
	});
	return elementArray;
}


//获得类型获得Element    type:"Node"||"Link"
DataUtils.getAllElementByType=function(type){
	var elementArray = new twaver.List();
	elementBox.getDatas().forEach(function(element){
		if(type=="Node"){
			if(element instanceof twaver.Node){
				elementArray.add(element);
			}
		}
		if(type=="Link"){
			if(element instanceof twaver.Link){
				elementArray.add(element);
			}
		}
	});
	return elementArray;
}



