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

function updateValue() 
{ 
  // get the current value of the input fields
  shapeColor = getShapeColor(); 
  connectionColor = getConnectionColor();
 /* shapeWidth = document.getElementById("shapeWidth").value;
  shapeHeight = document.getElementById("shapeHeight").value;
  alert("width: " + shapeWidth +" height: " + shapeHeight);*/
  

  //if there is an object selected, change the color
  if (currentObject != undefined)
  {
    //if the object is a shape
    if (selectionIsShape())
    {
      currentObject.attr('fill', shapeColor);
	  
     //get the parent g element so we can get the model id
      var parent = currentObject.parents("g[model-id]");
      //the model-id is assigned by joint js
      var modelId = parent.first().attr("model-id");

      var id = getVarIDFromSVG(modelId);

      var sharedObject = localModel.getRoot().get(id);
      sharedObject.color = shapeColor;
	  //sharedObject.width = shapeWidth;
	 // sharedObject.height = shapeHeight;
	  
	   //get the joint js cell
     // cell = graph.getCell(modelId);
	 // cell.resize(shapeWidth, shapeHeight); 
    }

    //if the object is a connection
    if (selectionIsConnection())   
    {
      var modelId = currentObject.attr("model-id");

      //get the joint js cell
      cell = graph.getCell(modelId);

      cell.attr({
        '.connection': { stroke: connectionColor },
        '.marker-source': { stroke: connectionColor, fill: connectionColor },
        '.marker-target': { stroke: connectionColor, fill: connectionColor }
      });
	  

      //get the id for the realtime object
      var id = currentObject.children("path[value]").first().attr('value');

      var sharedObject = localModel.getRoot().get(id);
      sharedObject.color = connectionColor;
    } 
  }
}

function updateLabel(){
	
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



/*$('#rectShape').on('click', function(){
    selectedShape = "rect";
});
$('#ellipseShape').on('click', function(){
    selectedShape = "ellipse";
});
$('#noShape').on('click', function(){
    selectedShape = "noShape";
});*/

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
  alert("select ellipse");
  
  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();
  alert(getModelElBySvgSelectedID().shape);
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
   alert(getModelElBySvgSelectedID().shape);
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

function updateValuesSelectedInVaraiableTab(){
	//alert("updating");
	//alert(currentObject.get('attrs').text);
 // document.getElementById('#varLabel').value = getCurrentCell.get('attrs').text.text;
  
  	//select correct shape attribute
  	document.getElementById('shapeR').checked = false;
	document.getElementById('shapeE').checked = false;
	document.getElementById('shapeN').checked = false;
	
	if (selectedShape == "rect"){
		document.getElementById('shapeR').checked = true;
		//alert("rect");
	}
	else if (selectedShape == "ellipse"){
		//alert("ellipse");
		document.getElementById('shapeE').checked = true;
	}
	else{
		//alert("no shape");
		document.getElementById('shapeN').checked = true;
	}
		
	
 // document.getElementById(selectedShape).checked = true;
  var cell = getCurrentCell();
 // document.getElementById(shapeWidth).value = getCurrentCell().get('size').width;
 // document.getElementById(shapeHeight).value = getCurrentCell().get('size').height;
//  document.getElementById(shapeColor).value = getCurrentCell().get('attrs').fill;
  //radioObj.checked = (radioObj.value == newValue.toString());
 // alert(cell.attr('fill'));
 //currentObject.attr("model-id")
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



$('svg').on('mousedown', function(e){

    var mousex = (e.pageX - $('svg').offset().left) + $(window).scrollLeft();
    var mousey = (e.pageY - $('svg').offset().top) + $(window).scrollTop();

    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
  		var standardWidth = document.getElementById("shapeWidth").value;
  		var standardHeight = document.getElementById("shapeHeight").value;
        

  		if (selectedShape == "noShape")
      {
  			var standardWidth = 0;
  			var standardHeight = 0;
  		}

      if (currentObject == null)
      {
        var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, selectedShape, selectedShape, shapeColor);
        drawShape(newCausalVar);
      }
     
      //$('#markup-tab').click();
    }

    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
      var source = { x:mousex, y:mousey };
      var target = { x:mousex+100, y:mousey+100 };
      var label = "connection";
      var vertices = [];

      if (currentObject == null)
      {
        var newCausalConn = createNewCausalConn(source, target, label, vertices, connectionColor);
        drawConnection(newCausalConn);
      }
     // $('#markup-tab').click();
    }
});

function deleteShape(){
	 if (selectionIsShape()){
	  getCurrentCell().remove();
	 }
}

function deleteConn(){
	if (currentObject.prop("tagName") == "g") 
		currentObject.remove();
}

//resizing at realtime
var widthRng = document.getElementById("shapeWidth");
var heightRng = document.getElementById("shapeHeight");

read("mousedown");
read("mousemove");

function read(evtType) {
  if (currentObject != null)
  {
    widthRng.addEventListener(evtType, function() {
  	 if (selectionIsShape())
      	resize();
    });
    heightRng.addEventListener(evtType, function() {
	   if (selectionIsShape())
	     resize();
  	});
  }
}


function resize(){
	window.requestAnimationFrame(function () 
  {
    if (currentObject != null)
    {
      getCurrentCell().resize(shapeWidth, shapeHeight); 
	}
   });
  
}

//label at realtime
document.getElementById('varLabel').addEventListener("keyup", function(){
	if (currentObject != null)
		if(selectionIsShape())
		{ 
			  getCurrentCell().attr({text:{text: document.getElementById('varLabel').value}});
		}

	}, false);


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