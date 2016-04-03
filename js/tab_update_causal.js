/**
* This is called from the change listener on the color 
**/
function updateColor() 
{ 
  // get the current value of the input fields
  shapeColor = getShapeColor(); 
  connectionColor = getConnectionColor();

  //if there is an object selected, change the color
  if (currentObject != undefined)
  {
    //if the object is a shape
    if (selectionIsShape())
    {
      //set the color in the graph object
      //can't set the field as a variable, so just try both...
      getCurrentCell().attr({'ellipse': {fill: shapeColor}});
      getCurrentCell().attr({'rect': {fill: shapeColor}});

      //set the color in the real time model
      getModelElBySvgSelectedID().color = shapeColor;
    }

    //if the object is a connection
    if (selectionIsConnection())   
    {
      var modelId = currentObject.attr("model-id");

      connectionColor = getConnectionColor();

      //get the joint js cell
      getCurrentConnCell().attr({
        '.connection': { stroke: connectionColor },
        '.marker-source': { stroke: connectionColor, fill: connectionColor },
        '.marker-target': { stroke: connectionColor, fill: connectionColor }
      });
	  

      //get the id for the realtime object
      var id = currentObject.children("path[value]").first().attr('value');

      //set the color in the model
      localModel.getRoot().get(id).color = connectionColor;
    } 
  }
}


function updateValuesSelectedInVaraiableTab(){
  //select correct shape attribute
  document.getElementById('shapeR').checked = false;
  document.getElementById('shapeE').checked = false;
  document.getElementById('shapeN').checked = false;
  
  if (selectedShape == "rect"){
    document.getElementById('shapeR').checked = true;
  }
  else if (selectedShape == "ellipse"){
    document.getElementById('shapeE').checked = true;
  }
  else{
    document.getElementById('shapeN').checked = true;
  }
    
  
  document.getElementById("varLabel").value = getModelElBySvgSelectedID().label;
  document.getElementById("shapeWidth").value = getModelElBySvgSelectedID().width;
  document.getElementById("shapeHeight").value = getModelElBySvgSelectedID().height;
  $(".full").spectrum("set", getModelElBySvgSelectedID().color);
}

function updateValuesSelectedInConnectionTab()
{
  //select correct arrow head
  document.getElementById('negative').checked = false;
  document.getElementById('positive').checked = false;
  document.getElementById('regular').checked = false;

  if (selectedArrow == " - ")
  {
    document.getElementById('negative').checked = true;
  }
  else if (selectedArrow == " + ")
  {
    document.getElementById('positive').checked = true;
  }
  else
  {
    document.getElementById('regular').checked = true;
  }
  
  document.getElementById("connLabel").value = getModelElBySvgSelectedID().label;

  selectedShapeColor = getModelElBySvgSelectedID().color;
  $(".full").spectrum("set", selectedShapeColor);
  $('#linkColor').attr('value', selectedShapeColor);
}


//resizing at realtime
var widthRng = document.getElementById("shapeWidth");
var heightRng = document.getElementById("shapeHeight");

read("mousedown");
read("mousemove");

function read(evtType) {
    widthRng.addEventListener(evtType, function() {
     if (currentObject != null && selectionIsShape())
        resize();
    });
    heightRng.addEventListener(evtType, function() {
     if (currentObject != null && selectionIsShape())
       resize();
    });
}


function resize(){
  window.requestAnimationFrame(function () 
  {
    shapeWidth = document.getElementById("shapeWidth").value;
    shapeHeight = document.getElementById("shapeHeight").value; 
    getCurrentCell().resize(shapeWidth, shapeHeight); 
    getModelElBySvgSelectedID().width = document.getElementById("shapeWidth").value;
    getModelElBySvgSelectedID().height = document.getElementById("shapeHeight").value;
   });
}

//label at realtime for the variables
document.getElementById('varLabel').addEventListener("keyup", function(){
  if (currentObject != null)
    if(selectionIsShape())
    { 
        getCurrentCell().attr({text:{text: document.getElementById('varLabel').value}});
        getModelElBySvgSelectedID().label = document.getElementById('varLabel').value;
    }

  }, false);

//label at realtime for the variables
document.getElementById('connLabel').addEventListener("keyup", function(){
  if (currentObject != null)
    if(selectionIsConnection())
    { 
        getCurrentConnCell().label(0, {attrs: {text: {text: document.getElementById('connLabel').value}}});
        getModelElBySvgSelectedID().label = document.getElementById('connLabel').value;
    }

  }, false);


$('#shapeR, #shapeE, #shapeN').click(function()
{
  if (currentObject == null)
  {
    restoreDefaults(selectedShape);
  }
});