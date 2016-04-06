//initializes the graph that elements and links are added to
var graph = new joint.dia.Graph();

//initialized the paper that joint js uses
var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 1000,
    height: 1000,
    gridSize: 1,
    model: graph
});

/**
* Adds a shape the local svg based on a given causal variable 
* @preconditions - the causal variable already exists in the real time model
* @postconditions - the shape has been added to the svg
* @param - {cVar} a causal variable, connection, or loop that is used to 
*           get svg values for drawing an item
**/
function drawIntoSVG(cVar)
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


//removes everything from the local svg
function clearDiagram()
{
  graph.clear();
}


//when you click somewhere in the draw area
//call function touchClickAction 
$('svg').on('mousedown', function(e)
{
  //if this is the creation of a new object - ie nothing is selected
  if (currentObject == null)
  {
    touchClickAction(e.pageX, e.pageY);
  }
});


/**
* Uses the information from a click and selected values to draw a shape into
* the svg and add it to the real time model
* @preconditions - A user has touched or clicked somewhere on the svg and 
*             there is not an object currently selected
* @postconditions - some sort of object has been added to the svg and the model 
* @param - {x,y} the x and y position of the mouse click from the click event
**/
function touchClickAction(x,y){
	//get the mouse position on the click
    var mousex = (x - $('svg').offset().left) + $(window).scrollLeft();
    var mousey = (y - $('svg').offset().top) + $(window).scrollTop();

    //if you are in the variable tab
    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
      //get the value of height and width from the sliders
      var standardWidth = document.getElementById("shapeWidth").value;
      var standardHeight = document.getElementById("shapeHeight").value;
        
      //the label to put on the new object
      var label = document.getElementById('varLabel').value;
      shapeColor = getShapeColor();
      //if it doesn't have a shape, make an ellipse with 0 size
      if (selectedShape == "noShape")
      {
        var standardWidth = 50;
        var standardHeight = 1;
	      shapeColor = '#FFFFFF';	
      }

      //add the shape into the real time model
      var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, label, selectedShape, shapeColor);
      //use the real time object to draw the shape in the svg
      drawIntoSVG(newCausalVar);
    }

    //if you are in the connection tab
    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
      //source and target are the start and end points of the connection
      //every connection starts at click point, with no vertices, and is the same size
      var source = { x:mousex, y:mousey };
      var target = { x:mousex+100, y:mousey+100 };
      var label = document.getElementById("connLabel").value;
      var arrow = selectedArrow;
      var vertices = [];
    
      var newCausalConn = createNewCausalConn(source, target, label, vertices, getConnectionColor(), arrow);
      drawIntoSVG(newCausalConn);
    }
	
	//if you are in the connection tab
    if($('.TabbedPanelsTabSelected').attr('id') == "loop-tab")
    {
      var label = document.getElementById('loopLabel').value;
      //add the loop into the real time model
      var newCausalLoop = createNewCausalLoop(mousex, mousey, selectedLoop, label);
      //use the real time object to draw the shape in the svg
      drawIntoSVG(newCausalLoop);
    }
	
}