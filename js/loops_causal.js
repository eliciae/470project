function loop(cLoop) {
	var imgLink = "/graphics/" + selectedLoop +".png";
    var cell = new joint.shapes.basic.Image({
            position : {
				x : cLoop.x,
				y : cLoop.y
			},
			size : {
				width : 30,
				height : 30
			},
			attrs : {
				image : {
					"xlink:href" : imgLink,
					width : 30,
					height : 30,
					value: cLoop.idName
					}
			}
			
		});	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cLoop.x, cLoop.y);
			}
	}
	
	//if the associated model object is changed, then update the svg element
	cLoop.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);

	paper.on('cell:pointerup', 
		function(cellView, evt, x, y) { 
			cLoop.x = cell.get("position").x;
			cLoop.y = cell.get("position").y;
    }
	);
   
	graph.addCell(cell);

  var modelId = cell.id;
  el = $('g[model-id="'+modelId+'"]');
  el.on('mousedown', selectLoop);


	return cell;
}
