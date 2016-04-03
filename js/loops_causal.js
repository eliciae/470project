//Counter-Clockwise Balancing Loop
var imgLink = "/graphics/balancingLoop.png";

var image = new joint.shapes.basic.Image({
    position : {
        x : 100,
        y : 100
    },
    size : {
        width : 30,
        height : 30
    },
    attrs : {
        image : {
            "xlink:href" : imgLink,
            width : 30,
            height : 30
        }
    }
});

graph.addCell(image);
