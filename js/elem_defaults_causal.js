//selections in the sidebar
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

/**
* Sets the selected values in the sidebar back to the default values
* @preconditions - nothing is selected in the svg
* @postconditions - all values are set to the list of default values
* @param {shape} that you are restoring the defaults on
**/
function restoreDefaults(shape)
{
  if (shape == 'connection')
  {
    defaultsForConnection();
    return;
  }
  if (shape == 'loop')
  {
    document.getElementById('loopLabel').value = "";
    return;
  }

  var width;
  var height;
  var label;

  if (shape == 'rect')
  {
    width = defaultRectWidth;
    height = defaultRectHeight;
    label = defaultRectLabel;
  }
  else if (shape == 'ellipse' || shape == 'noShape')
  {
    width = defaultEllipseWidth;
    height = defaultEllipseHeight;
    label = defaultEllipseLabel;
  }

  document.getElementById('shapeWidth').value = width;
  document.getElementById('shapeHeight').value = height;

  //set the view in the color picker
  $(".full").spectrum("set", defaultShapeColor);
  //set the actual value to be fetched from the color picker
  $('#shapeColor').attr('value', defaultShapeColor);

  document.getElementById('varLabel').value = label;
}


/**
* Sets the selected values in the sidebar back to the default values for connections
**/
function defaultsForConnection()
{
  $(".full").spectrum("set", defaultConnectionColor);
  $('#linkColor').attr('value', defaultConnectionColor);
  document.getElementById('connLabel').value = defaultConnectionLabel;
}