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

function restoreDefaults(shape)
{
  if (shape == 'ellipse')
  {
    defaultsForEllipse();
  }
  else if (shape == 'rect')
  {
    defaultsForRect();
  }
  else if (shape == 'connection')
  {
    defaultsForConnection();
  }
}

function defaultsForRect()
{
  document.getElementById('shapeWidth').value = defaultRectWidth;
  document.getElementById('shapeHeight').value = defaultRectHeight;
  $(".full").spectrum("set", defaultShapeColor);
  $('#shapeColor').attr('value', defaultShapeColor);
  document.getElementById('varLabel').value = defaultRectLabel;
}

function defaultsForEllipse()
{
  document.getElementById('shapeWidth').value = defaultEllipseWidth;
  document.getElementById('shapeHeight').value = defaultEllipseHeight;
  $(".full").spectrum("set", defaultShapeColor);
  $('#shapeColor').attr('value', defaultShapeColor);
  document.getElementById('varLabel').value = defaultEllipseLabel;
}

function defaultsForConnection()
{
  $(".full").spectrum("set", defaultConnectionColor);
  $('#linkColor').attr('value', defaultConnectionColor);
  document.getElementById('connLabel').value = defaultConnectionLabel;
}
