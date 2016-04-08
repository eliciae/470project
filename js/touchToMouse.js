/**
* Allows touch events to act as mouse events
* @preconditions - touch event of type touchstart or touchmove
* @postconditions - touchstart event triggers a mousedown event and touchmove event triggers a click event
* @param {event} touch event
**/
function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "click"; break;        
        default: return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

/**
* Creates listener on touchstart and touchmove events
**/
function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
 
}
init();

/**
* Allows touch events on text areas
* @preconditions - touch event of type touchstart 
* @postconditions - cursor after last letter in text area
* @param {event} touch event
**/
$('#varLabel').on('touchstart', function(event)
{
    $('#varLabel').focus();
	this.selectionStart = this.selectionEnd = this.value.length;
});

$('#connLabel').on('touchstart', function(event)
{
    $('#connLabel').focus();
    this.selectionStart = this.selectionEnd = this.value.length;
});

$('#loopLabel').on('touchstart', function(event)
{
    $('#loopLabel').focus();
    this.selectionStart = this.selectionEnd = this.value.length;
});


