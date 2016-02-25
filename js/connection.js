// JavaScript Document
//CONNECTION
//fields: start(x,y), end(x,y), list of nodes, label, label postion relative to start point(x,y), startArrow, endArrow, id

//METHODS
//draw deselected
	//on deselect: draw polyline with all the nodes, draw start & end Arrows
	
	
//draw selected 
	//on selection: drawDeselected + resizing handles at every node
	
//on click: set item to selected and draw as selected, change toolbars (allow label renaming, line and color changing)  

//on click of each handle, allow moving

//on double click: create new node & handle 



document.getElementById("btnCreateConnection").addEventListener("click", 
        function drawConnection()
        {
		 	selectedName = "connection";
        }
      );
	  
// From D3 sample project
var width = 960,
    height = 500;

var points = d3.range(1, 5).map(function(i) {
  return [i * width / 5, 50 + Math.random() * (height - 100)];
});

var dragged = null,
    selected = points[0];

var line = d3.svg.line();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("tabindex", 1);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown);

svg.append("path")
    .datum(points)
    .attr("class", "line")
    .call(redraw);

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup)
    .on("keydown", keydown);

d3.select("#interpolate")
    .on("change", change)
  .selectAll("option")
    .data([
      "linear",
      "step-before",
      "step-after",
      "basis",
      "basis-open",
      "basis-closed",
      "cardinal",
      "cardinal-open",
      "cardinal-closed",
      "monotone"
    ])
  .enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });

svg.node().focus();

function redraw() {
  svg.select("path").attr("d", line);

  var circle = svg.selectAll("circle")
      .data(points, function(d) { return d; });

  circle.enter().append("circle")
      .attr("r", 1e-6)
      .on("mousedown", function(d) { selected = dragged = d; redraw(); })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 6.5);

  circle
      .classed("selected", function(d) { return d === selected; })
      .attr("cx", function(d) { return d[0]; })
      .attr("cy", function(d) { return d[1]; });

  circle.exit().remove();

  if (d3.event) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}

function change() {
  line.interpolate(this.value);
  redraw();
}

function mousedown() {
	if (selectedName == "connection"){
	  points.push(selected = dragged = d3.mouse(svg.node()));
	  redraw();
	}
}

function mousemove() {
	if (selectedName == "connection"){
	  if (!dragged) return;
	  var m = d3.mouse(svg.node());
	  dragged[0] = Math.max(0, Math.min(width, m[0]));
	  dragged[1] = Math.max(0, Math.min(height, m[1]));
	  redraw();
	}
}

function mouseup() {
	if (selectedName == "connection"){
	  if (!dragged) return;
	  mousemove();
	  dragged = null;
	}
}

function keydown() {
	if (selectedName == "connection"){
	  if (!selected) return;
	  switch (d3.event.keyCode) {
		case 8: // backspace
		case 46: { // delete
		  var i = points.indexOf(selected);
		  points.splice(i, 1);
		  selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
		  redraw();
		  break;
	}
    }
  }
}
