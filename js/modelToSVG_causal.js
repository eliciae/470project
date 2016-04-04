var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
});

//create SVG element for realtime element
//4 functions for: Ellipse (used by noShape as well), Rectangle, Connection, and Loops
//@pre: take in a realtime object 
//@post: corresponding SVG element to realitime object created 
//listeners are created on each realtime object that update the SVG element for all users  

//ELLIPSE (also used by noShape)
function ellipse(cVar) {	
    var cell = new joint.shapes.basic.Ellipse({
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.label, fill: '#000000', 'font-weight': 'normal' },
            'ellipse': {
                fill: cVar.color,
                stroke: '#000000',
                'stroke-width': 0,
				        value: cVar.idName	
            }	
        }

    });
	
	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
        cell.resize(cVar.width, cVar.height);
        cell.attr({text: {text: cVar.label}});
        cell.attr({'ellipse': {fill: cVar.color}});
			}
	}
	
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);

	paper.on('cell:pointerup', 
		function(cellView, evt, x, y) { 
			cVar.x = cell.get("position").x;
			cVar.y = cell.get("position").y;
    }
	);
   
	graph.addCell(cell);

  var modelId = cell.id;
  el = $('g[model-id="'+modelId+'"]');
  el.on('mousedown', selectEllipse);


	return cell;
}

//RECTANGLE
function rect(cVar) 
{	
    var cell = new joint.shapes.basic.Rect({
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.label, fill: '#000000', 'font-weight': 'normal' },
            'rect': {
                fill: cVar.color,
                stroke: '#000000',
                'stroke-width': 0,
				value: cVar.idName
            }
        }
    });
	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
        cell.resize(cVar.width, cVar.height);
        cell.attr({text: {text: cVar.label}});
        cell.attr({'rect': {fill: cVar.color}});
			}
	}
	
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
	
	
	paper.on('cell:pointerup', function(cellView, evt, x, y) { 
			cVar.x = cell.get("position").x;
			cVar.y = cell.get("position").y;
	});
	
	graph.addCell(cell);

  var modelId = cell.id;
  el = $('g[model-id="'+modelId+'"]');
  el.on('mousedown', selectRect);
  
	
  return cell;
}


//CONNECTIONS
function connection(cConn) 
{
    //if the id is set, it is pointing to a variable, not a point.
    // this means we have to get the model id, rather than the one we created.
    var setSource = cConn.source;
    var setTarget = cConn.target;
    
    /*
    ** TODO: change this so that the id is part of the source, not the source itself
    */
    if (!cConn.source.x)
    {
      setSource = getModelIDFromVarID(cConn.source)
    }
    if (!cConn.target.x)
    {
      setTarget = getModelIDFromVarID(cConn.target)
    }

    var cell = new joint.shapes.fsa.Arrow({
        source: setSource,
        target: setTarget,
        labels: [{ position: 0.5, attrs: { text: { text: cConn.label || '' } } }, 
				{ position: 0.9, attrs: { text: { text: cConn.arrow || '', 'font-weight': 'bold', 'font-size':'20px'} } }],
        vertices: cConn.vertices || [],
        attrs: {
          'path': {
            value: cConn.idName
          }
        }
    });

    cell.attr({
      '.connection': { stroke: cConn.color, 'stroke-dasharray': ''},
      '.marker-source': { stroke: cConn.color, fill: cConn.color },
      '.marker-target': { stroke: cConn.color, fill: cConn.color }
    });


    function updateSvgElement(evt){
      if (!evt.isLocal)
      {
        var s = cConn.source;
        var t = cConn.target;

        cell.set('vertices', cConn.vertices);

        if (s.x)
          cell.set('source', cConn.source);
        else
        {
          var source = getModelIDFromVarID(s);
          cell.set('source', source);
        }
        if (t.x)
          cell.set('target', cConn.target);
        else
        {
          var target = getModelIDFromVarID(t);
          cell.set('target', target)
        }

        cell.attr({
          '.connection': { stroke: cConn.color, 'stroke-dasharray': ''},
          '.marker-source': { stroke: cConn.color, fill: cConn.color },
          '.marker-target': { stroke: cConn.color, fill: cConn.color }
        });

        cell.label(0, {attrs: {text: {text: cConn.label}}});
		cell.label(1, {attrs: {text: {text: cConn.arrow}}});

      }
  }
  
  //if the associated model object is changed, then update the svg element
  cConn.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
  

  paper.on('cell:pointerup', 
    function(cellView, evt, x, y) 
    { 
      var s = cell.get('source');
      var t = cell.get('target');

      cConn.vertices = cell.get('vertices');

      //if there is an id, it is pointing to a variable, so set the id as the collaborative id
      if (s.id)
        cConn.source = getVarIDFromSVG(s.id);
      else
        cConn.source = s;
      if (t.id)
        cConn.target = getVarIDFromSVG(t.id);
      else
        cConn.target = t;
    }
  );

    graph.addCell(cell);

    var modelId = cell.id;
    el = $('g[model-id="'+modelId+'"]');
    el.find('circle[class="marker-vertex"]').on('mousedown', selectConnection);
    el.find('path[class="marker-arrowhead"]').on('mousedown', selectConnection);
    el.on('mousedown', selectConnection);

    return cell;
}


//LOOPS
function loop(cLoop) {
	var imgLink = "/graphics/" + cLoop.type +".png";
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
				'.': { magnet: false },
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
