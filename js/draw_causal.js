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
        shapeColor = getShapeColor();
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
        var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, label, selectedShape, shapeColor);
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