

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
  for (var i = 1; i <= localModel.getRoot().size; i++){
      if (localModel.getRoot().get(i.toString()) != null){  
    
    //put all connections in an array to iterate through later
      if (localModel.getRoot().get(i.toString()).shape == "connection"){
      connectionIDs.push(localModel.getRoot().get(i.toString()));
    }
        else {
      drawShape(localModel.getRoot().get(i.toString()));
    }
      }
   }
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


$('svg').on('click', function(e){

    var mousex = (e.pageX - $('svg').offset().left) + $(window).scrollLeft();
    var mousey = (e.pageY - $('svg').offset().top) + $(window).scrollTop();

    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
		var standardWidth = 75;
		var standardHeight = 50;
        

		if (selectedShape == "noShape"){
			var standardWidth = 0;
			var standardHeight = 0;
		}
        var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, selectedShape, selectedShape);
		
        drawShape(newCausalVar);
       
        $('#markup-tab').click();
    }
    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
      var source = { x:mousex, y:mousey };
      var target = { x:mousex+100, y:mousey+100 };
      var label = "connection";
      var vertices = [];

      var newCausalConn = createNewCausalConn(source, target, label, vertices);
      drawConnection(newCausalConn);
        $('#markup-tab').click();
    }
});