	//this is the one for the server
  var clientId = '707956241542-t1qe821rk6jkmnmrcth0aafrjcfjg441.apps.googleusercontent.com';

  //this is the local one
  //var clientId = '707956241542-4s76mlqlkm2rol57nneobntvjb6h5sck.apps.googleusercontent.com';

	var localModel, tempHtml;
	var mouseIsDown = false;
	
	var color = "#FFFFFF";
	
	
	//name of selected item, "" if nothing is selected
	var selectedName = "";
	
	//distance from svg & top of page
	var distanceToTopOfPage = 0;
	
	//mouse positions
	var currentX = 0;
	var currentY = 0;
	var initialX = 0; 
	var initialY = 0;
	var count = 0;
	var countString = "0";
	var editingSelected = false;
	
	//calculated 
	var radius, width, height, centerX, centerY;

      if (!/^([0-9])$/.test(clientId[0])) {
        alert('Invalid Client ID - did you forget to insert your application Client ID?');
      }
      // Create a new instance of the realtime utility with your client ID.
      var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });


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

        drawFromModel();

        alert("file loaded. xcoord: " + localModel.getRoot().get(countString).xCenter);
      }
	  


      function drawFromModel()
      {
		//  alert("lm size" + localModel.getRoot().size);
		for (var i = 1; i <= count; i++){
			//alert("HERE!!! I am: " + i);
			
			if (localModel.getRoot().get(i.toString()) != null){
			
				var tempHeight = localModel.getRoot().get(i.toString()).height;
				var tempWidth = localModel.getRoot().get(i.toString()).width;
				var tempRadius = Math.sqrt( tempWidth * tempWidth + tempHeight * tempHeight );
				//alert(tempRadius + " width: " + tempWidth + " height: " + tempHeight);
				
			   // if (localModel.getRoot().get(countString).name == "circle"){
				tempHtml = tempHtml + '<circle onclick="selectShape()" cx=' + localModel.getRoot().get(i.toString()).xCenter + ' cy=' + localModel.getRoot().get(i.toString()).yCenter + ' r=' + tempRadius + ' stroke="black" stroke-width="3" fill="green" />';
				svg.innerHTML = tempHtml; 
				//}
				/*if (localModel.getRoot().get(countString).name == "rectangle"){
				tempHtml = tempHtml + '<rect x=' + localModel.getRoot().get(countString).centerX + ' y=' + localModel.getRoot().get(countString).centerY +' width=' + tempWidth + ' height=' + tempHeight + ' stroke="black" stroke-width="3" fill=' + color +' />';
				svg.innerHTML = tempHtml;
				}
				else {}*/
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
          }

          gapi.drive.realtime.custom.registerType(causalVar, 'causalVar');

          causalVar.prototype.xCenter = gapi.drive.realtime.custom.collaborativeField('xCenter');
          causalVar.prototype.yCenter = gapi.drive.realtime.custom.collaborativeField('yCenter');
          causalVar.prototype.width = gapi.drive.realtime.custom.collaborativeField('width');
    	  causalVar.prototype.height = gapi.drive.realtime.custom.collaborativeField('height');
          causalVar.prototype.name = gapi.drive.realtime.custom.collaborativeField('name');

          gapi.drive.realtime.custom.setInitializer(causalVar, initializeCausalVar);
      }


      function doOnLoaded() {
        // Note that "this" is the newly created object, even though
        // this method is statically defined. The onLoaded event is
        // always called in the context of the loaded object.
        this.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED,
           alert("xCenter: " + this.xCenter));
      }
	  
	  function updateCalculatedValues(){
			//update calcuated variables
			width = Math.abs(currentX - initialX);
			height = Math.abs(currentY - initialY);
			radius = Math.sqrt( width * width + height * height );
			centerX = (initialX - currentX)/2 + initialX;
			centerY = (initialY - currentY)/2 + initialY;
		}


	function getHTML(shape)
			{
			if (shape == "circle")
				return '<circle   onclick="selectShape()" cx=' + initialX + ' cy=' + initialY + ' r=' + radius + ' stroke="black" stroke-width="3" fill=' + color +' />';
			 else if (shape == "ellipse")
				return '<ellipse cx=' + centerX + ' cy=' + centerY +' rx=' + width + ' ry=' + height + ' stroke="black" stroke-width="3" fill=' + color +' />';
			else if (shape == "rectangle")
				return '<rect x=' + centerX + ' y=' + centerY +' width=' + width + ' height=' + height + ' stroke="black" stroke-width="3" fill=' + color +' />';
			else if (shape == "connection"){
				return '<line x1=' + initialX + ' y1=' + initialY + ' x2=' + currentX +' y2=' + currentY + ' style="stroke:rgb(0,0,0);stroke-width:2" />';
				}
			 else{}
			}
		
		//update color picker
		function update(jscolor) {
   			color = '#' + jscolor;
		}

	//set "Selected" on click
      document.getElementById("btnCreateCircle").addEventListener("click", 
        function drawCircle()
        {
		      selectedName = "circle";
        }
      );
	  
	  document.getElementById("btnCreateRect").addEventListener("click", 
        function drawRect()
        {
		 	selectedName = "rectangle"
        }
      );
	  
	  document.getElementById("btnCreateEllipse").addEventListener("click", 
        function drawEllipse()
        {
		 	selectedName = "ellipse";
        }
      );
	  
	  document.getElementById("btnCreateConnection").addEventListener("click", 
        function drawConnection()
        {
		 	selectedName = "connection";
        }
      );
	  
	//Start drawing once clicked after variable is selected
	  document.onmousedown = function(e){
		  if (selectedName != ""){
			  mouseIsDown = true;
			  initialX = currentX;
			  initialY = currentY;
			  tempHtml = svg.innerHTML;
		  }
	  }
	  
    function doValueChanged()
    {
      causalVarShape.xCenter = initialX;
      causalVarShape.yCenter = initialY;
      causalVarShape.width = width;
      causalVarShape.height = height;
      causalVarShape.name = selectedName;
    }

	 //on mouseup stop drawing  
	  document.onmouseup = function(e)
    {
		if (selectedName != ""){
			//if (!editingSelected){
				mouseIsDown = false;
				updateCalculatedValues();
				tempHtml = tempHtml + getHTML(selectedName);
				svg.innerHTML = tempHtml; 
				selectedName = "";
				  
						
				//create new causalVarShape	
				count = count + 1;
				countString = count.toString();
				
				
				var causalVarShape = localModel.create('causalVar');
				causalVarShape.xCenter = initialX;
			  causalVarShape.yCenter = initialY;
			  causalVarShape.width = width;
			  causalVarShape.height = height;
			  causalVarShape.name = selectedName;
			 // alert("SETTING radius: " + radius + " width: " + width + " height: " + height);
		
				localModel.getRoot().set(countString, causalVarShape);
				//causalVarShape.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, doValueChanged);
			//  alert("mouse up: xcoord: " + localModel.getRoot().get(countString).xCenter);
			}
		//	editingSelected = false;
		//}
	  }
		 
	//resize while mouse is moving & down. Always update current X and Y 
	  document.onmousemove = function(e)
    {  
		//update calulated shape values on move
		currentX = e.pageX;
		currentY = e.pageY - distanceToTopOfPage;
		updateCalculatedValues();
		
		if (mouseIsDown)
     {
			//draw shape that is selected
			svg.innerHTML = tempHtml + getHTML(selectedName);			
	  }
	}