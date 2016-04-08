/**
* Create a joint js image and draw it in the svg
* @preconditions - a valid causal variable has been added to the real time model
* @postconditions - the image has been drawn into the svg and the object exists in the graph 
* @param {cLoop} a causal variable that exists in the model and is used to get the values to draw from
**/
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
				text : { text: cLoop.label, fill: '#000000', 'font-weight': 'normal' },
				'.': { magnet: false },
				image : {
					"xlink:href" : imgLink,
					width : 30,
					height : 30,
					value: cLoop.idName
				}
			}
			
		});	

	function updateSvgElement(evt)
	{
		if (!evt.isLocal)
		{
			cell.position(cLoop.x, cLoop.y);
			cell.attr({text: {text: cLoop.label}});
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
  el.on('mousedown', {shape: "image"}, selectShape);


	return cell;
}


/**
* Create a joint js ellipse and draw it in the svg
* @preconditions - a valid causal variable has been added to the real time model
* @postconditions - the ellipse has been drawn into the svg and the object exists in the graph 
* @param {cVar} a causal variable that exists in the model and is used to get the values to draw from
**/
function ellipse(cVar) 
{
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
	
	//if there is a remote event that fires on the object
  //update all the svg attributes on the cell object in the graph
	function updateSvgElement(evt)
  {
    if (!evt.isLocal)
    {
      cell.position(cVar.x, cVar.y);
      cell.resize(cVar.width, cVar.height);
      cell.attr({text: {text: cVar.label}});
      cell.attr({'ellipse': {fill: cVar.color}});
    }
	}
	
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);

  //only update the location when the mouse is lifted (pointerup)
  //this means you only see moves after they happen, but reduces events fired
	paper.on('cell:pointerup', function(cellView, evt, x, y) 
  { 
    cVar.x = cell.get("position").x;
    cVar.y = cell.get("position").y;
  });
   
	graph.addCell(cell);

  //add the selection listener to the cell on mousedown
  var modelId = cell.id;
  el = $('g[model-id="'+modelId+'"]');
  el.on('mousedown', {shape: "ellipse"}, selectShape);

	return cell;
}



/**
* Create a joint js rect and draw it in the svg
* @preconditions - a valid causal variable has been added to the real time model
* @postconditions - the rect has been drawn into the svg and the object exists in the graph 
* @param {cVar} a causal variable that exists in the model and is used to get the values to draw from
**/
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
	
	function updateSvgElement(evt)
  {
    if (!evt.isLocal)
    {
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
  el.on('mousedown', {shape: "rect"}, selectShape);
  
	
  return cell;
}


/**
* Create a joint js arrow and draw it in the svg
* @preconditions - a valid causal variable has been added to the real time model
* @postconditions - the arrow has been drawn into the svg and the object exists in the graph 
* @param {cConn} a causal variable that exists in the model and is used to get the values to draw from
**/
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
    el.find('circle[class="marker-vertex"]').on('mousedown', {shape: "connection"}, selectShape);
    el.find('path[class="marker-arrowhead"]').on('mousedown', {shape: "connection"}, selectShape);
    el.on('mousedown', {shape: "connection"}, selectShape);

    return cell;
}



/**
* Gets the id for the model object from the value attribute on the svg in the html
* matching the given joint js assigned model-id value
* inverse of the getModelIDFromVarID
* @postconditions - the svg is unchanged
* @param - {nodeid} the model-id value that joint js automatically assigns to 
*               the elements that it creates
* @return - the value attr within the html element which will be the same as the
*         id that the object was stored in the model under
**/
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


/**
* Gets the model-id value that joint js uses from the id that the object
* is stored under in the real time model
* @postconditions - the svg and model are unchanged
* @param - {varID} the id that the object is stored under in the model
* @return - the id for the joint js model in the format {id: value}
**/
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


/**
* Gets the cell joint js object of the currently selected svg element
* This function is appropriate for the shape and image items
* @postconditions - the svg is unchanged
* @return - the cell joint js object corresponding to the currently selected
*           item in the svg
**/
function getCurrentCell()
{
  //get the joint js cell
  //get the parent g element so we can get the model id
  var parent = currentObject.parents("g[model-id]");
  //the model-id is assigned by joint js
  var modelId = parent.first().attr("model-id");
  cell = graph.getCell(modelId);
  return cell; 
}


/**
* Get the joint js cell of the currently selected svg connection
* This fuction is appropriate for the connections only
* @postconditions - the svg is unchanged
* @return - the joint js cell of currently selected svg connection
**/
function getCurrentConnCell()
{
  var modelId = currentObject.attr("model-id");
  cell = graph.getCell(modelId);
  return cell; 
}

//returns the model el that has the corresponding id to currentCell
/**
* Finds the object in the realtime model that matches to the item selected
* @preconditions - currentObject is not null
* @postconditions - the svg and real time model are not changed
* @return {modelEl} - the object from the real time model that matches the 
*           currently selected object in the svg
**/
function getModelElBySvgSelectedID()
{
	if (currentObject.prop("tagName") == "rect")
		return localModel.getRoot().get(getCurrentCell().get("attrs").rect.value);
	else if (currentObject.prop("tagName") == "ellipse")
		return localModel.getRoot().get(getCurrentCell().get("attrs").ellipse.value);
	else if (currentObject.prop("tagName") == "g")
		return localModel.getRoot().get(getCurrentConnCell().get("attrs").path.value);
	else if (currentObject.prop("tagName") == "image")
		return localModel.getRoot().get(getCurrentCell().get("attrs").image.value);
}



/**
* Adds a listener to the undo and redo buttons
* These functions call a built-in undo from real time, clear the svg
* and then redraw everything in the svg
**/
$('#undo').on('mousedown', function(){
  localModel.undo();
  clearDiagram();
  redraw();
});
$('#redo').on('mousedown', function(){
  localModel.redo();
  clearDiagram();
  redraw();
});

