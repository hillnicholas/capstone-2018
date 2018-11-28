

let draggables = [];
function dragElement(elmnt) {
  draggables.push( elmnt );
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    sendAllToBottom();
    elmnt.style.zIndex = 10;
    console.log("debugh");
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
console.log("debugh");


function sendToTop( id ) { 
  document.getElementById( id ).style.zIndex = 10;
}

function sendAllToBottom() {
  draggables.map( item => item.style.zIndex -= 1 );
}
dragElement( document.getElementById( "settingsPopupBox" ));
dragElement( document.getElementById( "parametersPopupBox" ));
dragElement( document.getElementById( "datapointsPopupBox" ));
dragElement( document.getElementById( "histogramPopupBox" ));
