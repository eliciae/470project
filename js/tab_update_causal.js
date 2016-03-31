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
      currentObject.attr('fill', shapeColor);
	  getModelElBySvgSelectedID().color = shapeColor;
	  
     //get the parent g element so we can get the model id
      var parent = currentObject.parents("g[model-id]");
      //the model-id is assigned by joint js
      var modelId = parent.first().attr("model-id");

      var id = getVarIDFromSVG(modelId);

      var sharedObject = localModel.getRoot().get(id);
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
    
  
  document.getElementById("varLabel").value = getModelElBySvgSelectedID().label;
  document.getElementById("shapeWidth").value = getModelElBySvgSelectedID().width;
  document.getElementById("shapeHeight").value = getModelElBySvgSelectedID().height;
  $(".full").spectrum("set", getModelElBySvgSelectedID().color);
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