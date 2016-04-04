var currentObject = null;

var shapeColor = getShapeColor();
var connectionColor = getConnectionColor();

var shapeWidth = document.getElementById("shapeWidth").value;
var shapeHeight = document.getElementById("shapeHeight").value;

function getShapeColor()
{
  return $('#shapeColor').attr('value');
}

function getConnectionColor()
{
  return $('#linkColor').attr('value');
}

function selectionIsShape()
{
  if (currentObject == null)
  {
    return false;
  }
  return (currentObject.prop("tagName") == "ellipse" 
    || currentObject.prop("tagName") == "rect");
}

function selectionIsConnection()
{
  if (currentObject == null)
  {
    return false;
  }
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
  		//if something was deleted, clear the whole diagram and redraw it all
      if (somethingWasDeleted())
      {
        clearDiagram();
        redraw();
		  }
      //nothing was deleted, but need to check for new stuff
      else
      {
        //a list of all the item names in the model
        var modelList = localModel.getRoot().keys();

        modelList.forEach(function(key)
        {
          //the count will always be the key 1, don't try to draw it
          if (key == 'countObjectID')
          {
            return true;
          }
          //if the model element does NOT exists in the SVG, then create it 
          if (!keyInSVG(key))
          {
           drawShape(localModel.getRoot().get(key));
          }
        });
      }
    }
  }
}

function keyInSVG(key)
{
  return ($("ellipse[value='"+ key +"']").length)
         || ($("rect[value='"+ key +"']").length)
         || ($("path[value='"+ key +"']").length);
}


function somethingWasDeleted()
{
  //get any of these tags with a value - this means they are collaborative
  numSvgCollabElems = $(".Ellipse, .Rect, .Arrow").length;

  //the number of elements has to be subtracted by one because of the count obj
  var numModelElems = localModel.getRoot().size - 1;

  //if there are more svg elements than model elements, something has been deleted
  return (numSvgCollabElems > numModelElems);
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


//if you click the svg and you aren't in a g tag, everything should unselect
$('svg').on('mousedown', function(event)
{
  if(!$(event.target).closest('g').length) 
  {
    removeOldSelections();
  }      
});


function selectEllipse()
{

  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $( this ).find('ellipse');
  currentObject.attr('class', 'selectObject');

  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();

  selectedShape = getModelElBySvgSelectedID().shape;
  hideSizeAndColor();
  updateValuesSelectedInVaraiableTab();
}

function selectRect()
{
  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $( this ).find('rect');
  currentObject.attr('class', 'selectObject');
  
  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();
  selectedShape = getModelElBySvgSelectedID().shape;
  hideSizeAndColor();
  updateValuesSelectedInVaraiableTab();
}

function selectConnection()
{
	
  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $(this);
  this.classList.add('selectObject');
  
  //open connection tab & set tab values to be the selected item's values 
  $('#connection-tab').click();
  selectedArrow = getModelElBySvgSelectedID().arrow;
  updateValuesSelectedInConnectionTab();
}


function removeOldSelections()
{
	//hide delete button
  $('#delete').hide();		
  currentObject = null;
  //deselect tab
   $('#markup-tab').click();
  
  var els = document.getElementsByClassName("selectObject");
  for (var i = 0; i < els.length; i++) 
  {
    els[i].classList.remove('selectObject');
  }
  
}


function deleteShape()
{
	 if (selectionIsShape())
   {
    //get all the links connecnted to the shape that is being deleted
    links = graph.getConnectedLinks(getCurrentCell());
    console.log(links[0]);
    links.forEach(function(link)
    {
      var val = link.get("attrs").path.value;
      //remove the links from the model
      localModel.getRoot().delete(val);
    })

	  //find selected item in model and delete it 
	  localModel.getRoot().delete(getModelElBySvgSelectedID().idName); 
	  //delete it in the svg
		getCurrentCell().remove();
	 }
}

function deleteConn()
{
	if (currentObject.prop("tagName") == "g")
  { 
	 //find selected item in model and delete it 
	  localModel.getRoot().delete(getModelElBySvgSelectedID().idName); 
	  //delete it in the svg
		getCurrentConnCell().remove();
	}
}


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

function getCurrentConnCell()
{
  var modelId = currentObject.attr("model-id");
  cell = graph.getCell(modelId);
  return cell; 
}

//returns the model el that has the corresponding id to currentCell
function getModelElBySvgSelectedID()
{
	if (currentObject.prop("tagName") == "rect")
		return localModel.getRoot().get(getCurrentCell().get("attrs").rect.value);
	else if (currentObject.prop("tagName") == "ellipse")
		return localModel.getRoot().get(getCurrentCell().get("attrs").ellipse.value);
  else if (currentObject.prop("tagName") == "g")
    return localModel.getRoot().get(getCurrentConnCell().get("attrs").path.value);
}


//a listener for when someone presses the delete key - get rid of the object
//would be nice if this didn't listen to all key ups...
document.addEventListener('keyup', function(event)
{
  if (event.keyCode === 46)
  {
    deleteShape();
    deleteConn();
  }
});




$('#variable-tab').on('mousedown', function(event)
{
    $('#variable-tab').click(); 
    if (selectionIsConnection())
    {
      removeOldSelections();
    }
    if (currentObject == null)
    {
      restoreDefaults(selectedShape);
    }
});

$('#connection-tab').on('mousedown', function(event)
{
    $('#connection-tab').click(); 
    if (selectionIsShape())
    {
      removeOldSelections();
    }
    if (currentObject == null)
    {
      restoreDefaults('connection');
    }
});

$('#delete').click(function()
{
    deleteShape();
    deleteConn();
	$('#delete').hide();
	
})


