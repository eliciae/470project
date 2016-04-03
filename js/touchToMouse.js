function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "click"; break;        
        case "touchend":   type = "mousemouse";   break;
        default:           return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
}
init();

//tab touch events
/*$('#delete').on('mousedown', function(event)
{
    deleteShape();
    deleteConn();
});

$('#variable-tab').on('mousedown', function(event)
{
    $('#variable-tab').click(); 
});

$('#connection-tab').on('mousedown', function(event)
{
    $('#connection-tab').click(); 
});

$('#notation-tab').on('mousedown', function(event)
{
    $('#notation-tab').click(); 
});*/


$('#varLabel').on('touchstart', function(event)
{
    $('#varLabel').focus();
	this.selectionStart = this.selectionEnd = this.value.length;
});


