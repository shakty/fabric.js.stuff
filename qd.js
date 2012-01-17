/**
 * @author balistef
 */


function QuadraticCurve (canvas, options) {
	this.canvas = canvas;
	var options = options || {};
	
	this.line = this.makePath(options.path);
	this.control = this.makeCurvePoint(options.curvePoint);
	this.start = this.makeStartCircle(options.curveStart);  
	this.end = this.makeEndCircle(options.curveEnd);

	this.options = options;
		
};

QuadraticCurve.prototype.makePath = function (options) {
	if (!options) {
		var options = {};
		options.startx = Math.random() * 500 + 1;
		options.starty = Math.random() * 500 + 1;
		
		options.endx = Math.random() * 500 + 1;
		options.endy = Math.random() * 500 + 1;
		
		var tmpx = Math.abs(options.startx - options.endx) / 2;
		var tmpy = Math.abs(options.starty - options.endy) / 2;
		
		options.controlx = tmpx + Math.min(options.startx,options.endx);
		options.controly = tmpy + Math.min(options.starty,options.endy);
	}
	
	var s = 'M 0 0 Q 0, 0, 0, 0';

	var line = new fabric.Path( s, { fill: '', 
		  							   stroke: '#666',
		  							   strokeWidth: 5
		  							   });

	line.selectable = true;
	//line.hasBorders = line.hasControls = false;

	line.path[0][1] = options.startx;
	line.path[0][2] = options.starty;

	line.path[1][1] = options.controlx;
	line.path[1][2] = options.controly;

	line.path[1][3] = options.endx;
	line.path[1][4] = options.endy;
	
	return line;
};

QuadraticCurve.prototype.makeStartCircle = function (options) {
	
	  var c = new fabric.Circle({
	    left: this.line.path[0][1],
	    top: this.line.path[0][2],
	    strokeWidth: 5,
	    radius: 3,
	    fill: '#fff',
	    stroke: '#666'
	  });

	  c.name = 'start';
	  c.hasBorders = c.hasControls = false;
	  return c;
};

QuadraticCurve.prototype.makeEndCircle = function (options) {
	
	  var c = new fabric.Circle({
	    left: this.line.path[1][3],
	    top: this.line.path[1][4],
	    strokeWidth: 5,
	    radius: 3,
	    fill: '#fff',
	    stroke: '#666'
	  });

	  c.name = 'end';
	  c.hasBorders = c.hasControls = false;
	  return c;
};

QuadraticCurve.prototype.makeCurvePoint = function () {
	
	  var c = new fabric.Circle({
	    left: this.line.path[1][1],
	    top: this.line.path[1][2],
	    strokeWidth: 2,
	    radius: 4,
	    fill: '#fff',
	    stroke: '#666'
	  });

	  c.name = 'control';
	  c.hasBorders = c.hasControls = false;


	  return c;
};


QuadraticCurve.prototype.init = function() {
	
	function onObjectSelected(e) {
		  var activeObject = e.memo.target;
	
		  if (activeObject.name === this.start.name || activeObject.name === this.end.name) {
		    activeObject.control.animate('opacity', '1', { 
		      duration: 200,
		      onChange: canvas.renderAll.bind(canvas)
		    });
		    activeObject.control.selectable = true;
		  }
		  
		  console.log(activeObject.toObject());
	};

	function onBeforeSelectionCleared(e) {
		var activeObject = e.memo.target;
		if (activeObject.name === this.start.name || activeObject.name === this.end.name) {
			activeObject.control.animate('opacity', '0', { 
				duration: 200,
				onChange: canvas.renderAll.bind(canvas)
			});
			//activeObject.control.selectable = false;
		}
		else if (activeObject.name === this.control.name) {
		  activeObject.top = activeObject.control.path[1][1];
		  activeObject.left = activeObject.control.path[1][2];  
		  
		activeObject.animate('opacity', '0', { 
			duration: 200,
			onChange: canvas.renderAll.bind(canvas)
		});
	  }
	}

	function onObjectMoving(e) {
		
		var updateTransformed = function () {
			var transformed = project2Line(this.start.left,
										   this.start.top,
										   this.end.left,
										   this.end.top,
										   this.control.left, this.control.top
			);
			
			this.control.left = transformed[0];
			this.control.top = transformed[1];
			this.line.path[1][1] = o.left;
			this.line.path[1][2] = o.top;
		};
		
		var objs = (!e.memo.target.objects) ? [e.memo.target] : e.memo.target.objects;
		
		for (var i=0; i < objs.length; i++) {
			var o = objs[i];
			console.log(o.name);
			
		  
			if (o.name === this.start.name) {
			    if (o.line) {
			      this.line.path[0][1] = o.left;
			      this.line.path[0][2] = o.top;
			    }
			}
			else if (o.name === this.end.name) {
			    if (o.line) {
			    	this.line.path[1][3] = o.left;
			    	this.line.path[1][4] = o.top;
			    }
			    console.log(o);
			    // TODO: render only the path
			    //canvas.renderAll();	    
			}
			  
			updateTransformed();
			  
		}
	}
		
	this.canvas.observe({
		  'object:selected': onObjectSelected,
		  'object:moving': onObjectMoving,
		  'before:selection:cleared': onBeforeSelectionCleared
	});
		
};


QuadraticCurve.prototype.render = function () {
	this.canvas.add(this.line);
	this.canvas.add(this.control);
	this.canvas.add(this.start);  
	this.canvas.add(this.end);
	
	console.log(this.line);
};


// Init

var canvas = new fabric.Canvas('c');

var qc = new QuadraticCurve(canvas, {
							curveStart: { name: 'start',
										  top: Math.random() * 500 + 1,
										  left: Math.random() * 100 + 1
							},
							curveEnd: {name: 'end',
								 top: Math.random() * 500 + 1,
								 left: Math.random() * 100 + 1
							}
});

qc.init();

qc.render();
