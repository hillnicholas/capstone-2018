

// data 

let mode = "calculation";

let pointConfig = [
	{ color: "black" },
	{ color: "black"},
	{ color: "black"}
];

let calibrateDistanceNumberOfClicks;

calibrateDistanceNumberOfClicks = 0;
let scale = 0.6; 
let scaleDistance = 20 ;
let pixelToFoot = 174.0/ scaleDistance;
let pixelToMeter = pixelToFoot / 0.3048;
let calibrationDistance;
let searchedMacAddress = ['ff','ff','ff','ff','ff','ff'];
var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
	container: 'container',
	width: width,
	height: height
});


var map;
var layer = new Konva.Layer();



var imageObj;

function reloadMap() {
    imageObj = new Image();

    imageObj.onload = function() {

        map = new Konva.Image({
            x: 50,
            y: 50,
            image: imageObj
        });

        map.scale({ x: scale, y: scale });
        drawMap();
    }
    imageObj.src = "aermap-cropped.jpg";
}

reloadMap();


function onZoomOut() { 
    scale -= 0.02;
    reloadMap();
    clickedReset();
}

function onZoomIn() { 
    scale += 0.02;
    reloadMap();
    clickedReset();
}


function drawMap() {
	layer.clear();
	layer = new Konva.Layer();
    
    layer.add( map );
    stage.add( layer );
    
}

    

stage.on('click', function () {
	
	switch( mode ) {
		case "calculation":
            //onCalculation();
            onSelectSpot();
			break;

		case "calibrateDistance":
            onCalibrateDistance();
            break;
        case "selectSpot":
            onSelectSpot();
            break;
	}
})

function newFrame() { 
    clickedDatapoints();
    drawMap();
    drawAllPoints();
}

let currentPosition;
function onSelectSpot() {

    newFrame();
    currentPosition = stage.getPointerPosition();
    document.getElementById("currentCoordinates").innerText = pixelToMeter * currentPosition.x.toString().substr(0,6)  + "', " + currentPosition.y.toString().substr(0,6) + "'";

    layer.add(new Konva.Circle({
        x: currentPosition.x,
        y: currentPosition.y,
        fill: 'black',
        radius: 10
    }));
        
    layer.draw();
}

calibrationParams = [];
function onCalibrateDistance() { 
	var pos = stage.getPointerPosition();
	document.getElementById("calibrationMessage").innerText = "Now click a distance that is " + scaleDistance + " feet away.";
	calibrateDistanceNumberOfClicks += 1;
	layer.add(new Konva.Circle({
		x: pos.x,
		y: pos.y,
		fill: 'red',
		radius: 5
	}));
	layer.draw();
	calibrationParams.push( pos );

	if (calibrateDistanceNumberOfClicks >= 2 ) { 
		pixelToFoot = Math.abs( calibrationParams[0].x - calibrationParams[1].x ) / scaleDistance;
		pixelToMeter = pixelToFoot / 0.3048;
		mode = "calculation";
		calibrateDistanceNumberOfClicks = 0;
		document.getElementById("calibrationMessage").innerText = "The map has been calibrated.";
		calibrationParams = [];
	} 
}

function onUpdatePower() { 
    /*if( currentPoint - 1 < 0 ) {
        console.log("DEBUG: under 0");
        return;
    }
    let power =  snifferData.reduce( ( i, obj ) => i + obj.power, 0 ) / snifferData.length;
    let distanceRadius = getDistanceFromPower( power );
    //points[ currentPoint - 1 ].power = power; 
    points[ currentPoint - 1 ].distanceRadius = distanceRadius;*/
}


function drawAllPoints() { 
    for( var i = 0; i < currentPoint - 1; i ++ ) {
        pos = points[ i ].pos;
        distanceRadius = points[ i ].distanceRadius;
        
        layer.add(new Konva.Circle({
            x: pos.x,
            y: pos.y,
            fill: 'black',
            radius: 10
        }));

        layer.add(new Konva.Circle({
		    x: pos.x,
		    y: pos.y,
			stroke: 'black',
			fill: 'gray',
			opacity: 0.2,
            strokeWidth: 2,
		    radius: distanceRadius
		}));
		layer.draw();
    }
}

function onCalculation() {
    var distanceRadius, pos;
    /*for( var i = 0; i < currentPoint - 1; i ++ ) {

        pos = points[ i ].pos;
        distanceRadius = points[ i ].distanceRadius;
        layer.add(new Konva.Circle({
		    x: pos.x,
		    y: pos.y,
			stroke: color,
			fill: 'gray',
			opacity: 0.2,
            strokeWidth: 2,
		    radius: distanceRadius
		}));
		layer.draw();
    }
    return;
    // 
	if( currentPoint - 1 < points.length ) { 
		// now we find relative point

		var color = 'black';

		// PLACEHOLDER for power
		//let max = -40;
		//let min = -64;
		//let power = Math.floor(Math.random() * (max - min) ) + min;


		// draw point
		/*layer.add(new Konva.Circle({
		    x: pos.x,
		    y: pos.y,
		    fill: color,
		    radius: 10
		}));*

		// draw radius
		layer.add(new Konva.Circle({
		    x: pos.x,
		    y: pos.y,
			stroke: color,
			fill: 'gray',
			opacity: 0.2,
            strokeWidth: 2,
		    radius: distanceRadius
		}));
		layer.draw();

		currentPoint += 1;
	}
    */
	if( currentPoint - 1 === points.length ) { 
	
		let specialPoints = Array(3);
		for( var i = 0; i < 3; i++ ) {
			let everyPoint = [ [0, 1], [1,2], [0,2]][ i ];
			let point1 = points[ everyPoint[0] ];
			let point2 = points[ everyPoint[1] ];

			if( doCirclesIntersect( point1, point2 )) { 


				// distance between 2 points
				let distance = Math.sqrt( 
					Math.pow( point1.pos.x - point2.pos.x , 2 ) + 
					Math.pow( point1.pos.y - point2.pos.y , 2 ) );
		
				
				let inBetween = (( point1.distanceRadius + point2.distanceRadius ) - distance ) / 2;
				
				let angle =  Math.PI - Math.atan2( point1.pos.y - point2.pos.y, point1.pos.x - point2.pos.x );
				let opposite = inBetween * Math.cos( angle );
							

				let slopeOfLine =  (point2.pos.y - point1.pos.y ) / ( point2.pos.x - point1.pos.x );
				let yInterceptofLine = -1 * slopeOfLine * point2.pos.x + point2.pos.y;

				let middleX = point1.pos.x + point1.distanceRadius * Math.sin( angle + (Math.PI/2)) - opposite;
				let middleY = slopeOfLine * middleX + yInterceptofLine;

				// draw centered points
				layer.add (new Konva.Line({
					points: [ point1.pos.x, point1.pos.y,
							point2.pos.x, point2.pos.y ],
					stroke: 'purple',
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round'
				}));
				
				
				layer.add( new Konva.Circle({
					x: middleX,
					y: middleY,
					fill: 'green',
					radius: 3
				}));

				specialPoints[i] = { x : middleX, y: middleY };
				layer.draw();

			}
			else {
				let distance = Math.sqrt( 
					Math.pow( point1.pos.x - point2.pos.x , 2 ) + 
					Math.pow( point1.pos.y - point2.pos.y , 2 ) );
				let sideA = distance;
				let sideB = point1.distanceRadius + point2.distanceRadius;
				let cAngle = Math.acos( sideB/ sideA );
				let dAngle = Math.atan2( point1.pos.y - point2.pos.y, point1.pos.x - point2.pos.x );
				let eAngle = ( (Math.PI/2) - cAngle );
				

				let fAngle = eAngle + dAngle;
				
				// calculate common tangent 

				var tangent0 = {}, tangent1 = {};
				tangent0.x = point1.pos.x + point1.distanceRadius * Math.cos( fAngle + (Math.PI/2) );
				tangent0.y = point1.pos.y + point1.distanceRadius * Math.sin( fAngle + ( Math.PI/2));

				tangent1.x = point2.pos.x + point2.distanceRadius * Math.cos( fAngle - (Math.PI/2));
				tangent1.y = point2.pos.y + point2.distanceRadius * Math.sin ( fAngle - (Math.PI/2));

				layer.add (new Konva.Line({
					points: [ tangent0.x, tangent0.y,
							tangent1.x, tangent1.y ],
					stroke: 'blue',
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round'
				}));

				// draw centered points
				layer.add (new Konva.Line({
					points: [ point1.pos.x, point1.pos.y,
							point2.pos.x, point2.pos.y ],
					stroke: 'purple',
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round'
				}));

				// calclulate intersections
				let slopeOfLine =  (point2.pos.y - point1.pos.y ) / ( point2.pos.x - point1.pos.x );
				let yInterceptofLine = -1 * slopeOfLine * point2.pos.x + point2.pos.y;
				
				let slopeOfTangent = ( tangent1.y - tangent0.y ) / ( tangent1.x - tangent0.x );
				let yInterceptofTangent = -1 * slopeOfTangent * tangent0.x + tangent0.y;

				// y = mx + b; y = m2x + b2;
				// mx + b = m2x + b2
				// mx - m2x = b2 - b
				// x(m - m2) = b2 - b
				// x = b2 - b / m - m2

				let xIntercept = ( yInterceptofLine - yInterceptofTangent ) / (slopeOfTangent - slopeOfLine );

				let yIntercept = slopeOfLine * xIntercept + yInterceptofLine;


				specialPoints[i] = { x: xIntercept, y: yIntercept };

				layer.add( new Konva.Circle({
					x: xIntercept,
					y: yIntercept,
					fill: 'green',
					radius: 3
				}));

				layer.draw();
			} 

		}
		// now that all the points exist...
		
		// calculate middle
		let sum_x = specialPoints
			.map( point => point.x )
			.reduce((a, b) => a + b, 0);

		let sum_y = specialPoints
			.map( point => point.y )
			.reduce((a, b) => a + b, 0);

		let calced_posx = sum_x / 3; // specialPoints.length;
		let calced_posy = sum_y / 3; //specialPoints.length;

		layer.add(new Konva.Circle({
			x: calced_posx,
			y: calced_posy,
			fill: 'red',
			radius: 7
		}));

		var triangle = new Konva.Shape({
			sceneFunc: function (context, shape) {
			  context.beginPath();
			  context.moveTo( specialPoints[0].x, specialPoints[0].y);
			  context.lineTo(specialPoints[1].x, specialPoints[1].y );
			  context.lineTo(specialPoints[2].x, specialPoints[2].y );
			  context.closePath();
	  
			  // (!) Konva specific method, it is very important
			  context.fillStrokeShape(shape);
			},
			fill: 'red',
			opacity: 0.2,
			strokeWidth: 2
		  });

		layer.add( triangle );
		layer.draw();
	}
}



function clickedReset() { 
	clearMap();
	drawMap();
}

function clearMap() { 
	points = [ {},{},{}];
	currentPoint = 1;
}

function calculate() {

	//let max_power = max( points.map( point => point.power ) );

	let sum_x = points
		.map( point => point.pos.x )
		.reduce((a, b) => a + b, 0);

	let sum_y = points
		.map( point => point.pos.y )
		.reduce((a, b) => a + b, 0);


	
	let point_x = sum_x / points.length;
	let point_y = sum_y / points.length;
	return { x: point_x, y: point_y };
	
}

function clickedSettings() { 
    document.getElementById("settingsPopupBox").style.visibility = "visible";
    sendAllToBottom();
    sendToTop( "settingsPopupBox");
}

function closeSettings() { 
	document.getElementById("settingsPopupBox").style.visibility = "hidden";
}

function clickedParameters() {
	document.getElementById("parametersPopupBox").style.visibility = "visible";
	let currentMacAddress = searchedMacAddress ? searchedMacAddress.join(":") : "Not defined yet";
	document.getElementById("currentMacAddress").innerText = "Current MAC address: " + currentMacAddress;
    sendAllToBottom();
    sendToTop( "parametersPopupBox");
}

function closeParameters() { 
	document.getElementById("parametersPopupBox").style.visibility = "hidden";
}

function clickedDatapoints() {
    document.getElementById("datapointsPopupBox").style.visibility = "visible";
    sendAllToBottom();
    sendToTop( "datapointsPopupBox");
}

function closeDatapoints() {
	document.getElementById("datapointsPopupBox").style.visibility = "hidden";
}

function startCalibration() {
	scaleDistance = document.getElementById("calibrationDistance").value;
	if(  scaleDistance ) {
		document.getElementById("calibrationMessage").innerText = "Click a reference point to scale.";
		mode = "calibrateDistance";
	}
}

// calculate the radius of the range from the signal
function getDistanceFromPower( power ) { 
	return 0.0138 * Math.exp( -0.107 * power ) * pixelToMeter;
}



function doCirclesIntersect(point1, point2 ) { 
	let distance = Math.sqrt( 
				Math.pow( point1.pos.x - point2.pos.x , 2 ) + 
				Math.pow( point1.pos.y - point2.pos.y , 2 ) );
	return distance < point1.distanceRadius + point2.distanceRadius;
}

let snifferData = [];
let searchedChannel = 7;
function requestSniffing() {

    let macAddr = searchedMacAddress ? searchedMacAddress : "None";
    if( macAddr === "None" ) {
        document.getElementById("sniffMessage").innerHTML = "You must specify a MAC address. <button onClick='clickedParameters()'>Open parameter settings</button>";
        return;
    }

	fetch('/rest/data?mac_addr=' + searchedMacAddress.join(":") + '&channel=' + searchedChannel )
		.then( data => data.json() )
		.then( resolvedData => {
		console.log( 'data' + resolvedData );
		if( Object.keys(resolvedData).length === 0 ) {
			document.getElementById("sniffMessage").innerText = "There was an error retrieving power from " + ":".join(searchedMacAddress) + ".";
		}
		let power = resolvedData.averagePower;

		let distance = getDistanceFromPower( power ) / pixelToMeter;
		console.log( distance );
		if( snifferData.length < 7 ) {
			document.getElementById("sniffMessage").innerHTML = "";

			snifferData.push({
				macAddr: resolvedData.mac_addr.split(":"),
				power: resolvedData.averagePower,
				dataPoints: resolvedData.dataPoints,
				distance: distance
			});
			fillSnifferTable();
			let average =  snifferData.reduce( ( i, obj ) => i + obj.power, 0 ) / snifferData.length;
			

			document.getElementById("averagePower").innerText = average.toString().length < 7 ? average.toString() : average.toString().substr(0,7); 
		}
		else { 
			document.getElementById("sniffMessage").innerText = "Cannot sniff anymore.";
		}
	});
}

function fillSnifferTable() { 
        // fill table
        let table = document.getElementById("datapoints");
        let row;
        // clear first
        for( var i = 0; i < 7; i ++ ) { 
            row = table.rows[ i + 1 ];

            for( var j = 0; j < 3; j ++ ) {
                row.cells[j].innerText = "";
            }
        }

        for( var i = 0; i < snifferData.length; i ++ ) {
            row = table.rows[i + 1];
            row.cells[0].innerText = snifferData[i].macAddr.join(":");
            row.cells[1].innerText = snifferData[i].power;
            row.cells[2].innerText = snifferData[i].distance;
        }

}

function requestRecord() {


    if( ! currentPosition ) { 
        return;
    }

    if( currentPoint <= 3 ) {
    let average =  snifferData.reduce( ( i, obj ) => i + obj.power, 0 ) / snifferData.length;
    points[ currentPoint - 1 ].power = average;
    points[ currentPoint - 1 ].distanceRadius = getDistanceFromPower( average );
    points[ currentPoint - 1 ].pos = currentPosition;
    currentPoint ++;
    newFrame();
    requestFlushSnifferData();
    }
    if( currentPoint >= 4 ) { 
        onCalculation();
        return;
    } 
    //onCalculation(); // currentPosition, average );

}

function requestFlushSnifferData() {
    snifferData = [];
    fillSnifferTable();
}


function main() {
	clearMap();
	//drawMap();
	document.onload = function () { 
	}
}

function updateMacAddress() {
	searchedMacAddress = [];
	for(var i = 0; i < 6; i ++ ) {
		searchedMacAddress.push( document.getElementById("mac" + i).value);
	}
    document.getElementById("currentMacAddress").innerText = searchedMacAddress.join(":");
}

main();

// bogus 
function login() {
    
    // the most secure evar
    if( document.getElementById("username").value === "root" && document.getElementById("password").value === "capstone" ) {
        startLoader();
    }  
    else { 
        document.getElementById("loginErrorMessage").style.display = "block";
    }
}

function startLoader() { 
    document.getElementsByClassName("login-middle")[0].innerHTML = `
        loading...
        <div id="ui-loader-wrapper">
            <div id="ui-loader">
            </div>
        </div>
    `
    let counter = 0;
    let maxWidth = document.getElementById("ui-loader-wrapper").offsetWidth;
    let interval = setInterval( function() { 
        if ( counter >= maxWidth ) {
            clearInterval( interval );
            document.getElementById("login-screen").style.visibility = "hidden";
        }
        else {
            document.getElementById('ui-loader').style.width = counter + "px";
            let min=1; max=10;
            counter +=  Math.floor(Math.random() * (max - min) ) + min;;
        }
    }, 20 );
}