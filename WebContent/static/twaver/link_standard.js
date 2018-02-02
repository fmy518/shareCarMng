var WF = function(){
	function reg(space,obj){//命名空间

		var namespace = exports[space] || {};
		for(var key in obj){
			namespace[key] = obj[key];
		}
		exports[space] = namespace;
	}

	var exports = {
		reg : reg
	};

	return exports;
}();



twaver.Util.registerImage('textNode', {
    w: 80,
    h: 15,
    origin: {
        x: 0.5,
        y: 0.5
    },
    v: [
        {
            shape: 'text',
            text: '<%= getClient("textName") %>',
            textAlign: 'center',
            textBaseline: 'top',
            font: 'bold 8px arial',
            rotate: '<%= getClient("rotate") %>',
            x: 0,
            y: 0
        }
    ]
});

WF.reg("legend",function(){ //图例对象
	function getLegend(lineItem, nameItem, stdItem, i){
		
		twaver.Util.registerImage(stdItem.lineColor, {
		    w: 100,
		    h: 3,
		    lineWidth: stdItem.linkWidth,
		    origin: {
		        x: 0,
		        y: 0
		    },
		    v: [
		        {
		            shape: 'line',
		            lineColor: "#"+stdItem.lineColor,
		            p1: {
		                x: 50,
		                y: 2
		            },
		            p2: {
		                x: 800,
		                y: 2
		            }
		        }
		    ]
		});

		var pel = [];
		
		
		var node1 = new twaver.Node();
		node1.setLocation(80, 95 + i*20);
		node1.setImage(stdItem.lineColor);
		node1.setClient("nodeId",lineItem.nodeId);
		node1.setClient("topoId",lineItem.topoId);
		node1.setClient("nodeType",lineItem.nodeType);
		node1.setClient("stdId",lineItem.stdId);

		var node2 = new twaver.Node();
		node2.setClient("textName",stdItem.stdName);
		node2.setClient("topoId",nameItem.topoId);
		node2.setClient("nodeId",nameItem.nodeId);
		node2.setClient("nodeType",nameItem.nodeType);
		node2.setClient("stdId",nameItem.stdId);
	    node2.setImage("textNode");
	    node2.setLocation(170, 80 + i*20);


	    

		pel.push(node1);
		pel.push(node2);
		
		return pel;
	}

	var exports = {
			getLegend : getLegend
	}
	return exports;
}());
