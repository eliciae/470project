var currentObject = null;

var shapeColor = getShapeColor();
var connectionColor = getConnectionColor();

var shapeWidth = document.getElementById("shapeWidth").value;
var shapeHeight = document.getElementById("shapeHeight").value;

//these are the slider input objects used to the set the shape
//height and width with listeners
var widthRng = document.getElementById("shapeWidth");
var heightRng = document.getElementById("shapeHeight");


function getShapeColor()
{
  return $('#shapeColor').attr('value');
}

function getConnectionColor()
{
  return $('#linkColor').attr('value');
}


/**
* This is called from the change listener on the color picker
* it will fire any time a color is changed, so you need to figure out which type it is on
* This sets the color of the current object, or the object about to be drawn
* It sets the color both locally and in the model
* @preconditions - the color has been changed on a color picker
* @postconditions - the color on the current object is updated in svg and rt model
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



///////////////
//TAB UPDATES//
///////////////

/**
* Changes the values displayed in the various selection options to match the 
* currently selected object
* @preconditions - an object is currently selected
*                -the correct tab for the object type is open
* @postconditions - the tabs reflect the value of whatever is currently selected
**/
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



/**
* Adds an event listener of the given type to the slider
* @preconditions - the width and height input objects are selected properly for use
* @postconditions - the slider and size of the object match and is changed in the model
* @param {evtType} - an event type to listen, this allows multiple 
* @return 
**/
addSliderListener("mousedown");
addSliderListener("mousemove");

function addSliderListener(evtType) {
    widthRng.addEventListener(evtType, function() {
     if (currentObject != null && selectionIsShape())
        resize();
    });
    heightRng.addEventListener(evtType, function() {
     if (currentObject != null && selectionIsShape())
       resize();
    });
}

/**
* Resizes the currently selected shape based on the slider input
* @preconditions - there is an object currently selected
*               -the object is shape, not a loop or connection
* @postconditions - the shape dimensions in the svg and model match the 
*                   values selcted in the slider input
**/
function resize()
{
  window.requestAnimationFrame(function () 
  {
    shapeWidth = document.getElementById("shapeWidth").value;
    shapeHeight = document.getElementById("shapeHeight").value; 
    getCurrentCell().resize(shapeWidth, shapeHeight); 
    getModelElBySvgSelectedID().width = document.getElementById("shapeWidth").value;
    getModelElBySvgSelectedID().height = document.getElementById("shapeHeight").value;
   });
}


/**
* a key listener for the input on labels - fires on key press in textboxes
* @preconditions - the ids exist in the html
* @postconditions - if something was selected, the label has been changed in svg and model
* @param {labelID} - the id on the html element for label input
**/
addLabelListener('varLabel');
addLabelListener('loopLabel');
addLabelListener('connLabel');


function addLabelListener(labelID)
{
  document.getElementById(labelID).addEventListener("keyup", function(){
  if (currentObject != null)
    if(selectionIsShape() || selectionIsLoop())
    { 
      getCurrentCell().attr({text:{text: document.getElementById(labelID).value}});
      getModelElBySvgSelectedID().label = document.getElementById(labelID).value;
    }
    else if (selectionIsConnection())
    {
      getCurrentConnCell().label(0, {attrs: {text: {text: document.getElementById(labelID).value}}});
      getModelElBySvgSelectedID().label = document.getElementById(labelID).value;
    }
  }, false);
}



$('#shapeR, #shapeE, #shapeN').click(function()
{
  if (currentObject == null)
  {
    restoreDefaults(selectedShape);
  }
});



/////////////////
//TAB LISTENERS//
/////////////////

/**
* adds a listener on each tab to change the defaults back
* @preconditions - the ids exist on the tabs
* @postconditions - defaults are restored on the tab of there is not an object selected
**/
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


/**
* When the shape type selection is changed, call this to change the value selected and 
* hide the size and color if necessary
* @postconditions - the value that was clicked is now shown as selected
* @param {myRadio} - the radio button that was clicked 
**/
function handleShapeChange(myRadio) 
{
  selectedShape = myRadio.value;
  //disable color and size adjusters when shape selected is "no shape"
  hideSizeAndColor();
}

function handleLoopChange(myRadio) 
{
  selectedLoop = myRadio.value;
}

function handleArrowChange(myRadio) 
{
  selectedArrow = myRadio.value;
  if (currentObject != null)
  {
    if(selectionIsConnection())
    { 
      getCurrentConnCell().label(1, {attrs: {text: {text: selectedArrow}}});
      getModelElBySvgSelectedID().arrow = selectedArrow;
    }
  }
}


/**
* Hides the size picker and color picker for when the selected shape is "noshape"
* @preconditions - the noshape option has been clicked
* @postconditions - the size and color are no longer visible 
**/
function hideSizeAndColor()
{
  if (selectedShape == "noShape") 
    $('.visibleOptions').hide();  
  else 
    $('.visibleOptions').show();
}


var currentValue = "blank";
$('#delete').hide();



/**
* Adds the color picker to the objects with the full class
* @preconditions - the full class exists on some objects
* @postconditions - the color picker has been added to the tabs
**/
$(".full").spectrum({
  showPaletteOnly: true,
  showPalette:true,
  color: '#C9DAF8',
  preferredFormat: "hex",
  change: function(color){
    $(this).attr('value', color.toHexString());
    updateColor();
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