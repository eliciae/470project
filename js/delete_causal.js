function somethingWasDeleted()
{
  //get any of these tags with a value - this means they are collaborative
  numSvgCollabElems = $(".Ellipse, .Rect, .Arrow, .Image").length;

  //the number of elements has to be subtracted by one because of the count obj
  var numModelElems = localModel.getRoot().size - 1;

  //if there are more svg elements than model elements, something has been deleted
  return (numSvgCollabElems > numModelElems);
}

function deleteShape()
{
	 if (selectionIsShape() || selectionIsLoop())
   {
    //get all the links connecnted to the shape that is being deleted
    links = graph.getConnectedLinks(getCurrentCell());
    console.log(links[0]);
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
	 }
}

function deleteConn()
{
	if (currentObject.prop("tagName") == "g")
  { 
	 //find selected item in model and delete it 
	  localModel.getRoot().delete(getModelElBySvgSelectedID().idName); 
	  //delete it in the svg
		getCurrentConnCell().remove();
	}
}


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