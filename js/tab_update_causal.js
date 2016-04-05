var currentObject = null;

var shapeColor = getShapeColor();
var connectionColor = getConnectionColor();

var shapeWidth = document.getElementById("shapeWidth").value;
var shapeHeight = document.getElementById("shapeHeight").value;

function getShapeColor()
{
  return $('#shapeColor').attr('value');
}

function getConnectionColor()
{
  return $('#linkColor').attr('value');
}


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


function updateValuesSelectedInVaraiableTab()
{
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


function updateValuesSelectedInLoopTab()
{
  document.getElementById('ccb').checked = false;
  document.getElementById('ccr').checked = false;
  document.getElementById('ccn').checked = false;
  document.getElementById('ccp').checked = false;
  document.getElementById('cb').checked = false;
  document.getElementById('cr').checked = false;
  document.getElementById('cn').checked = false;
  document.getElementById('cp').checked = false;

  var modelEl = getModelElBySvgSelectedID();

  document.getElementById(modelEl.type).checked = true;
  document.getElementById("loopLabel").value = modelEl.label;
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

//label at realtime for the connections
document.getElementById('connLabel').addEventListener("keyup", function(){
  if (currentObject != null)
    if(selectionIsConnection())
    { 
        getCurrentConnCell().label(0, {attrs: {text: {text: document.getElementById('connLabel').value}}});
        getModelElBySvgSelectedID().label = document.getElementById('connLabel').value;
    }

  }, false);

//label at realtime for the loops
document.getElementById('loopLabel').addEventListener("keyup", function(){
  if (currentObject != null)
    if(selectionIsLoop())
    { 
        getCurrentCell().attr({text:{text: document.getElementById('loopLabel').value}});
        getModelElBySvgSelectedID().label = document.getElementById('loopLabel').value;
    }

  }, false);


$('#shapeR, #shapeE, #shapeN').click(function()
{
  if (currentObject == null)
  {
    restoreDefaults(selectedShape);
  }
});


$('#variable-tab').on('mousedown', function(event)
{
    $('#variable-tab').click(); 
    if (selectionIsConnection() || selectionIsLoop())
    {
      removeOldSelections();
    }
    if (currentObject == null)
    {
      restoreDefaults(selectedShape);
    }
});

$('#connection-tab').on('mousedown', function(event)
{
    $('#connection-tab').click(); 
    if (selectionIsShape() || selectionIsLoop())
    {
      removeOldSelections();
    }
    if (currentObject == null)
    {
      restoreDefaults('connection');
    }
});

$('#loop-tab').on('mousedown', function(event)
{
    $('#loop-tab').click(); 
    if (selectionIsConnection() || selectionIsShape())
    {
      removeOldSelections();
    }
    if (currentObject == null)
    {
      restoreDefaults('loop');
    }
});


function handleShapeChange(myRadio) {
    selectedShape = myRadio.value;
    //disable color and size adjusters when shape selected is "no shape"
    hideSizeAndColor();
  }

  function hideSizeAndColor()
  {
    if (selectedShape == "noShape") 
      $('.visibleOptions').hide();  
    else 
      $('.visibleOptions').show();
  }
  
  function handleLoopChange(myRadio) {
    selectedLoop = myRadio.value;
  }
  
  function handleArrowChange(myRadio) {
    selectedArrow = myRadio.value;
    if (currentObject != null){
      if(selectionIsConnection())
      { 
        getCurrentConnCell().label(1, {attrs: {text: {text: selectedArrow}}});
        getModelElBySvgSelectedID().arrow = selectedArrow;
      }
    }
  }


  var currentValue = "blank";
  $('#delete').hide();
  
  
  

  $(".full").spectrum({
    showPaletteOnly: true,
    showPalette:true,
    color: '#C9DAF8',
    preferredFormat: "hex",
    change: function(color){
      $(this).attr('value', color.toHexString());
      updateColor();
    },
      move: function (color) {
      
      },
      palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
      ]
    });