/**
 * 存储拓扑图-store_topo
 * @author CsWang
 * @date 2015-12-08
 */
var topoId = "6";//存储拓扑图Id
var ctxBase;//基础路径
var elementBox = new twaver.ElementBox();//节点DataBox
var network = new twaver.vector.Network(elementBox);//拓扑图画布
var selectionModel = elementBox.getSelectionModel();//选中状态
var autoLayouter = new twaver.layout.AutoLayouter(elementBox);//自动布局
var popupMenu = new twaver.controls.PopupMenu(network);//右键菜单
var toolbar;//工具栏
var isRegisterImage = false;//图片是否已注册
var EnableAlarm = false;//是否启用告警
var lastLocateDev;//定位设备
/**
 * 初始化数据
 */
function init(ctxbase){
	ctxBase = ctxbase;
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
    //注册图标  的同时完成数据加载
    registerDeviceImageUtil(topoId);
    //
    initTitleEditEvent();
    //全局设置网元
    twaver.Styles.setStyle("select.color","rgba(200,0,0,0.7)");
    twaver.Styles.setStyle("select.style","border");
}


/**
 * 刷新拓扑数据 
 */
function refreshTopoData(){
	elementBox.clear();
	registerDeviceImageUtil(topoId);
}