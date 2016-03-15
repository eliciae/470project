//this is local
//var clientId = '707956241542-t1qe821rk6jkmnmrcth0aafrjcfjg441.apps.googleusercontent.com';

//this is the server
var clientId = '707956241542-4s76mlqlkm2rol57nneobntvjb6h5sck.apps.googleusercontent.com';

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
    alert("load");
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
      for (var i = 0; i < eventCount; i++) {
        console.log('Event type: '  + events[i].type);
        console.log('Local event: ' + events[i].isLocal);
        console.log('User ID: '     + events[i].userId);
        console.log('Session ID: '  + events[i].sessionId);
        if (!events[i].isLocal){
			//only draw and add to the model if it wasn't local
			//check if there is an item with id count-1 in the svg
			//if there is NOT then create it
			var lastItemCreatedID = count -1;
			
			//if (document.getElementById(lastItemCreatedID.toString()) == null){
			//alert ("new item added: " + $("." + lastItemCreatedID.toString()).first());
			
			for (var i = 1; i <= localModel.getRoot().size; i++){			  
			  if (localModel.getRoot().get(i.toString()) != null){  
				if ($("." + i.toString()) != "[Object object]"){
					alert("new object added");
					drawShape(localModel.getRoot().get(i.toString()));
				}
			  }
			}
			
			
			
			/*if ($("." + lastItemCreatedID.toString()).first().toString() != "[Object object]" ){
				alert("new object added");
            	drawShape(localModel.getRoot().get(lastItemCreatedID.toString()));
			}*/
		//	else{
		//		alert("moved");
		//	}
        }
      }
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
  alert("ellipse drawing");
    var cell = new joint.shapes.basic.Ellipse({
        class: cVar.id,
        position: { x: cVar.x, y: cVar.y},
        size: { width: cVar.width, height: cVar.height },
        attrs: {
            text : { text: cVar.name, fill: '#000000', 'font-weight': 'normal' },
            'ellipse': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2
            }
        }
    });
	
	function updateSvgElement(){
		alert("updating cell");
		cell.position(cVar.x, cVar.y);
	}
	
      graph.addCell(cell);

      cell.on("change:position", function(element){
        cVar.x = element.get("position").x;
        cVar.y = element.get("position").y;
    });
	//if the associated model object is changed, then update the svg element
	cVar.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateSvgElement);
	
	

    return cell;
}


function rect(x, y, width, height, label) {
	
    var cell = new joint.shapes.basic.Rect({
        position: { x: x, y: y},
        size: { width: width, height: height },
        attrs: {
            text : { text: label, fill: '#000000', 'font-weight': 'normal' },
            'rect': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2
            }
        }
    });
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


function connection(source, target, label, vertices) {
    
    var cell = new joint.shapes.fsa.Arrow({
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: 0.5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []
    });
    graph.addCell(cell);
    return cell;
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

  alert("shape: " + shape);

  localModel.getRoot().set(countString, causalVarShape);

  //localModel.getRoot().get(countString).addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, updateShape(countString));
  count++;
  countString = count.toString();

  return causalVarShape;
}

function drawShape(cVar)
{
  if (cVar.shape == "ellipse")
  {
    var ell = ellipse(cVar);
  }
  else if (selectedShape == "rect")
  {
    var rectangle = rect(x, y, 75, 50, selectedShape);
  }
  else if (selectedShape == "noShape")
  {
    var noShape = ellipse(x, y, 0, 0, selectedShape);
  }
}

function redraw()
{
  for (var i = 1; i <= localModel.getRoot().size; i++){
      //alert("HERE!!! I am: " + i);
      
      if (localModel.getRoot().get(i.toString()) != null){  
        drawShape(localModel.getRoot().get(i.toString()));
      }
    }
  
}

function updateShape(id)
{
  alert("the id: " + id);
  var modelObj = localModel.getRoot().get(id);
  var htmlObj = $('.' + id);
  alert("update shape");

	htmlObj.position(modelObj.x, modelobj.y);
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
    if($('.TabbedPanelsTabSelected').attr('id') == "variable-tab")
    {
        var x = (e.pageX - $('svg').offset().left) + $(window).scrollLeft();
        var y = (e.pageY - $('svg').offset().top) + $(window).scrollTop();

        var newCausalVar = createNewCausalVar(x, y, 75, 50, selectedShape, selectedShape);
		
        drawShape(newCausalVar);
       
        $('#markup-tab').click();
    }
    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
        var conn = connection(source, target, "/");
        $('#markup-tab').click();
    }
});






