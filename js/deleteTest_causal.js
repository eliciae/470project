joint.shapes.devs.TooledModel = joint.shapes.devs.Model.extend( _.extend({}, joint.plugins.TooledModelInterface, {
   
    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/><g class="moveTool"/><g class="resizeTool"/><g class="portsTool"/></g>',
    //<g class="moveTool"/><g class="resizeTool"/><g class="portsTool"/> to be used as needed
    defaults: joint.util.deepSupplement({
        type: 'devs.TooledModel',
    }, joint.shapes.devs.Model.prototype.defaults)
    
}));

joint.shapes.devs.TooledModelView = joint.shapes.devs.ModelView.extend(joint.plugins.TooledViewInterface);

var elem = new joint.shapes.devs.TooledModel({
    attrs: {
        '.label': { text: "I'm overriding the label's name"}
    },
    portsTool: false, //Deactivate some of the tools if you want
});

graph.addCell(elem);