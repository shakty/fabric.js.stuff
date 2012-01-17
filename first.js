var canvas = new fabric.Canvas('c');
var c2 = new fabric.Canvas('c2');
	
canvas.observe({
  'object:selected': onObjectSelected,
  'object:moving': onObjectMoving,
  'before:selection:cleared': onBeforeSelectionCleared,
  'object:dblclick': doit // not working
});

function doit(){ alert('culo');};

// Arcs
for (var i=0; i < 1; i++) {
	
	var options = {};
	
	options.b1x = Math.random() * 500 + 1;
	options.b1y = Math.random() * 500 + 1;
	
	options.b1t = Math.random() * 500 + 1;
	options.b1o = Math.random() * 500 + 1;
	
	var tmpx = Math.abs(options.b1x - options.b1t) / 2;
	var tmpy = Math.abs(options.b1y - options.b1o) / 2;
	
	options.p1x = tmpx + Math.min(options.b1x,options.b1t);
	options.p1y = tmpy + Math.min(options.b1y,options.b1o);
	
	console.log(options);
	
	drawQuadratic(options);
}

// Circles

for (var i=0; i < -1; i++) {
	
	var c1 = Math.round(Math.random()*10);
	var c2 = Math.round(Math.random()*10);
	var c3 = Math.round(Math.random()*10);
	
	var color = '#' + c1 + c2 + c3;
	console.log(color);
	
	canvas.add(new fabric.Circle({ radius: Math.random() * 100 + 1, 
								   strokeWidth: 5,
								   fill: '',
								   stroke: color,
								   top: Math.random() * 500 + 1, 
								   left: Math.random() * 500 + 1 }));
}



//var s = 'M 100 200 Q 100, 100, 200, 0';
//
//var line = new fabric.Path( s, { fill: '', 
//	  							   stroke: 'red',
//	  							   strokeWidth: 5
//	  							   });
//canvas.add(line);


function drawQuadratic(options) {

  var options = options || {};

  var s = 'M ' + options.p1x + ' ' + options.p1y + ' ';
  s+= 'Q ' + options.b1x + ', ' + options.b1y + ', ' + options.b1t + ', ' + options.b1o;
  //console.log(s);
  var s = 'M 0 0 Q 0, 0, 0, 0';
  
  var line = new fabric.Path( s, { fill: '', 
	  							   stroke: '#666',
	  							   strokeWidth: 5
	  							   });
  
  line.selectable = true;
  //line.hasBorders = line.hasControls = false;

  line.path[0][1] = options.b1x;
  line.path[0][2] = options.b1y;

  line.path[1][1] = options.b1t;
  line.path[1][2] = options.b1o;

  line.path[1][3] = options.b1t;
  line.path[1][4] = options.b1o;

//  // First Point
//  line.path[0][1] = 100;
//  line.path[0][2] = 100;
//
//  // Control Point
//  line.path[1][1] = 200;
//  line.path[1][2] = 200;
//
//  // End Point
//  line.path[1][3] = 300;
//  line.path[1][4] = 100;


  //line.selectable = false;
  canvas.add(line);

  var p1 = makeCurvePoint(options.p1x, options.p1y, line);
  p1.name = "p1";
	
  canvas.add(p1);

  var p0 = makeCurveCircle(options.b1x, options.b1y, line, p1);
  p0.name = "p0";
  canvas.add(p0);

  var p2 = makeCurveCircle(options.b1t, options.b1o, line, p1); 
  p2.name = "p2";
  canvas.add(p2);

};

function makeCurveCircle(left, top, line, control) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 3,
    fill: '#fff',
    stroke: '#666'
  });

  c.hasBorders = c.hasControls = false;

  c.line = line;
  c.control = control;
  
  // Adding the refs to the curvepoint
  control.refs.push(c);
  
  
  return c;
}

function makeCurvePoint(left, top, line) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 2,
    radius: 4,
    fill: '#fff',
    stroke: '#666'
  });

  c.hasBorders = c.hasControls = false;
  c.line = line;
  c.refs = [];

  return c;
}

function onObjectSelected(e) {
  var activeObject = e.memo.target;

  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.control.animate('opacity', '1', { 
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.control.selectable = true;
  }
  
  console.log(activeObject.toObject());
  
}

function onBeforeSelectionCleared(e) {
  var activeObject = e.memo.target;
  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.control.animate('opacity', '0', { 
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    //activeObject.control.selectable = false;
  }
  else if (activeObject.name == "p1") {
    
	  activeObject.top = activeObject.control.path[1][1];
	  activeObject.left = activeObject.control.path[1][2];  
	  
	activeObject.animate('opacity', '0', { 
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
	
    //activeObject.selectable = false;
    
    
  }
}

function onObjectMoving(e) {
	
	var objs = (!e.memo.target.objects) ? [e.memo.target] : e.memo.target.objects;
	
	for (var i=0; i < objs.length; i++) {
		var o = objs[i];
		console.log(o.name);
		
	  
	  if (o.name == "p0") {
	    if (o.line) {
	      o.line.path[0][1] = o.left;
	      o.line.path[0][2] = o.top;
	    }
	  }
	  else if (o.name == "p2") {
	    if (o.line) {
	      o.line.path[1][3] = o.left;
	      o.line.path[1][4] = o.top;
	    }
	    console.log(o);
	    // TODO: render only the path
	    //canvas.renderAll();	    
	  }
	  else if (o.name == "p1") {
	
//		  console.log(o.control.path[1][1]);
//		  console.log(o.control.path[1][1]);
//		  
	    if (o.line) {
	    	var transformed = project2Line(o.refs[0].left,o.refs[0].top, o.refs[1].left, o.refs[1].top, o.left, o.top);
	    	o.left = transformed[0];
	    	o.top = transformed[1];
	    	o.line.path[1][1] = o.left;
	    	o.line.path[1][2] = o.top;
	    }
	  }
	}
  
}


var removeSelectedEl = document.getElementById('remove-selected');
removeSelectedEl.onclick = function() {
  var activeObject = canvas.getActiveObject(),
      activeGroup = canvas.getActiveGroup();
  
  console.log('Removing');
  console.log(activeObject);
  console.log(activeGroup);
  
  if (activeObject) {
    canvas.remove(activeObject);
  }
  else if (activeGroup) {
    var objectsInGroup = activeGroup.getObjects();
    canvas.discardActiveGroup();
    objectsInGroup.forEach(function(object) {
      canvas.remove(object);
    });
  }
};


var bringToFront = document.getElementById('b2f');
bringToFront.onclick = function() {
  var activeObject = canvas.getActiveObject(),
      activeGroup = canvas.getActiveGroup();
  
  
  console.log('Bringing to Front');
  console.log(activeObject);
  console.log(activeGroup);
  
  if (activeObject) {
    canvas.bringForward(activeObject);
    //activeObject.bringForward();
  }
  else if (activeGroup) {
    var objectsInGroup = activeGroup.getObjects();
    canvas.discardActiveGroup();
    objectsInGroup.forEach(function(object) {
  	  object.bringForward();
    });
  }
}


document.getElementById('redraw').onclick = function() {
	var o = canvas.toObject().objects;
	for (var i = 0; i < o.length; i++) {
		console.log('uh');
		c2.add(o[i]);
	}
	
	c2.renderAll();
	c2.renderAll.bind(canvas);
	
	console.log(canvas);
	console.log(c2);
};
  
  // Project the point (c,d) on the line orthogonal to the one
  // passing through the points (x,y) and (z,t)
  function project2Line (x, y, z, t, c, d) {
	  var mid = computeMidPoint(x, y, z, t);
	  //console.log(mid);
	  var m = computeSlope(x, y, z, t);
	  //console.log(m);
	  var b = computeIntersect(-m, mid[0], mid[1]);
	  //console.log(b);
	  return project2OLine (m, b, c, d);
  };
  
  function project2OLine (m, b, c, d) {
	  var m = -m;
	  var m2 = (Math.pow(m,2));
	  var x = (m*d + c - m*b) / (m2 + 1);
	  var y = (m2*d + m*c + b) / (m2 + 1); 
	  return [x,y];
  };
  
  function computeSlope (x, y, z, t) {
	return (x - z) / (y - t);  
  };

  function computeIntersect (m, x, y) {
	  return y - (m*x);
  };
  
  function computeMidPoint (x, y, z, t) {
	  var mx = Math.abs(x - z) / 2;
	  var my = Math.abs(y - t) / 2;
		
	  mx = mx + Math.min(x, z);
	  my = my + Math.min(y, t);
	  
	  return [mx, my];
  };
  
  var x1 = 0;
  var y1 = 0;
  
  var x2 = 1;
  var y2 = 1;
  
  var c = 0;
  var d = 2;
  
  var p = project2Line( x1, y1, x2, y2, c, d);
 
  
//  canvas.add(new fabric.Point(p[0],p[1]), {
//	  										'fill': 'red'
//  });
  
  