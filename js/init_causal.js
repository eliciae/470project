//this is the one for the server
var clientId = '707956241542-t1qe821rk6jkmnmrcth0aafrjcfjg441.apps.googleusercontent.com';

//this is the local one
//var clientId = '707956241542-4s76mlqlkm2rol57nneobntvjb6h5sck.apps.googleusercontent.com';

var localModel;
var count = 0;
var countString = "0";


if (!/^([0-9])$/.test(clientId[0])) 
{
  alert('Invalid Client ID - did you forget to insert your application Client ID?');
}
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

  authorize();

// Call this function before calling gapi.drive.realtime.load
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
    this.shape = "connection";
  }

  gapi.drive.realtime.custom.registerType(causalConn, 'causalConn');

  causalConn.prototype.vertices = gapi.drive.realtime.custom.collaborativeField('vertices');
  causalConn.prototype.source = gapi.drive.realtime.custom.collaborativeField('source');
  causalConn.prototype.target = gapi.drive.realtime.custom.collaborativeField('target');
  causalConn.prototype.label = gapi.drive.realtime.custom.collaborativeField('label');
  causalConn.prototype.idName = gapi.drive.realtime.custom.collaborativeField('idName');
  causalConn.prototype.color = gapi.drive.realtime.custom.collaborativeField('color');
  causalConn.prototype.shape = gapi.drive.realtime.custom.collaborativeField('shape');

  gapi.drive.realtime.custom.setInitializer(causalConn, initializeCausalConn);
}

  function authorize() {
    // Attempt to authorize
    realtimeUtils.authorize(function(response){
      if(response.error){
        // Authorization failed because this is the first time the user has used your application,
        // show the authorize button to prompt them to authorize manually.
        var button = document.getElementById('auth_button');
        button.classList.add('visible');
        button.addEventListener('click', function () {
          realtimeUtils.authorize(function(response){
            dostart();
          }, true);
        });
      } else {
          dostart();
      }
    }, false);
  }

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
      realtimeUtils.createRealtimeFile('New Quickstart File', function(createResponse) {
        window.history.pushState(null, null, '?id=' + createResponse.id);
        realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
      });
    }
  }

  // The first time a file is opened, it must be initialized with the
  // document structure. This function will add a collaborative string
  // to our model at the root.
  function onFileInitialize(model) {
    localModel = model;

    model.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
  }

  // After a file has been initialized and loaded, we can access the
  // document. We will wire up the data model to the UI.
  function onFileLoaded(doc) 
  {
    localModel = doc.getModel();
    count = localModel.getRoot().size;
    alert("model size: " + localModel.getRoot().size);
    countString = count.toString();

    redraw();
  
    localModel.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
  }


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
  causalVarShape.idName = countString;

  localModel.getRoot().set(countString, causalVarShape);
  incrementCount();

  return causalVarShape;
}

function createNewCausalConn(source, target, label, vertices, color)
{
  var causalConn = localModel.create('causalConn');
  causalConn.vertices = vertices;
  causalConn.source = source;
  causalConn.target = target;
  causalConn.label = label;
  causalConn.color = color;
  causalConn.idName = countString;

  localModel.getRoot().set(countString, causalConn);
  incrementCount();

  return causalConn;
}