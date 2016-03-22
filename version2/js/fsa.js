//this is the one for the server
var clientId = '707956241542-t1qe821rk6jkmnmrcth0aafrjcfjg441.apps.googleusercontent.com';

//this is the local one
//var clientId = '707956241542-4s76mlqlkm2rol57nneobntvjb6h5sck.apps.googleusercontent.com';

var localModel;
var count = 0;
var countString = "0";


if (!/^([0-9])$/.test(clientId[0])) {
alert('Invalid Client ID - did you forget to insert your application Client ID?');
}
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

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
      this.name = "name";
      this.color = "#FFFFFF";
      this.shape = "ellipse"
	  this.idName = "";
  }

  gapi.drive.realtime.custom.registerType(causalVar, 'causalVar');

  causalVar.prototype.x = gapi.drive.realtime.custom.collaborativeField('x');
  causalVar.prototype.y = gapi.drive.realtime.custom.collaborativeField('y');
  causalVar.prototype.width = gapi.drive.realtime.custom.collaborativeField('width');
  causalVar.prototype.height = gapi.drive.realtime.custom.collaborativeField('height');
  causalVar.prototype.name = gapi.drive.realtime.custom.collaborativeField('name');
  causalVar.prototype.color = gapi.drive.realtime.custom.collaborativeField('color');
  causalVar.prototype.shape = gapi.drive.realtime.custom.collaborativeField('shape');
  causalVar.prototype.idName = gapi.drive.realtime.custom.collaborativeField('idName');

  gapi.drive.realtime.custom.setInitializer(causalVar, initializeCausalVar);


  var causalConn = function() {};

  function initializeCausalConn()
  {
    this.vertices = [];
    this.source = null;
    this.target = null;
    this.label = "";
    this.idName = "";
    this.shape = "connection";
  }

  gapi.drive.realtime.custom.registerType(causalConn, 'causalConn');

  causalConn.prototype.vertices = gapi.drive.realtime.custom.collaborativeField('vertices');
  causalConn.prototype.source = gapi.drive.realtime.custom.collaborativeField('source');
  causalConn.prototype.target = gapi.drive.realtime.custom.collaborativeField('target');
  causalConn.prototype.label = gapi.drive.realtime.custom.collaborativeField('label');
  causalConn.prototype.idName = gapi.drive.realtime.custom.collaborativeField('idName');
  causalConn.prototype.shape = gapi.drive.realtime.custom.collaborativeField('shape');

  gapi.drive.realtime.custom.setInitializer(causalConn, initializeCausalConn);
  
  //CONNECTION REGISTRATION
}


  authorize();

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
    if (id) {
      //allows for custom types (needs to be done before load)
      registerCustomTypes();

      // Load the document id from the URL
      realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
    } else {
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

    var string = model.createString();
    string.setText('Welcome to the Quickstart App!');
    model.getRoot().set('demo_string', string);
    model.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
  }

  // After a file has been initialized and loaded, we can access the
  // document. We will wire up the data model to the UI.
  function onFileLoaded(doc) 
  {
   // alert("load");
    localModel = doc.getModel();
    count = localModel.getRoot().size;
    alert(localModel.getRoot().size);
    countString = count.toString();

    var collaborativeString = doc.getModel().getRoot().get('demo_string');
    wireTextBoxes(collaborativeString);

    redraw();
  
    localModel.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
  }

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
          //a list of all the item names in the model
          var modelList = localModel.getRoot().keys();

          modelList.forEach(function(key)
          {
             //if the model element does NOT exists in the SVG, then create it 
             if (keyInSVG(key))
             {
               drawShape(localModel.getRoot().get(key));
             }
          });
			   }
		  }
		}

    function keyInSVG(key)
    {
      return !($("ellipse[value='"+ key +"']").length)
            && !($("rect[value='"+ key +"']").length)
            && !($("path[value='"+ key +"']").length);
    }

    // Connects the text boxes to the collaborative string
    function wireTextBoxes(collaborativeString) {
        var textArea1 = document.getElementById('text_area_1');
        var textArea2 = document.getElementById('text_area_2');

        gapi.drive.realtime.databinding.bindString(collaborativeString, textArea1);
        gapi.drive.realtime.databinding.bindString(collaborativeString, textArea2);
    }







var selectedShape ="ellipse";

var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
});

function state(x, y, label) {
    
    var cell = new joint.shapes.fsa.State({
        position: { x: x, y: y },
        size: { width: 60, height: 60 },
        attrs: {
            text : { text: label, fill: '#000000', 'font-weight': 'normal' },
            'circle': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2
            }
        }
    });
    graph.addCell(cell);
    return cell;
}

function ellipse(cVar) {
	
    var cell = new joint.shapes.basic.Ellipse({
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.name, fill: '#000000', 'font-weight': 'normal' },
            'ellipse': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2,
				        value: cVar.idName	
            }	
        }
    });
	
	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
			}
	}
	
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
	

	paper.on('cell:pointerup', 
		function(cellView, evt, x, y) { 
			cVar.x = cell.get("position").x;
			cVar.y = cell.get("position").y;
    	}
	);
	
	graph.addCell(cell);
	
	
    return cell;
}


function rect(cVar) {
	
    var cell = new joint.shapes.basic.Rect({
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.name, fill: '#000000', 'font-weight': 'normal' },
            'rect': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2,
				        value: cVar.idName
            }
        }
    });
	
	function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
			}
	}
	
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
	

	paper.on('cell:pointerup', 
		function(cellView, evt, x, y) { 
			cVar.x = cell.get("position").x;
			cVar.y = cell.get("position").y;
    	}
	);
	
	graph.addCell(cell);
	
    return cell;
}


function link(source, target, label, vertices) {
    
    var cell = new joint.shapes.fsa.Arrow({
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: 0.5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []		
    });
    graph.addCell(cell);
    return cell;
}


function connection(cConn) 
{
    //if the id is set, it is pointing to a variable, not a point.
    // this means we have to get the model id, rather than the one we created.
    var setSource = cConn.source;
    var setTarget = cConn.target;
    
    if (!cConn.source.x)
    {
      alert("pointing to something source: " + cConn.source);
      setSource = getModelIDFromVarID(cConn.source)
    }
    if (!cConn.target.x)
    {
      alert("pointing to something target: " + cConn.target);
      setTarget = getModelIDFromVarID(cConn.target)
    }

    var cell = new joint.shapes.fsa.Arrow({
        source: setSource,
        target: setTarget,
        labels: [{ position: 0.5, attrs: { text: { text: cConn.label || '', 'font-weight': 'bold' } } }],
        vertices: cConn.vertices || [],
        attrs: {
          'path': {
            value: cConn.idName
          }
        }
    });

    function updateSvgElement(evt){
      if (!evt.isLocal){
        var s = cConn.source;
        var t = cConn.target;

        cell.set('vertices', cConn.vertices);

        if (s.x)
          cell.set('source', cConn.source);
        else
        {
          var source = getModelIDFromVarID(s);
          cell.set('source', source);
        }
        if (t.x)
          cell.set('target', cConn.target);
        else
        {
          var target = getModelIDFromVarID(t);
          cell.set('target', target)
        }
      }
  }
  
  //if the associated model object is changed, then update the svg element
  cConn.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
  

  paper.on('cell:pointerup', 
    function(cellView, evt, x, y) 
    { 
      var s = cell.get('source');
      var t = cell.get('target');

      cConn.vertices = cell.get('vertices');

      //if there is an id, it is pointing to a variable, so set the id as the collaborative id
      if (s.id)
        cConn.source = getVarIDFromSVG(s);
      else
        cConn.source = s;
      if (t.id)
        cConn.target = getVarIDFromSVG(t);
      else
        cConn.target = t;
      }
  );

    graph.addCell(cell);
    return cell;
}


function getVarIDFromSVG(node)
{
  //check if the thing you are connecting is an ellipse
  var child = $('g[model-id="' + node.id + '"]').find('ellipse');
  //if there is no value, then there is no ellipse there, try rect
  if (child.attr("value") == undefined)
  {
    child = $('g[model-id="' + node.id + '"]').find('rect');
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
  alert("Model ID: " + modelId);
  return { id: modelId };
}


var start = new joint.shapes.fsa.StartState({ position: { x: 50, y: 530 } });
graph.addCell(start);

var code  = state(180, 390, 'code');

// var slash = state(340, 220, 'slash');
// var star  = state(600, 400, 'star');
// var line  = state(190, 100, 'line');
// var block = state(560, 140, 'block');


 link(start, code,  'start');
// link(code,  slash, '/');
// link(slash, code,  'other', [{x: 270, y: 300}]);
// link(slash, line,  '/');
// link(line,  code,  'new\n line');
// link(slash, block, '*');
// link(block, star,  '*');
// link(star,  block, 'other', [{x: 650, y: 290}]);
// link(star,  code,  '/',     [{x: 490, y: 310}]);
// link(line,  line,  'other', [{x: 115,y: 100}, {x: 250, y: 50}]);
// link(block, block, 'other', [{x: 485,y: 140}, {x: 620, y: 90}]);
// link(code,  code,  'other', [{x: 180,y: 500}, {x: 305, y: 450}]);

//var source = ellipse(100, 100, 0, 0, "a");
//var target = ellipse(500, 100, 0, 0, "b");

function createNewCausalVar(x, y, width, height, label, shape)
{
  var causalVarShape = localModel.create('causalVar');
  causalVarShape.x = x;
  causalVarShape.y = y;
  causalVarShape.width = width;
  causalVarShape.height = height;
  causalVarShape.name = label;
  causalVarShape.color = "#000000";
  causalVarShape.shape = shape;
  causalVarShape.idName = countString;

  localModel.getRoot().set(countString, causalVarShape);
  incrementCount();

  return causalVarShape;
}

function createNewCausalConn(source, target, label, vertices)
{
  var causalConn = localModel.create('causalConn');
  causalConn.vertices = vertices;
  causalConn.source = source;
  causalConn.target = target;
  causalConn.label = label;
  causalConn.idName = countString;

  localModel.getRoot().set(countString, causalConn);
  incrementCount();

  return causalConn;
}


function drawShape(cVar)
{
	var cell;
  if (cVar.shape == "ellipse" || cVar.shape == "noShape")
  {
    cell = ellipse(cVar);
  }
  else if (cVar.shape == "rect")
  {
    cell = rect(cVar);
  }
  //not really a cVar, cConn
  else //if (cVar.shape == "connection")
  {
    cell = connection(cVar);
  }
  
	/*function updateSvgElement(evt){
			if (!evt.isLocal){
				cell.position(cVar.x, cVar.y);
			}
	}
	
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
	

	paper.on('cell:pointerup', 
		function(cellView, evt, x, y) { 
			cVar.x = cell.get("position").x;
			cVar.y = cell.get("position").y;
    	}
	);
	
	graph.addCell(cell);*/
}

function incrementCount()
{
  count++;
  countString = count.toString();
}


function drawConnection(causalConn)
{
  connection(causalConn);
}


function redraw()
{
	var connectionIDs = [];
  for (var i = 1; i <= localModel.getRoot().size; i++){
      if (localModel.getRoot().get(i.toString()) != null){  
	  
	  //put all connections in an array to iterate through later
	  	if (localModel.getRoot().get(i.toString()).shape == "connection"){
			connectionIDs.push(localModel.getRoot().get(i.toString()));
		}
        else {
			drawShape(localModel.getRoot().get(i.toString()));
		}
      }
   }
   alert("num connections: " + connectionIDs.length);
   for (var k = 0; k < connectionIDs.length; k++){
	   alert(connectionIDs[k].source + " "+ connectionIDs[k].target);
      	drawShape(connectionIDs[k]);
   }
}

function updateShape(id)
{
	var modelObj = localModel.getRoot().get(id);
	var htmlObj = $('.' + id);
	htmlObj.position(modelObj.x, modelObj.y);
}



$('#rectShape').on('click', function(){
    selectedShape = "rect";
});
$('#ellipseShape').on('click', function(){
    selectedShape = "ellipse";
});
$('#noShape').on('click', function(){
    selectedShape = "noShape";
});


$('svg').on('click', function(e){

    var mousex = (e.pageX - $('svg').offset().left) + $(window).scrollLeft();
    var mousey = (e.pageY - $('svg').offset().top) + $(window).scrollTop();

    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
		var standardWidth = 75;
		var standardHeight = 50;
        

		if (selectedShape == "noShape"){
			var standardWidth = 0;
			var standardHeight = 0;
		}
        var newCausalVar = createNewCausalVar(mousex, mousey, standardWidth, standardHeight, selectedShape, selectedShape);
		
        drawShape(newCausalVar);
       
        $('#markup-tab').click();
    }
    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
      var source = { x:mousex, y:mousey };
      var target = { x:mousex+100, y:mousey+100 };
      var label = "connection";
      var vertices = [];

      var newCausalConn = createNewCausalConn(source, target, label, vertices);
      drawConnection(newCausalConn);
        $('#markup-tab').click();
    }
});









