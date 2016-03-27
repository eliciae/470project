


joint.shapes.devs.UnspecifiedProcess = joint.shapes.devs.Model.extend(_.extend({}, joint.plugins.TooledModelInterface, {

markup: ['<g class="rotatable">',
            '<g class="scalable">',
                '<rect class="body"/>',
                '<g xmlns="http://www.w3.org/2000/svg" transform="translate(-549.49953,-824.87393)" id="layer1">',
                    '<g transform="matrix(0.933025,0,0,-0.2986125,549.49953,846.37362)" id="g3553">',
                      '<g transform="scale(0.98976,3.0047)" id="g3555">',
                        '<g clip-path="url(#clipPath3559)" id="g3557">',
                          '<path d="m 57.805,0.90155 -57.805,0 0,23.06045 57.805,0 L 72.244,12.432 57.805,0.90155 z" id="path3563" style="fill:#b8cde8;fill-opacity:1;fill-rule:evenodd;stroke:none"/>',
                        '</g>',
                      '</g>',
                    '</g>',
                '</g>',
            '</g>',
            '<g class="inPorts"/>',
            '<g class="outPorts"/>',
            '<g class="moveTool"/>',
            '<g class="resizeTool"/>',
            '<g class="portsTool"/>',
            '<g class="deleteTool"/>',
            '<title class="tooltip"/>',
        '</g>'].join(''),

defaults: joint.util.deepSupplement({
    type: 'devs.UnspecifiedProcess',
    inPorts: [''],
    outPorts: [''],
    moveTool: true,
    resizeTool: true,
	deleteTool: true,
    size: { width: 100, height: 31},
    attrs: {
        '.inPorts circle': { fill: '#fff' },
        '.outPorts circle': { fill: '#fff' },
        '.body': {
            width: 67, height: 21,
            stroke: 'none'
        },
    }
}, joint.shapes.devs.Model.prototype.defaults),
}));
joint.shapes.devs.UnspecifiedProcessView = joint.shapes.devs.ModelView.extend(joint.plugins.TooledViewInterface);

var elem = new joint.shapes.devs.UnspecifiedProcess({
    attrs: {
        '.label': { text: "I'm overriding the label's name"}
    },
});

graph.addCell(elem);