joint.shapes.devs.TooledModel = joint.shapes.devs.Model.extend( _.extend({}, joint.plugins.TooledModelInterface, {
   
    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/><g class="moveTool"/><g class="resizeTool"/><g class="portsTool"/><g class="deleteTool"/></g>',
    //<g class="moveTool"/><g class="resizeTool"/><g class="portsTool"/> to be used as needed
    defaults: joint.util.deepSupplement({
        type: 'devs.TooledModel',
    }, joint.shapes.devs.Model.prototype.defaults)
    
}));

joint.shapes.devs.TooledModelView = joint.shapes.devs.ModelView.extend(joint.plugins.TooledViewInterface);
//joint.shapes.basic.Ellipse = joint.shapes.basic.Ellipse.extend(joint.shapes.devs.TooledModelView);

var elem = new joint.shapes.devs.TooledModel({
    attrs: {
        '.label': { text: "I'm overriding the label's name"}
    },
});

graph.addCell(elem);










joint.shapes.devs.UnspecifiedProcess = joint.shapes.devs.Model.extend(_.extend({}, joint.plugins.TooledModelInterface, {


markup: ['<g class="rotatable">',
            '<g class="scalable">',
                '<rect class="body"/>',
                '<g xmlns="http://www.w3.org/2000/svg" transform="translate(-549.49953,-824.87393)" id="layer1">',
                    '<g transform="matrix(0.933025,0,0,-0.2986125,549.49953,846.37362)" id="g3553">',
                      '<g transform="scale(0.98976,3.0047)" id="g3555">',
                        '<g clip-path="url(#clipPath3559)" id="g3557">',
                          '<path d="m 57.805,0.90155 -57.805,0 0,23.06045 57.805,0 L 72.244,12.432 57.805,0.90155 z" id="path3563" style="fill:#b8cde8;fill-opacity:1;fill-rule:evenodd;stroke:none"/>',
						 // '<ellipse id="v-140" fill="#C9DAF8" stroke="#d7d7d7" rx="30" ry="20" cx="30" cy="20" stroke-width="0" value="0"></ellipse>',
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