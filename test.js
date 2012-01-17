var canvas = new fabric.Canvas('c');

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
	
	  var s = 'M 0 0 Q 0, 0, 0, 0';
	  
	  var line = new fabric.Path( s, { fill: '', 
		  							   stroke: '#666',
		  							   strokeWidth: 5
		  							   });
	  
	  //line.hasBorders = line.hasControls = false;

	  line.path[0][1] = options.b1x;
	  line.path[0][2] = options.b1y;

	  line.path[1][1] = options.b1t;
	  line.path[1][2] = options.b1o;

	  line.path[1][3] = options.b1t;
	  line.path[1][4] = options.b1o;


	  line.selectable = true;
	  canvas.add(line);
	
	
}



