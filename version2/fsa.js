var selectedShape;

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

function ellipse(x, y, width, height, label) {
    
    var cell = new joint.shapes.basic.Ellipse({
        position: { x: x, y: y},
        size: { width: width, height: height },
        attrs: {
            text : { text: label, fill: '#000000', 'font-weight': 'normal' },
            'ellipse': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2
            }
        }
    });
    graph.addCell(cell);
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

var source = ellipse(100, 100, 0, 0, "a");
var target = ellipse(500, 100, 0, 0, "b");



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
        if (selectedShape == "ellipse")
        {
            var ell = ellipse(x, y, 75, 50, selectedShape);
        }
        else if (selectedShape == "rect")
        {
            var rectangle = rect(x, y, 75, 50, selectedShape);
        }
        else if (selectedShape == "noShape")
        {
            var noShape = ellipse(x, y, 0, 0, selectedShape);
        }
        $('#markup-tab').click();
    }
    if($('.TabbedPanelsTabSelected').attr('id') == "connection-tab")
    {
        var conn = connection(source, target, "/");
        $('#markup-tab').click();
    }
});
