var shapeColor = document.getElementById("shapeColor").value;
var connectionColor = document.getElementById("linkColor").value;
var shapeWidth = document.getElementById("shapeWidth").value;
var shapeHeight = document.getElementById("shapeHeight").value;

function updateValue() 
{ 
  // get the current value of the input fields
  shapeColor = document.getElementById("shapeColor").value; 
  connectionColor = document.getElementById("linkColor").value;
 /* shapeWidth = document.getElementById("shapeWidth").value;
  shapeHeight = document.getElementById("shapeHeight").value;
  alert("width: " + shapeWidth +" height: " + shapeHeight);*/
  

  //if there is an object selected, change the color
  if (currentObject != undefined)
  {
    //if the object is a shape
    if (currentObject.prop("tagName") == "ellipse" || currentObject.prop("tagName") == "rect")
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

    //if the object id a connection
    if (currentObject.prop("tagName") == "g")   
    {
      var modelId = currentObject.attr("model-id");

      //get the joint js cell
      cell = graph.getCell(modelId);

      cell.attr({
       // '.connection': { stroke: connectionColor },
       // '.marker-source': { stroke: connectionColor, fill: connectionColor },
       // '.marker-target': { stroke: connectionColor, fill: connectionColor }
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



$('#rectShape').on('click', function(){
    selectedShape = "rect";
});
$('#ellipseShape').on('click', function(){
    selectedShape = "ellipse";
});
$('#noShape').on('click', function(){
    selectedShape = "noShape";
});

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


//loops through every instance of Ellipse class and adds a listener for clicks
//jQuery apparently doesn't like to grab classes on SVGs
//the following three functions have a lot of duplications that could be solved with variables, but jQuery 
// was not liking string vars as parameters. TODO: There must be a way to make it work
function addSelectionListeners(shape)
{
  if (shape == "Ellipse")
  {
    var els = document.getElementsByClassName("Ellipse");
    for (var i = 0; i < els.length; i++) 
    {
      els[i].addEventListener('mousedown', selectEllipse, false);
    }
  }
  else if (shape == "Rect")
  {
    var els = document.getElementsByClassName("Rect");
    for (var i = 0; i < els.length; i++) 
    {
      els[i].addEventListener('mousedown', selectRect, false);
    }
  }
  else if (shape == "connection")
  {
    var els = document.getElementsByClassName("link");
    for (var i = 0; i < els.length; i++) 
    {
      els[i].addEventListener('mousedown', selectLink, false);
      $(els[i]).find('circle[class="marker-vertex"]').on('mousedown', selectLink);
      $(els[i]).find('path[class="marker-arrowhead"]').on('mousedown', selectLink);
    }
  }
}

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
  currentObject = $( this ).find('ellipse');
  currentObject.attr('class', 'selectObject');
}

function selectRect()
{
  removeOldSelections();
  currentObject = $( this ).find('rect');
  currentObject.attr('class', 'selectObject');
}

function selectLink()
{
  removeOldSelections();
  currentObject = $(this);
  this.classList.add('selectObject');
}

function removeOldSelections()
{
  currentObject = null;
  var els = document.getElementsByClassName("selectObject");
  for (var i = 0; i < els.length; i++) 
  {
    els[i].classList.remove('selectObject');
  }
}



$('svg').on('click', function(e){

    var mousex = (e.pageX - $('svg').offset().left) + $(window).scrollLeft();
    var mousey = (e.pageY - $('svg').offset().top) + $(window).scrollTop();

    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
  		var standardWidth = document.getElementById("shapeWidth").value;;
  		var standardHeight = document.getElementById("shapeHeight").value;;
          

  		if (selectedShape == "noShape")
      {
  			var standardWidth = 0;
  			var standardHeight = 0;
  		}

      var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, selectedShape, selectedShape, shapeColor);
      drawShape(newCausalVar);
     
      $('#markup-tab').click();
    }

    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
      var source = { x:mousex, y:mousey };
      var target = { x:mousex+100, y:mousey+100 };
      var label = "connection";
      var vertices = [];

      var newCausalConn = createNewCausalConn(source, target, label, vertices, connectionColor);
      drawConnection(newCausalConn);
      $('#markup-tab').click();
    }
});

function deleteShape(){
	 if (currentObject.prop("tagName") == "ellipse" || currentObject.prop("tagName") == "rect"){
	      //get the parent g element so we can get the model id
      var parent = currentObject.parents("g[model-id]");
      //the model-id is assigned by joint js
      var modelId = parent.first().attr("model-id");
      var id = getVarIDFromSVG(modelId);
	  
	   //get the joint js cell
      cell = graph.getCell(modelId);
		cell.remove();
	 }
}

function deleteConn(){
	if (currentObject.prop("tagName") == "g") 
		currentObject.remove();
}

var widthRng = document.getElementById("shapeWidth");
var heightRng = document.getElementById("shapeHeight");

read("mousedown");
read("mousemove");

function read(evtType) {
  widthRng.addEventListener(evtType, function() {
    resize();
  })
  heightRng.addEventListener(evtType, function() {
		resize();
	})
}


function resize(){
	window.requestAnimationFrame(function () {
        //get the joint js cell
		//get the parent g element so we can get the model id
      var parent = currentObject.parents("g[model-id]");
      //the model-id is assigned by joint js
      var modelId = parent.first().attr("model-id");
		var shapeWidth = document.getElementById("shapeWidth").value;
		var shapeHeight = document.getElementById("shapeHeight").value;
      cell = graph.getCell(modelId);
	  cell.resize(shapeWidth, shapeHeight); 
	  
    });
}