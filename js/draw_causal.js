var selectedShape ="ellipse";

var currentObject;

var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
});


function ellipse(cVar) {
	
    var cell = new joint.shapes.basic.Ellipse({
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.label, fill: '#000000', 'font-weight': 'normal' },
            'ellipse': {
                fill: cVar.color,
                stroke: '#d7d7d7',
                'stroke-width': 0,
				value: cVar.idName	
            }	
        }

    });
	
	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
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
	
	
	
  addSelectionListeners("Ellipse");
  
  
//added classes to hopefully delete and resize variables  
//cell.attr('class', 'scalable inPorts outPorts moveTool resizeTool portsTool deleteTool tooltip');
  
	graph.addCell(cell);
	return cell;
}


function rect(cVar) {
	
    var cell = new joint.shapes.basic.Rect({
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.label, fill: '#000000', 'font-weight': 'normal' },
            'rect': {
                fill: cVar.color,
                stroke: '#000000',
                'stroke-width': 2,
				        value: cVar.idName
            }
        }
    });
	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
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

  addSelectionListeners("Rect");
  
  //add classes for delete and resizing tools 
	
  return cell;
}



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
        labels: [{ position: 0.5, attrs: { text: { text: cConn.label || '', 'font-weight': 'bold' } } }],
        vertices: cConn.vertices || [],
        attrs: {
          'path': {
            value: cConn.idName
          }
        }
    });

    cell.attr({
     // '.connection': { stroke: cConn.color, 'stroke-dasharray': ''},
    //  '.marker-source': { stroke: cConn.color, fill: cConn.color },
     // '.marker-target': { stroke: cConn.color, fill: cConn.color }
    });


    function updateSvgElement(evt){
      if (!evt.isLocal){
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

    addSelectionListeners("connection");

    return cell;
}


function getVarIDFromSVG(nodeid)
{
  //check if the thing you are connecting is an ellipse
  var child = $('g[model-id="' + nodeid + '"]').find('ellipse');
  //if there is no value, then there is no ellipse there, try rect
  if (child.attr("value") == undefined)
  {
    child = $('g[model-id="' + nodeid + '"]').find('rect');
  }
  //return the value attribute value of the thing you are pointing to
  return child.attr('value');
}


function getModelIDFromVarID(varID)
{
  //find the element with the matching id from the model
  var el = $("ellipse[value='" + varID + "']");
  //if nothing found
  if (!el.length)
  {
    el = $("rect[value='" + varID + "']");
  }

  //get the parent g element so we can get the model id
  var parent = el.first().parents("g[model-id]");
  //the model-id is assigned by joint js
  var modelId = parent.first().attr("model-id");

  //return the id in the structure that joint js expects
  return { id: modelId };
}



function drawShape(cVar)
{
  if (currentObject == null)
  {
    var cell;
    if (cVar.shape == "ellipse" || cVar.shape == "noShape")
    {
      cell = ellipse(cVar);
    }
    else if (cVar.shape == "rect")
    {
      cell = rect(cVar);
    }
    //not really a cVar, cConn
    else //if (cVar.shape == "connection")
    {
      cell = connection(cVar);
    }
  }
  
  /*function updateSvgElement(evt){
      if (!evt.isLocal){
        cell.position(cVar.x, cVar.y);
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
  
  graph.addCell(cell);*/
}

function incrementCount()
{
  count++;
  countString = count.toString();
}


function drawConnection(causalConn)
{
  connection(causalConn);
}

function clearDiagram()
{
  graph.clear();
}