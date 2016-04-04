function getCurrentCell()
{
  //get the joint js cell
  //get the parent g element so we can get the model id
  var parent = currentObject.parents("g[model-id]");
  //the model-id is assigned by joint js
  var modelId = parent.first().attr("model-id");
  cell = graph.getCell(modelId);
  return cell; 
}

function getCurrentConnCell()
{
  var modelId = currentObject.attr("model-id");
  cell = graph.getCell(modelId);
  return cell; 
}

//returns the model el that has the corresponding id to currentCell
function getModelElBySvgSelectedID()
{
	if (currentObject.prop("tagName") == "rect")
		return localModel.getRoot().get(getCurrentCell().get("attrs").rect.value);
	else if (currentObject.prop("tagName") == "ellipse")
		return localModel.getRoot().get(getCurrentCell().get("attrs").ellipse.value);
  else if (currentObject.prop("tagName") == "g")
    return localModel.getRoot().get(getCurrentConnCell().get("attrs").path.value);
  else if (currentObject.prop("tagName") == "image")
    return localModel.getRoot().get(getCurrentCell().get("attrs").image.value);
}

function getVarIDFromSVG(nodeid)
{
  //check if the thing you are connecting is an ellipse
  var child = $('g[model-id="' + nodeid + '"]').find('ellipse');
  //if there is no value, then there is no ellipse there, try rect
  if (child.attr("value") == undefined)
  {
    child = $('g[model-id="' + nodeid + '"]').find('rect');
  }
  //return the value attribute value of the thing you are pointing to
  return child.attr('value');
}


function getModelIDFromVarID(varID)
{
  //find the element with the matching id from the model
  var el = $("ellipse[value='" + varID + "']");
  //if nothing found
  if (!el.length)
  {
    el = $("rect[value='" + varID + "']");
  }

  //get the parent g element so we can get the model id
  var parent = el.first().parents("g[model-id]");
  //the model-id is assigned by joint js
  var modelId = parent.first().attr("model-id");

  //return the id in the structure that joint js expects
  return { id: modelId };
}