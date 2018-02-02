/**
 * link样式
 *
 *default:默认样式
 *network:样式
 *ima-arrows：虚线箭头
 *ima：虚线
 *arrows：箭头
 *bezier：贝塞尔曲线样式
 *linkType5:这个我也不知道啊
 *样式KEY":"VALUE
 */

 var linkStyle ={
	 "default":{"link.color":"#31BF71","link.width":"1.5","link.pattern":"{10, 5}","arrow.to.color":"#4DA492","arrow.to":"true"},
	 "ima-arrows":{
		 "keyArray":[
			"select.color",
			"link.bundle.enable",
			"link.bundle.expanded",
			"link.color",
			"link.width",
			"link.pattern",
			"arrow.to.color",
			"arrow.to"
			],
		 "valueArray":{
		"select.color":"rgba(0,0,150,0.9)",
		"link.bundle.enable":true,
		"link.bundle.expanded":false,
		"link.color":"#31BF71",
		"link.width":1.5,
		"link.pattern":[10, 5],
		"arrow.to.color":"#4DA492",
		"arrow.to":true
		}},
	"network":{
		"keyArray":[
			"select.color",
			"link.bundle.enable",
			"link.bundle.expanded",
			"link.color",
			"link.width"
			],
		 "valueArray":{
		"select.color":"rgba(0,0,150,0.9)",
		"link.bundle.enable":true,
		"link.bundle.expanded":false,
		"link.color":"##2A00FF",
		"link.width":1.2,
		}},
	 "ima":{
		 "keyArray":[
		 "select.color",
		 "link.bundle.enable",
		 "link.bundle.expanded",
		 "link.color",
		 "link.width",
		 "link.pattern"
		 ],
		 "valueArray":{
		"link.color":"#CACACA",
		"link.width":1.2,
		"select.color":"rgba(0,0,150,0.9)",
		"link.bundle.enable":true,
		"link.bundle.expanded":false,
		"link.pattern":[5, 5]
		}},
	 "arrows":{
		 "keyArray":[
			"select.color",
			"link.bundle.enable",
			"link.bundle.expanded",
			"link.color",
			"link.width",
			"arrow.to.color",
			"arrow.to",
			"label.position",
			"label.xoffset"
			],
		 "valueArray":{
		"link.color":"#CACACA",
		"link.width":1.2,
		"select.color":"rgba(0,0,150,0.9)",
		"link.bundle.enable":true,
		"link.bundle.expanded":false,
		"arrow.to.color":"#000000",
		"arrow.to":true,
		"label.position":"from",
		"label.xoffset":"52",
		}},
	 "bezier":{
		 "keyArray":[
			"select.color",
			"link.bundle.enable",
			"link.bundle.expanded",
			"link.color",
			"link.width",
			"arrow.to.color",
			"arrow.to",
			"label.position",
			"label.xoffset",
			"curve_type"
			],
		 "valueArray":{
		"link.color":"#CACACA",
		"link.width":1.2,
		"select.color":"rgba(0,0,150,0.9)",
		"link.bundle.enable":true,
		"link.bundle.expanded":false,
		"arrow.to.color":"#000000",
		"arrow.to":true,
		"label.position":"form",
		"label.xoffset":55,
		"curve_type":"float"
		}},
	 "linkType5":{
		 "keyArray":[
			"select.color",
			"link.bundle.enable",
			"link.bundle.expanded",
			"link.color",
			"link.width"
			],
		 "valueArray":{
		"link.color":"#F5F439",
		"link.width":3,
		"select.color":"rgba(0,0,150,0.9)",
		"link.bundle.enable":true,
		"link.bundle.expanded":false,
	 }}
	 
 };
 
 var linkLayout ={
		"round":"arc",		
		"topbottom":"orthogonal.vertical",
		"bottomtop":"extend.bottom",
		"leftright":"orthogonal.vertical",
		"rightleft":"flexional.horizontal",
		"symmetry":"orthogonal.V.H",
		"hierarchic":"orthogonal.V.H",
		"spring":null,
		"windSouth":"extend.bottom",
		"windNorth":"extend.top",
		"windEast":"extend.right",
		"windWest":"extend.left",
		};
 
 var LinkUtils = {
	 setStyle:function(link,styleName){	//改变linkStyle
		 var styleArray = linkStyle[styleName];
		 var keyArray = styleArray["keyArray"];
		 var valueArray = styleArray["valueArray"];
		 for(var i=0;i<keyArray.length;i++){
			var key = keyArray[i];
			var value = valueArray[key];
			link.setStyle(key,value);
		}
	},	
	 changeLayout:function(layoutName){
		 refreshTopo();		//刷新数据
		 twaver.Styles.setStyle("link.type",linkLayout[layoutName]);
	 }
 };
 

 

 
 
