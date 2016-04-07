//if you click the svg and you aren't in a g tag, everything should unselect
$('svg').on('mousedown', function(event)
{
  if(!$(event.target).closest('g').length) 
  {
    removeOldSelections();
  }      
});


/**
* Sets the object that was clicked in the event as the currentObject
* Adds a class which highlights the selected object
* Changes the current tab to the one associated with the currentObject
* Calls the update on values in the selected object's tab
* @preconditions
* @postconditions - the clicked object is highlighted
              -all previous selectons are removed
              -the clicked object is set as current
              -the tab is set to match the object type
              -the values in the tab are set to match the object
* @param {event} - the event contains a shape which is a string that will be matched
**/
function selectShape(event)
{
  shape = event.data.shape;

  removeOldSelections();
  //show delete button
  $('#delete').show();

  if (shape == 'connection')
  {
    currentObject = $(this);

    //open connection tab & set tab values to be the selected item's values 
    $('#connection-tab').click();
    selectedArrow = getModelElBySvgSelectedID().arrow;
    updateValuesSelectedInConnectionTab();
  }
  else
  {
    currentObject = $(this).find(shape);

    selectedShape = getModelElBySvgSelectedID().shape;

    if (shape == 'loop')
    {
      $('#loop-tab').click();
      updateValuesSelectedInLoopTab();
    }
    else
    {
      //open variable tab & set tab values to be the selected item's values 
      $('#variable-tab').click();

      hideSizeAndColor();
      updateValuesSelectedInVaraiableTab();
    }
  }
  currentObject[0].classList.add('selectObject');
}


/**
* Removes all current selections in the svg and sets the current object to null
* @postconditions - nothing is selected by highlight in the svg
*                 -the current object is null
*                 -no tabs are shown as selected
*                 -the delete button is hidden 
*
**/
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


/**
* Check if the currently selected object is a shape, loop, or connection
* @return {boolean} - false if not the given type, or nothing selected
*                   -true if selected obj is the given type
**/
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