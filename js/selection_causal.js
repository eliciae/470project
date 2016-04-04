// SELECTION

//Check what is selected
function selectionIsShape()
{
  if (currentObject == null)
  {
    return false;
  }
  return (currentObject.prop("tagName") == "ellipse" 
    || currentObject.prop("tagName") == "rect");
}

function selectionIsLoop()
{
  if (currentObject == null)
  {
    return false;
  }
  return (currentObject.prop("tagName") == "image");
}

function selectionIsConnection()
{
  if (currentObject == null)
  {
    return false;
  }
  return (currentObject.prop("tagName") == "g");
}


//Do selection
function selectEllipse()
{

  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $( this ).find('ellipse');
  currentObject.attr('class', 'selectObject');

  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();

  selectedShape = getModelElBySvgSelectedID().shape;
  hideSizeAndColor();
  updateValuesSelectedInVaraiableTab();
}

function selectRect()
{
  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $( this ).find('rect');
  currentObject.attr('class', 'selectObject');
  
  //open variable tab & set tab values to be the selected item's values 
  $('#variable-tab').click();
  selectedShape = getModelElBySvgSelectedID().shape;
  hideSizeAndColor();
  updateValuesSelectedInVaraiableTab();
}

function selectConnection()
{
	
  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $(this);
  this.classList.add('selectObject');
  
  //open connection tab & set tab values to be the selected item's values 
  $('#connection-tab').click();
  selectedArrow = getModelElBySvgSelectedID().arrow;
  updateValuesSelectedInConnectionTab();
}

function selectLoop()
{
  removeOldSelections();
  //show delete button
  $('#delete').show();
  currentObject = $( this ).find('image');
  currentObject.attr('class', 'selectObject');
  
  //open variable tab & set tab values to be the selected item's values 
  $('#notation-tab').click();
  selectedShape = getModelElBySvgSelectedID().shape;
}

//if you click the svg and you aren't in a g tag, everything should unselect
$('svg').on('mousedown', function(event)
{
  if(!$(event.target).closest('g').length) 
  {
    removeOldSelections();
  }      
});

//Remove current selection
function removeOldSelections()
{
	//hide delete button
  $('#delete').hide();		
  currentObject = null;
  //deselect tab
   $('#markup-tab').click();
  
  var els = document.getElementsByClassName("selectObject");
  for (var i = 0; i < els.length; i++) 
  {
    els[i].classList.remove('selectObject');
  }
  
}


