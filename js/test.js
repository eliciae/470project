	//this is the one for the server
	var clientId = '707956241542-t1qe821rk6jkmnmrcth0aafrjcfjg441.apps.googleusercontent.com';

  //this is the local one
  //var clientId = '707956241542-4s76mlqlkm2rol57nneobntvjb6h5sck.apps.googleusercontent.com';

	var localModel;
	

	
      if (!/^([0-9])$/.test(clientId[0])) {
        alert('Invalid Client ID - did you forget to insert your application Client ID?');
      }
      // Create a new instance of the realtime utility with your client ID.
      var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

	// Call this function before calling gapi.drive.realtime.load
      function registerCustomTypes()
      {
          var causalVar = function () { };

          function initializeCausalVar()
          {
            this.xCenter = initialX;
            this.yCenter = initialY;
      		this.width = width;
      		this.height = height;
      		this.name = "";
			//this.color = "#FFFFFF";
			
          }
		  

          gapi.drive.realtime.custom.registerType(causalVar, 'causalVar');

          causalVar.prototype.xCenter = gapi.drive.realtime.custom.collaborativeField('xCenter');
          causalVar.prototype.yCenter = gapi.drive.realtime.custom.collaborativeField('yCenter');
          causalVar.prototype.width = gapi.drive.realtime.custom.collaborativeField('width');
    	  causalVar.prototype.height = gapi.drive.realtime.custom.collaborativeField('height');
          causalVar.prototype.name = gapi.drive.realtime.custom.collaborativeField('name');
		 // causalVar.prototype.color = gapi.drive.realtime.custom.collaborativeField('color');

          gapi.drive.realtime.custom.setInitializer(causalVar, initializeCausalVar);
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
                start();
              }, true);
            });
          } else {
              start();
          }
        }, false);
      }

      function start() {
		 updateCalculatedValues();
		  
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
      function onFileLoaded(doc) {
        localModel = doc.getModel();
		count = localModel.getRoot().size;
		alert(localModel.getRoot().size);
		countString = count.toString();

        var collaborativeString = doc.getModel().getRoot().get('demo_string');
        wireTextBoxes(collaborativeString);

        

        //alert("file loaded. xcoord: " + localModel.getRoot().get(countString).xCenter);
		localModel.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, displayObjectChangedEvent);
		drawFromModel();
      }
	  


      function drawFromModel()
      {
		 // alert("lm size" + localModel.getRoot().size);
		//svg.innerHTML = "";
		for (var i = 1; i <= localModel.getRoot().size; i++){
			//alert("HERE!!! I am: " + i);
			
			if (localModel.getRoot().get(i.toString()) != null){	
				//svg.appendChild(localModel.getRoot().get(i.toString()).getHTML());
				svg.innerHTML = svg.innerHTML + getHTML(i.toString());
			}
		}
      }
	  
	  function selectShape(){
		  alert("selected!");
		  editingSelected = true;
		  initialX = 0;
		  initialY = 0;
		  
		  initialX = localModel.getRoot().get(countString).xCenter;
		  initialY = localModel.getRoot().get(countString).yCenter;
		  width = localModel.getRoot().get(countString).width;
		  height = localModel.getRoot().get(countString).height;
		  selectedName = localModel.getRoot().get(countString).name;
		  //alert(initialX + "," + initialY);
		  
	  }

      // Connects the text boxes to the collaborative string
      function wireTextBoxes(collaborativeString) {
        var textArea1 = document.getElementById('text_area_1');
        var textArea2 = document.getElementById('text_area_2');

        gapi.drive.realtime.databinding.bindString(collaborativeString, textArea1);
        gapi.drive.realtime.databinding.bindString(collaborativeString, textArea2);
      }
	  
      function doOnLoaded() {
        // Note that "this" is the newly created object, even though
        // this method is statically defined. The onLoaded event is
        // always called in the context of the loaded object.
      //  this.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED,
      //     alert("xCenter: " + this.xCenter));
      }

	function displayObjectChangedEvent(evt) {
	  var events = evt.events;
	  var eventCount = evt.events.length;
	  for (var i = 0; i < eventCount; i++) {
		console.log('Event type: '  + events[i].type);
		console.log('Local event: ' + events[i].isLocal);
		console.log('User ID: '     + events[i].userId);
		console.log('Session ID: '  + events[i].sessionId);
		if (!events[i].isLocal){
			drawFromModel();
		}
	  }
	}
	
	function getHTML(id){
		alert("local model item: " +localModel.getRoot().get(id));
		var tempHeight = localModel.getRoot().get(id).height;
		var tempWidth = localModel.getRoot().get(id).width;
		var tempRadius = Math.sqrt( tempWidth * tempWidth + tempHeight * tempHeight );
		//alert(tempRadius + " width: " + tempWidth + " height: " + tempHeight);
		
	   // if (localModel.getRoot().get(countString).name == "circle"){
		return '<circle onclick="selectShape()" cx=' + localModel.getRoot().get(id).xCenter + ' cy=' + localModel.getRoot().get(id).yCenter + ' r=' + tempRadius + ' stroke="black" stroke-width="3" fill="green" />';
		
		//}
	}

