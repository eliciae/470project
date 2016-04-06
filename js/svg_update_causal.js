function displayObjectChangedEvent(evt) 
{
  var events = evt.events;
  var eventCount = evt.events.length;
  for (var i = 0; i < eventCount; i++) 
  {
    console.log('Event type: '  + events[i].type);
    console.log('Local event: ' + events[i].isLocal);
    console.log('User ID: '     + events[i].userId);
    console.log('Session ID: '  + events[i].sessionId);
    //only draw and add to the model if it wasn't local
    if (!events[i].isLocal)
    {
  		//if something was deleted, clear the whole diagram and redraw it all
      if (somethingWasDeleted())
      {
        clearDiagram();
        redraw();
		  }
      //nothing was deleted, but need to check for new stuff
      else
      {
        //a list of all the item names in the model
        var modelList = localModel.getRoot().keys();

        modelList.forEach(function(key)
        {
          //the count will always be the key 1, don't try to draw it
          if (key == 'countObjectID')
          {
            return true;
          }
          //if the model element does NOT exists in the SVG, then create it 
          if (!keyInSVG(key))
          {
           drawIntoSVG(localModel.getRoot().get(key));
          }
        });
      }
    }
  }
}


function keyInSVG(key)
{
  return ($("ellipse[value='"+ key +"']").length)
         || ($("rect[value='"+ key +"']").length)
         || ($("path[value='"+ key +"']").length)
     || ($("image[value='"+ key +"']").length);
}



function redraw()
{
  var connectionIDs = [];
  var modelList = localModel.getRoot().keys();

  modelList.forEach(function(key)
  {
    var modelItem = localModel.getRoot().get(key);
    if (modelItem != null)
    {  
      //put all connections in an array to iterate through later
      if (modelItem.shape == "connection")
      {
        connectionIDs.push(modelItem);
      }
      else 
      {
        drawIntoSVG(modelItem);
      }
    }
  });

  for (var k = 0; k < connectionIDs.length; k++){
    drawIntoSVG(connectionIDs[k]);
  }
}