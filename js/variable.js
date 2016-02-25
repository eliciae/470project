// JavaScript Document
//VARIABLE (circle, ellipse, point, & rectangle)

//fields: center(x,y), width, height, type, label, labelPositionRelativeToCenter(x,y),id
//distance from svg & top of page
	var distanceToTopOfPage = 0;
	
	//name of selected item, "" if nothing is selected
	var selectedName = "";
	
	//mouse positions
	var currentX = 0;
	var currentY = 0;
	var initialX = 0; 
	var initialY = 0;
	
	var editingSelected = false;
	
	var color = "#FFFFFF";
	
	var mouseIsDown = false;
	
	//calculated 
	var radius, width, height, centerX, centerY;
	
	var tempHTML;
	
	var count = 0;
	var countString = "0";

//METHODS
//draw deselected
	//on deselect: main shape(body color, line thickness, line color), label
	
	
//draw selected 
	//on selection: drawDeselected + 8 resizing handles (middle of sides and corners), rotation(?), mouse changes to move icon
	
//on click: set item to selected and draw as selected, change toolbars (allow label renaming, line and color changing)  

//on click of each handle, allow resizing of corresponding values 



function updateCalculatedValues(){
			//update calcuated variables 
			width = Math.abs(currentX - initialX);
			height = Math.abs(currentY - initialY);
			
			 if (selectedName == "circle"){
				if (width < 20)
					width = 20;
				if (height < 20)
					height = 20;
			  }
			  else if (selectedName == "rectangle"){
				if (width < 90)
					width = 90;
				if (height < 35)
					height = 35;
			  }
			  else if (selectedName == "ellipse"){
				if (width < 70)
					width = 65;
				if (height < 25)
					height = 25;
			  }
			  else {} 

			
			radius = Math.sqrt( width * width + height * height );
			centerX = (initialX - currentX)/2 + initialX;
			centerY = (initialY - currentY)/2 + initialY;
			
		}


		function getTempHTML(shape)
			{
				//count is +1 because the object isn't actually created yet and the counter will be incremented before it is created
				//this only works for newly created causalVars
			if (shape == "circle")
				//return '<circle class = "draggable" id = ' + count+1 + ' onclick="selectShape()" cx=' + initialX + ' cy=' + initialY + ' r=' + radius + ' stroke="black" stroke-width="3" fill=' + color +' />';
				return '<ellipse cx=' + centerX + ' cy=' + centerY +' rx=' + radius + ' ry=' + radius + ' stroke="black" stroke-width="3" fill=' + color +' />';
			 else if (shape == "ellipse")
				return '<ellipse cx=' + centerX + ' cy=' + centerY +' rx=' + width + ' ry=' + height + ' stroke="black" stroke-width="3" fill=' + color +' />';
			else if (shape == "rectangle")
				return '<rect  class = "draggable" id = ' + count+1 + ' onclick="selectShape()" x=' + centerX + ' y=' + centerY +' width=' + width + ' height=' + height + ' stroke="black" stroke-width="3" fill=' + color +' />';
			else if (shape == "connection"){
				return '<line  class = "draggable" id = ' + count+1 + ' onclick="selectShape()" x1=' + initialX + ' y1=' + initialY + ' x2=' + currentX +' y2=' + currentY + ' style="stroke:rgb(0,0,0);stroke-width:2" />';
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
			  tempHTML = svg.innerHTML;
	  }
	  
    function doValueChanged()
    {
      causalVarShape.xCenter = initialX;
      causalVarShape.yCenter = initialY;
      causalVarShape.width = width;
      causalVarShape.height = height;
      //causalVarShape.name = selectedName;
    }

	 //on mouseup stop drawing  
	  document.onmouseup = function(e)
    {
		if (selectedName != ""){
			//if (!editingSelected){
				
				mouseIsDown = false;
				updateCalculatedValues();
				tempHTML = tempHTML + getTempHTML(selectedName);
				svg.innerHTML = tempHTML; 

			}
						
				//create new causalVarShape	
				count = count + 1;
				countString = count.toString();
				
				
				var causalVarShape = localModel.create('causalVar');
				alert("CREATED IN MODEL! tada!!");
				causalVarShape.xCenter = centerX;
			  	causalVarShape.yCenter = centerY;
			  	causalVarShape.width = width;
			 	causalVarShape.height = height;
			  	causalVarShape.name = selectedName;
				causalVarShape.color = color;
				alert("selected name = " + selectedName);
				// alert("SETTING radius: " + radius + " width: " + width + " height: " + height);
		
				localModel.getRoot().set(countString, causalVarShape);
				//causalVarShape.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, doValueChanged);
			//  alert("mouse up: xcoord: " + localModel.getRoot().get(countString).xCenter);
			selectedName = "";
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
			svg.innerHTML = tempHTML + getTempHTML(selectedName);			
	  }
	}
	

	 