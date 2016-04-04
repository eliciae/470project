var selectedShape ="ellipse";
var selectedLoop = "ccb";
var selectedArrow = "";

//default values for drawing new shapes and connections
var defaultEllipseHeight = '25',
    defaultEllipseWidth = '25',
    defaultRectHeight = '50',
    defaultRectWidth = '100',
    defaultShapeColor = '#C9DAF8',
	defaultNoShapeColor = '#FFFFFF',
    defaultConnectionColor = '#000000',
    defaultEllipseLabel = 'variable',
    defaultRectLabel = 'stock',
    defaultConnectionLabel = '';

function restoreDefaults(shape)
{
  if (shape == 'ellipse')
  {
    defaultsForEllipse();
  }
  else if (shape == 'rect')
  {
    defaultsForRect();
  }
  else if (shape == 'connection')
  {
    defaultsForConnection();
  }
}

function defaultsForRect()
{
  document.getElementById('shapeWidth').value = defaultRectWidth;
  document.getElementById('shapeHeight').value = defaultRectHeight;
  $(".full").spectrum("set", defaultShapeColor);
  $('#shapeColor').attr('value', defaultShapeColor);
  document.getElementById('varLabel').value = defaultRectLabel;
}

function defaultsForEllipse()
{
  document.getElementById('shapeWidth').value = defaultEllipseWidth;
  document.getElementById('shapeHeight').value = defaultEllipseHeight;
  $(".full").spectrum("set", defaultShapeColor);
  $('#shapeColor').attr('value', defaultShapeColor);
  document.getElementById('varLabel').value = defaultEllipseLabel;
}

function defaultsForConnection()
{
  $(".full").spectrum("set", defaultConnectionColor);
  $('#linkColor').attr('value', defaultConnectionColor);
  document.getElementById('connLabel').value = defaultConnectionLabel;
}


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
  else if (cVar.shape == "connection")
  {
    cell = connection(cVar);
  }
  else if (cVar.shape == "loop")
  {
	  cell = loop(cVar);
  }
}


function drawConnection(causalConn)
{
  connection(causalConn);
}

function drawLoop(causalLoop)
{
  loop(causalLoop);
}



function clearDiagram()
{
  graph.clear();
}


//when you click somewhere in the draw area
$('svg').on('mousedown', function(e){
    touchClickAction(e.pageX, e.pageY);
});

function touchClickAction(x,y){
	//get the mouse position on the click
    var mousex = (x - $('svg').offset().left) + $(window).scrollLeft();
    var mousey = (y - $('svg').offset().top) + $(window).scrollTop();

    //if you are in the variable tab
    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
      //if this is the creation of a new object - ie nothing is selected
      if (currentObject == null)
      {
        //get the value of height and width from the sliders
        var standardWidth = document.getElementById("shapeWidth").value;
        var standardHeight = document.getElementById("shapeHeight").value;
          
        //the label to put on the new object
        var label;
        //if it doesn't have a shape, make an ellipse with 0 size
        if (selectedShape == "noShape")
        {
          var standardWidth = 50;
          var standardHeight = 1;
          label = defaultEllipseLabel;
		      shapeColor = '#FFFFFF';	
        }

        //get the appropriate label for it based on shape
        if (selectedShape == "ellipse")
          label = defaultEllipseLabel;
        else if (selectedShape == "rect")
          label = defaultRectLabel;

        //add the shape into the real time model
        var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, label, selectedShape, getShapeColor());
        //use the real time object to draw the shape in the svg
        drawShape(newCausalVar);
      }
    }

    //if you are in the connection tab
    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
      //if nothing is selected and you actually want to draw a new one
      if (currentObject == null)
      {
        //source and target are the start and end points of the connection
        //every connection starts at click point, with no vertices, and is the same size
        var source = { x:mousex, y:mousey };
        var target = { x:mousex+100, y:mousey+100 };
        var label = document.getElementById("connLabel").value;
        var arrow = selectedArrow;
        var vertices = [];
      
        var newCausalConn = createNewCausalConn(source, target, label, vertices, getConnectionColor(), arrow);
        drawConnection(newCausalConn);
      }
    }
	
	//if you are in the connection tab
    if($('.TabbedPanelsTabSelected').attr('id') == "loop-tab")
    {
      //if nothing is selected and you actually want to draw a new one
      if (currentObject == null)
      {
        //add the loop into the real time model
        var newCausalLoop = createNewCausalLoop(mousex, mousey, selectedLoop);
        //use the real time object to draw the shape in the svg
        drawLoop(newCausalLoop);
      }
    }
	
}