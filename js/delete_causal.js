
////////////////////
//DELETE LISTENERS//
////////////////////

//a listener for when someone presses the delete key - get rid of the object
//would be nice if this didn't listen to all key ups...
document.addEventListener('keyup', function(event)
{
  if (event.keyCode === 46)
  {
    deleteShape();
    deleteConn();
  }
});

/**
* This is for the red delete button that appears when you select an option
* a click listener is added which will delete the selected object on click
**/
$('#delete').click(function()
{
    deleteShape();
    deleteConn();
});




////////////////////
//DELETE FUNCTIONS//
////////////////////

/**
* Called when there is a change in the root of the real time model to
* check if that action was a delete
* @preconditions - a change has occurred on the model that was not local
* @postconditions - the model and svg remains unchanged, just a check
**/
function somethingWasDeleted()
{
  //get any of these tags with a value - this means they are collaborative
  numSvgCollabElems = $(".Ellipse, .Rect, .Arrow, .Image").length;

  //the number of elements has to be subtracted by one because of the count obj
  var numModelElems = localModel.getRoot().size - 1;

  //if there are more svg elements than model elements, something has been deleted
  return (numSvgCollabElems > numModelElems);
}


/**
* Checks that the selections is actually a shape or loop and 
* deletes the selected shape from the model and from the local svg
* this function also removes the connections that are going to or from 
* the shape being deleted
* @postconditions - the shape and associated links have been removed from the 
* local svg as well as the real time model
**/
function deleteShape()
{
  if (selectionIsShape() || selectionIsLoop())
   {
    //get all the links connecnted to the shape that is being deleted
    links = graph.getConnectedLinks(getCurrentCell());

    links.forEach(function(link)
    {
      var val = link.get("attrs").path.value;
      //remove the links from the model
      localModel.getRoot().delete(val);
    });

    //find selected item in model and delete it 
    localModel.getRoot().delete(getModelElBySvgSelectedID().idName); 
    //delete it in the svg
    getCurrentCell().remove();

    removeOldSelections();
  }
}


/**
* Checks that the selection is actually a connection and removes it from 
* the local svg and the real time model
* @postconditions - the connection and real time object have been removed
**/
function deleteConn()
{
  if (currentObject.prop("tagName") == "g")
  { 
    //find selected item in model and delete it 
    localModel.getRoot().delete(getModelElBySvgSelectedID().idName); 
    //delete it in the svg
    getCurrentConnCell().remove();
    removeOldSelections();
  }
}