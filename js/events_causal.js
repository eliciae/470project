

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
        els[i].addEventListener('click', selectEllipse, false);
    }
  }
  else if (shape == "Rect")
  {
    var els = document.getElementsByClassName("Rect");
    for (var i = 0; i < els.length; i++) 
    {
        els[i].addEventListener('click', selectRect, false);
    }
  }
}


function selectEllipse()
{
  removeOldSelections();
  $( this ).find('ellipse').attr('class', 'selectObject');
}

function selectRect()
{
  removeOldSelections();
  $( this ).find('rect').attr('class', 'selectObject');
}

function removeOldSelections()
{
  var els = document.getElementsByClassName("selectObject");
  for (var i = 0; i < els.length; i++) 
  {
    $(els[i]).attr('class', '');
  }
}



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