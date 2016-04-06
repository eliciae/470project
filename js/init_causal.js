//this is the one for the server
var clientId = '707956241542-t1qe821rk6jkmnmrcth0aafrjcfjg441.apps.googleusercontent.com';

//this is the local one
//var clientId = '707956241542-4s76mlqlkm2rol57nneobntvjb6h5sck.apps.googleusercontent.com';

var localModel;


if (!/^([0-9])$/.test(clientId[0])) 
{
  alert('Invalid Client ID - did you forget to insert your application Client ID?');
}
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

authorize();


/**
* This is how we get the realtime api to work with our custom types
* @preconditions - Realtime Utils authorization has passed
* @postconditions - Call this function before calling gapi.drive.realtime.load
**/
function registerCustomTypes()
{
 //CAUSAL VAR REGISTRATION
  var causalVar = function () { };

  function initializeCausalVar()
  {
      this.x = 0;
      this.y = 0;
      this.width = 100;
      this.height = 100;
      this.label = "label";
      this.color = "red";
      this.shape = "ellipse"
      this.idName = "";
  }

  gapi.drive.realtime.custom.registerType(causalVar, 'causalVar');

  causalVar.prototype.x = gapi.drive.realtime.custom.collaborativeField('x');
  causalVar.prototype.y = gapi.drive.realtime.custom.collaborativeField('y');
  causalVar.prototype.width = gapi.drive.realtime.custom.collaborativeField('width');
  causalVar.prototype.height = gapi.drive.realtime.custom.collaborativeField('height');
  causalVar.prototype.label = gapi.drive.realtime.custom.collaborativeField('label');
  causalVar.prototype.color = gapi.drive.realtime.custom.collaborativeField('color');
  causalVar.prototype.shape = gapi.drive.realtime.custom.collaborativeField('shape');
  causalVar.prototype.idName = gapi.drive.realtime.custom.collaborativeField('idName');

  gapi.drive.realtime.custom.setInitializer(causalVar, initializeCausalVar);

  //CONNECTION REGISTRATION
  var causalConn = function() {};

  function initializeCausalConn()
  {
    this.vertices = [];
    this.source = null;
    this.target = null;
    this.label = "";
    this.idName = "";
    this.color = "#FFFFFF";
    this.dashed = '';
    this.shape = "connection";
    this.arrow  = "";
  }

  gapi.drive.realtime.custom.registerType(causalConn, 'causalConn');

  causalConn.prototype.vertices = gapi.drive.realtime.custom.collaborativeField('vertices');
  causalConn.prototype.source = gapi.drive.realtime.custom.collaborativeField('source');
  causalConn.prototype.target = gapi.drive.realtime.custom.collaborativeField('target');
  causalConn.prototype.label = gapi.drive.realtime.custom.collaborativeField('label');
  causalConn.prototype.idName = gapi.drive.realtime.custom.collaborativeField('idName');
  causalConn.prototype.color = gapi.drive.realtime.custom.collaborativeField('color');
  causalConn.prototype.dashed = gapi.drive.realtime.custom.collaborativeField('dashed');
  causalConn.prototype.shape = gapi.drive.realtime.custom.collaborativeField('shape');
  causalConn.prototype.arrow = gapi.drive.realtime.custom.collaborativeField('arrow');
  

  gapi.drive.realtime.custom.setInitializer(causalConn, initializeCausalConn);
  
   //LOOP REGISTRATION
  var causalLoop = function() {};
  
  function initializeCausalLoop()
  {
      this.x = 0;
      this.y = 0;
      this.type = "ccb";
      this.shape = "loop"
      this.label = "";
      this.idName = "";
  }

  gapi.drive.realtime.custom.registerType(causalLoop, 'causalLoop');

  causalLoop.prototype.x = gapi.drive.realtime.custom.collaborativeField('x');
  causalLoop.prototype.y = gapi.drive.realtime.custom.collaborativeField('y');
  causalLoop.prototype.type = gapi.drive.realtime.custom.collaborativeField('type');
  causalLoop.prototype.shape = gapi.drive.realtime.custom.collaborativeField('shape');
  causalLoop.prototype.idName = gapi.drive.realtime.custom.collaborativeField('idName');
  causalLoop.prototype.label = gapi.drive.realtime.custom.collaborativeField('label');

  gapi.drive.realtime.custom.setInitializer(causalLoop, initializeCausalLoop);

}

/**
* Verify the user's google account
* Will either prompt for a log in, or accept a logged in user
* @preconditions - realtimeUtils has been initialized
* @postconditions - 
**/
  function authorize() {
    // Attempt to authorize
    realtimeUtils.authorize(function(response){
      if(response.error){
        // Authorization failed because this is the first time the user has used your application,
        // show the authorize button to prompt them to authorize manually.
        var button = document.getElementById('auth_button');
        button.classList.add('visible');
        button.addEventListener('mousedown', function () {
          realtimeUtils.authorize(function(response){
            dostart();
          }, true);
        });
      } else {
          dostart();
      }
    }, false);
  }


/**
* Check whether the file is new, or being loaded from an old session and choose the appropriate action
* @preconditions - realtime utils has been initialized and has an id parameter
* @postconditions - 
**/
  function dostart() 
  {
	  $('#markup-tab').click(); 
	  
    // With auth taken care of, load a file, or create one if there
    // is not an id in the URL.
    var id = realtimeUtils.getParam('id');

    //allows for custom types (needs to be done before load)
    registerCustomTypes();
      
    if (id) 
    {
      // Load the document id from the URL
      realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
    } 
    else 
    {
      // Create a new document, add it to the URL
      realtimeUtils.createRealtimeFile('New Causal Loop Diagram', function(createResponse) {
        window.history.pushState(null, null, '?id=' + createResponse.id);
        realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
      });
    }
  }


/**
* This is used when a new session needs to be created. It starts out with an empty model
* and adds a colloborative counter to keep track of ids
* It also adds an event listener for when the root is changed
* @preconditions - the model has been initialized
* @postconditions - 
* @param - {model} the real time model where all of our objects are stored
**/
  function onFileInitialize(model) 
  {
    localModel = model;

    //the shared count of objects
    var countObjectID = model.createString();
    var zero = 0;
    countObjectID.setText(zero.toString());
    model.getRoot().set('countObjectID', countObjectID);
    incrementObjectID();

    model.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
  }


  /**
  * If the file was prviously initialized, we just need to load it
  * Draw everything from the model and add a listener for changes
  * @preconditions - A file was previously initialized and there is a model with data to read from
  * @postconditions - All data that was stored in the model has been drawn into the svg
  * @param - {doc} the pre-existing document that we read the model from
  **/
  function onFileLoaded(doc) 
  {
    localModel = doc.getModel();

    redraw();
  
    localModel.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
  }


/**
* Gets the next id number from the collaborative object
* this needs to be shared so that the ids stay in sync
* @preconditions - the model and countObjectID within it both exist
* @postconditions - the count remains unchanged
**/
function getObjectID()
{
  return localModel.getRoot().get('countObjectID');
}

/**
* Increases the collab count 
* @preconditions - the model and countObjectID within it both exist
* @postconditions - the object id has been increased by one in the model
**/
function incrementObjectID()
{
  var intId = parseInt(localModel.getRoot().get('countObjectID'));
  intId++;
  localModel.getRoot().set('countObjectID', intId.toString());
}


/**
* adds a new causal variable to the model with the gievn parameters
* @preconditions - the local model is initialized 
* @postconditions - a causal variable has been added to the model and the collab count has been incremented
* @param {x, y} the x, y coords to draw at 
* @param {width, height} of the shape to draw
* @param {label} the label that will display on the variable in the diagram
* @param {shape} name of shape to draw
* @param {color} in hex of the shape
**/
function createNewCausalVar(x, y, width, height, label, shape, color)
{
  var causalVarShape = localModel.create('causalVar');
  causalVarShape.x = x;
  causalVarShape.y = y;
  causalVarShape.width = width;
  causalVarShape.height = height;
  causalVarShape.label = label;
  causalVarShape.color = color;
  causalVarShape.shape = shape;
  causalVarShape.idName = getObjectID();

  localModel.getRoot().set(getObjectID(), causalVarShape);
  incrementObjectID();

  return causalVarShape;
}

/**
* adds a new causal connection to the model with the given parameters
* @preconditions - the local model is initialized 
* @postconditions - a causal connection has been added to the model and the collab count has been incremented
* @param {source, target} either an id of a variable, or x,y coord for the start and end of the connection
* @param {label} the label that will display on the connection in the diagram
* @param {vertices} an array of vertex locations
* @param {color} in hex of the connection
* @param {arrow} the type of arrow head to display (+,-)
**/
function createNewCausalConn(source, target, label, vertices, color, arrow)
{
  var causalConn = localModel.create('causalConn');
  causalConn.vertices = vertices;
  causalConn.source = source;
  causalConn.target = target;
  causalConn.label = label;
  causalConn.color = color;
  causalConn.dashed = '';
  causalConn.idName = getObjectID();
  causalConn.arrow = arrow;

  localModel.getRoot().set(getObjectID(), causalConn);
  incrementObjectID();

  return causalConn;
}

/**
* adds a new causal loop to the model with the given parameters
* @preconditions - the local model is initialized 
* @postconditions - a causal loop has been added to the model and the collab count has been incremented
* @param {x, y} the x, y coords to draw at 
* @param {type} of loop to show
**/
function createNewCausalLoop(x, y, type, label)
{
  var causalLoop = localModel.create('causalLoop');
  causalLoop.x = x;
  causalLoop.y = y;
  causalLoop.type = type;
  causalLoop.label = label;
  causalLoop.idName = getObjectID();

  localModel.getRoot().set(getObjectID(), causalLoop);
  incrementObjectID();

  return causalLoop;
}