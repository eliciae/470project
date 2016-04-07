
/**
* This is added as a listener function for when there is some sort of event on the model root of rt
* It checks all the model elements for things that are new or deleted and adds or removed them
* @preconditions - there has been an event on the rt model
* @postconditions - any new objects added by other collaborators have been added to the local svg
              -any deleted items removed by other collaborators have been removed from the local svg
* @param {evt} - the event that fired on the rt model
**/
function addAndDeleteEvent(evt) 
{
  var events = evt.events;
  var eventCount = evt.events.length;
  for (var i = 0; i < eventCount; i++) 
  {
    //these lines are handy for seeing when events fire, so I didn't want to remove them completely
    // console.log('Event type: '  + events[i].type);
    // console.log('Local event: ' + events[i].isLocal);
    // console.log('User ID: '     + events[i].userId);
    // console.log('Session ID: '  + events[i].sessionId);


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


/**
* Checks if a given model key exists as a value on an svg element
* i.e. for checking if an object with the given key needs to be added or not
* @return - true if the kay already exists in the svg (the element has already been added)
        -false if the key is not found as a value in the svg
**/
function keyInSVG(key)
{
  return ($("ellipse[value='"+ key +"']").length)
          || ($("rect[value='"+ key +"']").length)
          || ($("path[value='"+ key +"']").length)
          || ($("image[value='"+ key +"']").length);
}


/**
* Goes through everything in the rt shared model and draws it into the svg
* @preconditions - the svg is blank. You don't want to draw everything over top if it already exists
* @postconditions - everything in the shared model has been drawn into the local svg
**/
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

  //draw the connections last! This is very important 
  //becase the connections use ids to elements to connect
  //so the element with the id needs to be in there before you draw the conn
  for (var k = 0; k < connectionIDs.length; k++){
    drawIntoSVG(connectionIDs[k]);
  }
}