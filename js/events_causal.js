var currentObject = null;

var shapeColor = getShapeColor();
var connectionColor = getConnectionColor();

var shapeWidth = document.getElementById("shapeWidth").value;
var shapeHeight = document.getElementById("shapeHeight").value;

function getShapeColor()
{
  return document.getElementById("shapeColor").value;
}

function getConnectionColor()
{
  return document.getElementById("linkColor").value;
}

function selectionIsShape()
{
  return (currentObject.prop("tagName") == "ellipse" 
    || currentObject.prop("tagName") == "rect");
}

function selectionIsConnection()
{
  return (currentObject.prop("tagName") == "g");
}


function displayObjectChangedEvent(evt) 
{
  var events = evt.events;
  var eventCount = evt.events.length;
  for (var i = 0; i < eventCount; i++) 
  {
    console.log('Event type: '  + events[i].type);
    console.log('Local event: ' + events[i].isLocal);
    console.log('User ID: '     + events[i].userId);
    console.log('Session ID: '  + events[i].sessionId);
    //only draw and add to the model if it wasn't local
    if (!events[i].isLocal)
    {
      //a list of all the item names in the model
      var modelList = localModel.getRoot().keys();

      modelList.forEach(function(key)
      {
         //if the model element does NOT exists in the SVG, then create it 
         if (keyInSVG(key))
         {
           drawShape(localModel.getRoot().get(key));
         }
      });
    }
  }
}

function keyInSVG(key)
{
  return !($("ellipse[value='"+ key +"']").length)
        && !($("rect[value='"+ key +"']").length)
        && !($("path[value='"+ key +"']").length);
}


function redraw()
{
  var connectionIDs = [];
  var modelList = localModel.getRoot().keys();

  modelList.forEach(function(key)
  {
    var modelItem = localModel.getRoot().get(key);
    if (modelItem != null)
    {  
      //put all connections in an array to iterate through later
      if (modelItem.shape == "connection")
      {
        connectionIDs.push(modelItem);
      }
      else 
      {
        drawShape(modelItem);
      }
    }
  });

  for (var k = 0; k < connectionIDs.length; k++){
    drawShape(connectionIDs[k]);
  }
}


$('#undo').on('click', function(){
  localModel.undo();
  clearDiagram();
  redraw();
});
$('#redo').on('click', function(){
  localModel.redo();
  clearDiagram();
  redraw();
});


//if you click the svg and you aren't in a g tag, everything should unselect
$('svg').on('click', function(event)
{
  if(!$(event.target).closest('g').length) 
  {
    removeOldSelections();
  }      
});


function selectEllipse()
{
  removeOldSelections();
  currentObject = $( this ).find('ellipse');
  currentObject.attr('class', 'selectObject');

  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();

  selectedShape = getModelElBySvgSelectedID().shape;
  updateValuesSelectedInVaraiableTab();
}

function selectRect()
{
  removeOldSelections();
  currentObject = $( this ).find('rect');
  currentObject.attr('class', 'selectObject');
  
  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();
  selectedShape = getModelElBySvgSelectedID().shape;
  updateValuesSelectedInVaraiableTab();
}

function selectConnection()
{
  removeOldSelections();
  currentObject = $(this);
  this.classList.add('selectObject');
  
  //open connection tab & set tab values to be the selected item's values 
  $('#connection-tab').click();
}


function removeOldSelections()
{
  currentObject = null;
  //deselect tab
   $('#markup-tab').click();
  
  var els = document.getElementsByClassName("selectObject");
  for (var i = 0; i < els.length; i++) 
  {
    els[i].classList.remove('selectObject');
  }
}


function deleteShape(){
	 if (selectionIsShape()){
	  getCurrentCell().remove();
	 }
}

function deleteConn(){
	if (currentObject.prop("tagName") == "g") 
		currentObject.remove();
}


function getCurrentCell(){
	//get the joint js cell
			  //get the parent g element so we can get the model id
			  var parent = currentObject.parents("g[model-id]");
			  //the model-id is assigned by joint js
			  var modelId = parent.first().attr("model-id");
			  cell = graph.getCell(modelId);
			return cell; 
}

//returns the model el that has the corresponding id to currentCell
function getModelElBySvgSelectedID(){
	if (currentObject.prop("tagName") == "rect")
		return localModel.getRoot().get(getCurrentCell().get("attrs").rect.value);
	else if (currentObject.prop("tagName") == "ellipse")
		return localModel.getRoot().get(getCurrentCell().get("attrs").ellipse.value);
}