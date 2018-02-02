/**
 * 工具栏相关逻辑
 * 
 * @author CsWang
 * @date 2015-12-03
 */
var InterValObjComm; // timer变量，控制时间
var curCount = 1;// 定时器默认执行次数
var loginname=parent.$("#topo_loginname").val();
if(loginname==null){
	loginname=parent.parent.$("#topo_loginname").val();
}

/**
 * 创建工具栏
 * 
 * @param network
 * @returns
 */
function createNetworkToolbar(network, type) {
	var baseUrl = ctxBase + "/static/images/network/toolbar/";
	var toolbar = document.createElement('div');
	if(!editModel){
		demo.Util.addButton(toolbar, '浏览模式', "", function() {
			// 找到所在iFrame，更新src的editModel
			var curIframe = $(window.frameElement);
			var href = window.location.href;
			if(href.indexOf('&editModel') > -1){
				href = href.substring(0, href.indexOf('&editModel'));
			}
			curIframe.attr("src", href + '&editModel=1&t=' + new Date().getTime());
		});
	}else{
		/*if(loginname=='1'){*/
			demo.Util.addButton(toolbar, '编辑模式', "", function() {
				// 找到所在iFrame，更新src的editModel
				var curIframe = $(window.frameElement);
				var href = window.location.href;
				if(href.indexOf('&editModel') > -1){
					href = href.substring(0, href.indexOf('&editModel'));
				}
				curIframe.attr("src", href + '&editModel=0&t=' + new Date().getTime());
			});
		/*}else{
			alert('用户权限不足，只能浏览模式权限!');
			demo.Util.addButton(toolbar, '浏览模式', "", function() {
				// 找到所在iFrame，更新src的editModel
				var curIframe = $(window.frameElement);
				var href = curIframe.attr("src");
				if(href.indexOf('&editModel') > -1){
					href = href.substring(0, href.indexOf('&editModel'));
				}
				curIframe.attr("src", href + '&editModel=1&t=' + new Date().getTime());
			});
			editModel=false;
		}*/
		
	}
	
	// div/name/src/callback
	demo.Util.addButton(toolbar, '选择', baseUrl + 'select.png', function() {
		if (twaver.Util.isTouchable) {
			network.setTouchInteractions();
		} else {
			network.setDefaultInteractions();
		}
	});
	demo.Util.addButton(toolbar, '放大', baseUrl + 'zoomIn.png', function() {
		network.zoomIn();
		showScaling();
	});
	demo.Util.addButton(toolbar, '缩小', baseUrl + 'zoomOut.png', function() {
		network.zoomOut();
		showScaling();
	});
	demo.Util.addButton(toolbar, '还原1:1', baseUrl + 'zoomReset.png', function() {
		network.zoomReset();
		showScaling();
	});
	demo.Util.addButton(toolbar, '自适应', baseUrl + 'zoomOverview.png', function() {
		network.zoomOverview();
		showScaling();
	});
	if(editModel){
		demo.Util.addButton(toolbar, '全选节点', baseUrl + 'select_anode.png', function() {
			SelectAllNode();
		});
		demo.Util.addButton(toolbar, '全选链路', baseUrl + 'select_alink.png', function() {
			SelectAllLink();
		});
		
		var sizeItems = [ '同步大小', '同步最大', '同步最小' ];
		var sizeType = document.createElement('select');
		sizeType.id = "sltLayType";
		sizeItems.forEach(function(item) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(item));
			option.setAttribute('value', item);
			sizeType.appendChild(option);
		});
		sizeType.addEventListener('change', function() {
			doChangeNodeSize(sizeType);
		}, false);
		toolbar.appendChild(sizeType);
		//对齐方式
		var items = [ '对齐方式', '顶端对齐', '底端对齐', '左对齐', '右对齐', '水平居中', '垂直居中', '横向分布', '纵向分布' ];
		var layouterType = document.createElement('select');
		layouterType.id = "sltLayType";
		items.forEach(function(item) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(item));
			option.setAttribute('value', item);
			layouterType.appendChild(option);
		});
		layouterType.addEventListener('change', function() {
			doLayoutTypeNode(layouterType);
		}, false);
		toolbar.appendChild(layouterType);
	}
	demo.Util.addButton(toolbar, '刷新拓扑', baseUrl + 'refresh.png', function() {
		refreshTopo();
	});
	
	demo.Util.addButton(toolbar, '导出拓扑图', baseUrl + 'export.png', function() {
		network.zoomReset();
		InterValObjComm = window.setInterval(SetSaveImageMsg, 1000); // 启动计时器，1秒执行一次
	});
	if (demo.Util.isFullScreenSupported()) {
		demo.Util.addButton(toolbar, '全屏', baseUrl + 'fullscreen.png', function() {
			demo.Util.toggleFullscreen();
		});
	}
	if(editModel){
		demo.Util.addButton(toolbar, '保存坐标', baseUrl + 'save.png', function() {
			saveAllNodePostion();
		});

		if (type == "network") {
			demo.Util.addButton(toolbar, '星型布局', baseUrl + 'star_link.png', function() {
				showStartLink();
			});
			demo.Util.addButton(toolbar, '总线型布局', baseUrl + 'bus_link.png', function() {
				showBusLink();
			});
		}
		demo.Util.addButton(toolbar, '创建图例', baseUrl + 'link_std_icon.png', function() {
			addTopoStandard();
		});
		demo.Util.addButton(toolbar, '创建链路', baseUrl + 'link_icon.png', function() {
			showCreateLink();
		});
		demo.Util.addButton(toolbar, '刷新频率', baseUrl + 'clock.png', function() {
			showTopoFreq();
		});
		demo.Util.addButton(toolbar, '新增设备/系统', baseUrl + 'add.png', function() {
			getTopoNewDevice(0,0);
		});
		demo.Util.addButton(toolbar, '创建网络组', baseUrl + 'group_icon.png', function() {
			showCreateGroup();
		});
		demo.Util.addButton(toolbar, '自定义网络组', baseUrl + 'group_define_icon.png', function() {
			addToGroup();
		});
		if (type == "network") {
			demo.Util.addButton(toolbar, '设置拓扑背景', baseUrl + 'bgcolor.png', function() {
				showBgColorText();
			});
		}
		demo.Util.addButton(toolbar, '提交修改记录', baseUrl + 'node_icon.png', function() {
			uploadTopoImg();
		});
	}
	demo.Util.addButton(toolbar, '查看修改历史记录', baseUrl + 'magnify.png', function() {
		getTopoHistory();
	});
	
/*	if (topoView=='app_topo') {
		demo.Util.addButton(toolbar, '查看业务应用功能运行情况', baseUrl + 'linksubnetwork_icon.png', function() {
			runAppsystemDatail();
		});
	}*/

	var groupDiv = document.createElement('div');
	groupDiv.id = "divGroupEdit";
	groupDiv.style.display = "none";
	demo.Util.addLabel(groupDiv, "lblGroupName", "网络组名称：");
	var groupinput = demo.Util.addInput(groupDiv, "tiGroupName", "",
			function() {
			});
	var colorinput = demo.Util.addInput(groupDiv, "tiColorName", "",
			function() {
			});
	colorinput.className = "jscolor";
	demo.Util.addButton(groupDiv, "确定", null, function() {
		btnOkClick();
	});
	toolbar.appendChild(groupDiv);

	return toolbar;
}

// 显示缩放比例
function showScaling() {
	var currentZoomValue = network.getZoom();
	var scaling = Math.round(currentZoomValue * 100) + "%";
	$("#leftscaling").text("显示比例：" + scaling);
}

// 按比例缩放
function changeByScaling(scaling) {
	if (scaling == "" || isNaN(scaling) || scaling == "0") {
		showTipMessage("请输入正确的显示百分比例！", 150, 20);
	} else {
		network.setZoom(scaling / 100);
	}
	showScaling();
}

/**
 * 按钮单击 1.修改背景色 2.创建设备 3.创建链路 4.创建网络组
 */
function btnOkClick() {
	var label = $("#lblGroupName").html();
	if (label == "拓扑背景色：") {
		var txtValue = $("#tiColorName").val();
		if (txtValue == null || txtValue == "") {
			return;
		}
		saveTopoInfo("", txtValue);
	} else if (label == "链路名称：") {
		var txtValue = $("#tiGroupName").val();
		if (txtValue == null || txtValue == "") {
			return;
		}
		createLinkByNode(txtValue);
	} else if (label == "网络组名称：") {
		var txtValue = $("#tiGroupName").val();
		if (txtValue == null || txtValue == "") {
			return;
		}
		createNetGroup(txtValue);
	} else if (label == "刷新频率(m)：") {
		var txtValue = $("#tiGroupName").val();
		if (txtValue == null || txtValue == "") {
			return;
		}
		if(isNaN(txtValue)){
			alert("请输入数字");
			return false;
		}
		var numValue = parseInt(txtValue);
		window.setInterval("refreshTopo()",numValue*60*1000);
		saveTopoInfo('','',txtValue);
	}
}

//新增拓扑图例
function addTopoStandard() {
	layer.open({
		type : 2, // iframe 弹出
		title : '图例自定义',
		shade : 0.3, // 遮罩浓度
		fix : false, // 最大化按钮
		area : [ "50%", "45%" ], // 宽高比例
		skin : 'layui-layer-rim', // 边框Q
		content : [ ctxBase + "/index/network/topo/networkJump?moduleName=define_link&topoId=" + topoId + "&topoType=" + topoType + "&model=" + 1, "yes" ]
	});
}

//获取拓扑新增设备
function getTopoNewDevice(x,y) {
	var title = "新增设备/系统";
	var content = [ ctxBase + "/index/network/topo/networkJump?moduleName=topo_devices&topoId=" + topoId + "&topoType=" + topoType + "&topoView=" + topoView +"&posX="+x+"&posY="+y + "&lnodeResId="+ lnodeResId + "&rnodeResId=" + rnodeResId, "yes" ];
	if (model == "MID") {
		title = "新增中间件";
		content = [ ctxBase + "/index/network/topo/networkJump?moduleName=define_middleline&appsystemId=" + appsystemId+ "&topoId=" + topoId + "&topoType=" + topoType +"&posX="+x+"&posY="+y, "yes" ];
	}
	layer.open({
		type : 2, // iframe 弹出
		title : title,
		shade : 0.3, // 遮罩浓度
		fix : false, // 最大化按钮
		area : [ "80%", "70%" ], // 宽高比例
		skin : 'layui-layer-rim', // 边框Q
		content : content
	});
}

// 获取拓扑图修改信息
function getTopoHistory() {
	layer.open({
		type : 2, // iframe 弹出
		title : '拓扑修改历史记录',
		shade : 0.3, // 遮罩浓度
		fix : false, // 最大化按钮
		area : [ "50%", "45%" ], // 宽高比例
		skin : 'layui-layer-rim', // 边框Q
		content : [ ctxBase + "/index/network/topo/networkJump?moduleName=topoupinfo&topoId=" + topoId + "&topoType=" + topoType, "yes" ]
	});
}

//获取拓扑图修改信息
function runAppsystemDatail() {
	layer.open({
		type : 2, // iframe 弹出
		title : false,
		shade : 0.3, // 遮罩浓度
		fix : false, // 最大化按钮
		area : [ "50%", "45%" ], // 宽高比例
		skin : 'layui-layer-rim', // 边框Q
		content : [ ctxBase + "/run/runJumpD?moduleName=run_application_detail&resourceid=" + topoType, "yes" ]
	});
}

// 上传TOPO缩略图
function uploadTopoImg() {
	network.zoomOverview();
	var canvas = network.toCanvas(network.realWidth, network.realHeight);
	
	var Pic = canvas.toDataURL("image/png");
	Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "")

	var data = {
		"imageData" : Pic,
		"topoId" : topoId,
		"topoType" : topoType
	};

	$.post(ctxBase + "/index/network/topo/topoimg",data,function(result) {
						if (result == "") {
							console.log("截图上传失败！！！");
						} else {
							layer.open({
										type : 2, // iframe 弹出
										title : '拓扑修改记录',
										shade : 0.3, // 遮罩浓度
										fix : false, // 最大化按钮
										area : [ "50%", "45%" ], // 宽高比例
										skin : 'layui-layer-rim', // 边框Q
										content : [
												ctxBase + "/index/network/topo/toUpTopo?moduleName=updatetopo_info&topoId="
														+ topoId + "&topoType="
														+ topoType + "&img="
														+ result, "yes" ]
									});
						}
					});

	network.zoomReset();
}

// timer处理函数
function SetSaveImageMsg() {
	if (curCount == 0) {
		saveAsPic();
		window.clearInterval(InterValObjComm);// 停止计时器
	} else {
		curCount--;
	}
}
/**
 * 另存为图片
 */
function saveAsPic() {
	var canvas;
	if (network.getCanvasSize) {
		canvas = network.toCanvas(network.getCanvasSize().width, network
				.getCanvasSize().height);
	} else {
		canvas = network.toCanvas(network.getView().scrollWidth, network
				.getView().scrollHeight);
	}
	if (twaver.Util.isIE) {
		var w = window.open();
		w.document.open();
		w.document.write("<img src='" + canvas.toDataURL() + "'/>");
		w.document.close();
	} else {
		window.open(canvas.toDataURL(), 'network.png');
	}
}
/**
 * 全选节点
 * 
 * @return
 */
function SelectAllNode() {
	selectionModel.clearSelection();
	var selectNode = new twaver.List();
	elementBox.getDatas().forEach(function(element) {
		if (element instanceof twaver.Node) {
			selectNode.add(element);
		}
	});
	selectionModel.appendSelection(selectNode);
}
/**
 * 全选链路
 * 
 * @return
 */
function SelectAllLink() {
	selectionModel.clearSelection();
	var selectItems = new twaver.List();
	elementBox.getDatas().forEach(function(element) {
		if (element instanceof twaver.Link) {
			selectItems.add(element);
		}
	});
	selectionModel.appendSelection(selectItems);
}

/**
 * 星型布局
 */
function showStartLink() {
	elementBox.getDatas().forEach(function(element) {
		if (element instanceof twaver.Link) {
			element.setStyle("link.type", "arc");// vertical//horizontal
			element.setStyle("link.split.by.percent", false);
		}
	});
}
/**
 * 总线型布局
 */
function showBusLink() {
	elementBox.getDatas().forEach(function(element) {
		if (element instanceof twaver.Link) {
			element.setStyle("link.type", "orthogonal.H.V");// orthogonal.vertical
			element.setStyle("link.split.by.percent", true);
		}
	});
}
/**
 * 显示流量
 */
function getLinkRate(code) {
	var num = 0;
	if (code < 1024) {
		return code + "Kbps";
	} else if (code >= 1024 && code < 1024 * 1024) {
		num = code / 1024;
		return Math.round(num) + "Mbps";
	} else if (code >= 1024 * 1024) {
		num = code / (1024 * 1024);
		return Math.round(num * 10) / 10 + "Gbps";
	}

	return code + "Kbps";
}
/**
 * 根据流量计算宽度
 */
function getLinkWidth(code) {
	if (code != null && code != "") {
		if (code < 1024) {
			return 1;
		} else if (code >= 1024 && code <= 1024 * 1024) {
			return 1 + (5 * code) / (1024 * 1024 - 1900);
		} else if (code >= 1024 * 1024) {
			return 6;
		}
	} else {
		return 1;
	}
	return 1;
}
/**
 * 同步大小
 * 
 * @param selectSize
 *            同步大小
 */
function doChangeNodeSize(selectSize) {
	var sizeType = selectSize.value;
	if (sizeType == "同步大小") {
		return;
	}
	var selectItems = new twaver.List();
	var maxHeight = 0;
	var maxWidth = 0;
	var minHeight = 0;
	var minWidth = 0;
	var count = 0;
	elementBox.getSelectionModel().getSelection().forEach(function(element) {
		if (element instanceof twaver.Node) {
			var nodeHeight = element.getHeight();
			var nodeWidth = element.getWidth();
			if (count == 0) {
				maxHeight = nodeHeight;
				maxWidth = nodeWidth;
				minHeight = nodeHeight;
				minWidth = nodeWidth;
				count++;
			} else {
				if ((nodeHeight + nodeWidth) > (maxHeight + maxWidth)){
					maxHeight = nodeHeight;
					maxWidth = nodeWidth;
				}
				if ((nodeHeight + nodeWidth) < (minHeight + minWidth)){
					minHeight = nodeHeight;
					minWidth = nodeWidth;
				}
			}
			selectItems.add(element);
		}
	});

	if (selectItems.size() < 2) {
		showTipMessage("请至少选择2台设备！", 150, 20);
		return;
	}
	if (sizeType == "同步最大") {
		changeNodeSize(maxHeight, maxWidth, selectItems);
	} else if (sizeType == "同步最小") {
		changeNodeSize(minHeight, minWidth, selectItems);
	}
	selectSize.value = "同步大小";
}


/**
 * 大小设置
 * 
 * @param height
 *            高度
 * @param width
 *            宽度
 * @param selectItems
 *            选择的节点
 *            
 */
function changeNodeSize(height, width, selectItems) {
	selectItems.forEach(function(element) {
		element.setHeight(height);
		element.setWidth(width);
	});
}

/**
 * 对齐方式
 * 
 * @param selectLayout
 *            对齐方式
 */
function doLayoutTypeNode(selectLayout) {
	var layoutType = selectLayout.value;
	if (layoutType == "对齐方式") {
		return;
	}
	var selectItems = new twaver.List();
	elementBox.getSelectionModel().getSelection().forEach(function(element) {
		if (element instanceof twaver.Node) {
			selectItems.add(element);
		}
	});

	if (selectItems.size() < 2) {
		showTipMessage("请至少选择2台设备！", 150, 20);
		return;
	}
	if (layoutType == "左对齐" || layoutType == "右对齐") {
		var leftX = selectItems.get(0).getX();
		dictionByType(selectItems, leftX, layoutType);
	} else if (layoutType == "顶端对齐" || layoutType == "底端对齐") {
		var topY = selectItems.get(0).getY();
		dictionByType(selectItems, topY, layoutType);
	} else if (layoutType == "水平居中" || layoutType == "垂直居中") {
		centerByType(selectItems, layoutType);
	} else if (layoutType == "横向分布" || layoutType == "纵向分布") {
		siteByType(selectItems, layoutType);
	}

	selectLayout.value = "对齐方式";
}

/**
 * 对齐设置
 * 
 * @param {}
 *            selectItems 选择节点集合
 * @param valuePos
 *            对齐数值
 * @param layoutType
 *            布局方式
 */
function dictionByType(selectItems, valuePos, layoutType) {
	selectItems.forEach(function(element) {
		if (layoutType == "左对齐") {
			if (element.getX() < valuePos) {
				valuePos = element.getX();
			}
		} else if (layoutType == "右对齐") {
			if (element.getX() > valuePos) {
				valuePos = element.getX();
			}
		} else if (layoutType == "顶端对齐") {
			if (element.getY() < valuePos) {
				valuePos = element.getY();
			}
		} else if (layoutType == "底端对齐") {
			if (element.getY() > valuePos) {
				valuePos = element.getY();
			}
		}
	});
	selectItems.forEach(function(element) {
		if (layoutType == "左对齐" || layoutType == "右对齐") {
			element.setX(valuePos);
		} else if (layoutType == "顶端对齐" || layoutType == "底端对齐") {
			element.setY(valuePos);
		}
	});
}
/**
 * 水平居中、垂直居中
 */
function centerByType(selectItems, layoutType) {
	var minPos = 0;
	var maxPos = 0;
	if (layoutType == "垂直居中") {
		minPos = selectItems.get(0).getX();
		maxPos = selectItems.get(0).getX();
		selectItems.forEach(function(element) {
			if (element.getX() < minPos) {
				minPos = element.getX();
			}
			if (element.getX() > maxPos) {
				maxPos = element.getX();
			}
		});
		var centerPos = (maxPos + minPos) / 2;
		selectItems.forEach(function(element) {
			element.setX(centerPos);
		});
	} else if (layoutType == "水平居中") {
		minPos = selectItems.get(0).getY();
		maxPos = selectItems.get(0).getY();
		selectItems.forEach(function(element) {
			if (element.getY() < minPos) {
				minPos = element.getY();
			}
			if (element.getY() > maxPos) {
				maxPos = element.getY();
			}
		});
		var centerPos = (maxPos + minPos) / 2;
		selectItems.forEach(function(element) {
			element.setY(centerPos);
		});
	}
}

/**
 * 横向分布、纵向分布
 */
function siteByType(selectItems, layoutType) {
	var minPos = 0;
	var maxPos = 0;
	if (layoutType == "横向分布") {
		minPos = selectItems.get(0).getX();
		maxPos = selectItems.get(0).getX();
		selectItems.sort(function(node1, node2) {
			if (node1.getX() > node2.getX()) {
				return 1;
			} else {
				return -1;
			}
		});
		selectItems.forEach(function(element) {
			if (element.getX() < minPos) {
				minPos = element.getX();
			} else if (element.getX() > maxPos) {
				maxPos = element.getX();
			}
		});
		var sitePos = (maxPos - minPos) / (selectItems.size() - 1);
		selectItems.forEach(function(element) {
			element.setX(minPos);
			minPos = minPos + sitePos;
		});
	} else if (layoutType == "纵向分布") {
		minPos = selectItems.get(0).getY();
		maxPos = selectItems.get(0).getY();
		selectItems.sort(function(node1, node2) {
			if (node1.getY() > node2.getY()) {
				return 1;
			} else {
				return -1;
			}
		});
		selectItems.forEach(function(element) {
			if (element.getY() < minPos) {
				minPos = element.getY();
			} else if (element.getY() > maxPos) {
				maxPos = element.getY();
			}
		});
		var sitePos = (maxPos - minPos) / (selectItems.size() - 1);
		selectItems.forEach(function(element) {
			element.setY(minPos);
			minPos = minPos + sitePos;
		});
	}
}

function showTopoFreq() {
	$("#tiGroupName").show();
	$("#tiColorName").hide();
	$("#lblGroupName").html("刷新频率(m)：");
	$("#divGroupEdit").attr("style", "width:290px;padding:2px 5px;background-color:#E8F2FE;margin-left:140px;");
	$("#divGroupEdit").show();
	network.getView().addEventListener('click', clickCancelLayerAndData);
}



/**
 * 创建链路
 */
function showCreateLink() {
	var selectItems = new twaver.List();
	elementBox.getSelectionModel().getSelection().forEach(function(element) {
		if (element instanceof twaver.Node || element instanceof twaver.Group) {
			if (element.getClient("nodeType") == 3 
					|| element.getClient("nodeType") == 4 
					|| element.getClient("groupType") == 1) {
				return;
			}
			selectItems.add(element);
		}
	});

	if (selectItems.size() != 2) {
		showTipMessage("请选择2台设备！",150,20);
	} else {
		layer.open({
			type : 2, // iframe 弹出
			title : '链路自定义',
			shade : 0.3, // 遮罩浓度
			fix : false, // 最大化按钮
			scrollbar: false, //不显示滚动条
			area : [ "50%", "45%" ], // 宽高比例
			skin : 'layui-layer-rim', // 边框Q
			content : [ ctxBase + "/index/network/topo/networkJump?moduleName=define_link&topoId=" + topoId + "&topoType=" + topoType + "&topoView=" + topoView + "&model=" + 2, "yes" ]
		});
	}
	
	
	/*elementBox.getSelectionModel().getSelection().forEach(function (element) {
        if (element instanceof twaver.Node) {
        	selectItems.add(element);
        }
    });*/
	
	// 此处为什么出现重复代码
   /* if (selectItems.size() != 2) {
    	showTipMessage("请选择2台设备！",150,20);
    } else {
    	$("#tiGroupName").show();
    	$("#tiColorName").hide();
    	$("#lblGroupName").html("链路名称：");
    	$("#divGroupEdit").attr("style","width:290px;padding:2px 5px;background-color:#E8F2FE;margin-left:140px;");
    	$("#divGroupEdit").show();
    	network.getView().addEventListener('click', clickCancelLayerAndData);
    }*/
}

/**
 * 创建链路
 */
function createLinkByNode(linkName) {
	$("#divgroup").empty();
	var div = document.getElementById("divgroup");
	createHiddenValue(div, "topoId", topoId);
	createHiddenValue(div, "linkName", linkName);

	// 创建表单数据
	var index = 0;
	elementBox.getSelectionModel().getSelection().forEach(function(element) {
		index = index + 1;
		if (element instanceof twaver.Node) {
			var nodeId = element.getClient("nodeId");
			if(index == 1){
				createHiddenValue(div, "lnodeId", nodeId);
			}
			if(index == 2){
				createHiddenValue(div, "rnodeId", nodeId);
			}
			//createHiddenValue(div, "graphList", nodeId);
		}
	});
	$.ajax({
		type : "POST",
		url : ctxBase + "/index/network/topo/createTopoLink",
		data : $('#formGroup').serialize(),
		// async : false, //同步执行
		dataType : "json", // 返回数据形式为json
		success : function(data) {
			// 数据接口成功返回
			if (data == "exists") {
				showTipMessage("该链路已存在！", 150, 20);
			} else if (data == "success") {
				showTipMessage("链路创建成功！", 150, 20);
				// 创建成功后刷新
				refreshTopoData();
			} else {
				showTipMessage("链路创建失败,请刷新页面重试！", 150, 20);
			}
		},
		error : function() {
			showTipMessage("创建链路发生异常！", 150, 20);
		}
	});
}
