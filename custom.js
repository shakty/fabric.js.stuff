var QuadraticCurve = fabric.util.createClass(fabric.Object, fabric.Observable, {
  initialize: function(options) {
    this.callSuper('initialize', options);
	this.line = this.makePath(options);
	this.control = this.makeCurvePoint(options);
	this.start = this.makeStartCircle(options);
	this.end = this.makeEndCircle(options);
	this.loaded = true;
	this.fire('qd:loaded');
	console.log(this);
  },
  
  makePath: function (options) {
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
	},

	makeStartCircle: function (options) {
		
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
	},

	makeEndCircle: function (options) {
		
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
	},

	makeCurvePoint: function () {
		
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
	},
	
  _render: function(ctx) {
    	ctx.add(this.line);
    	ctx.add(this.control);
    	ctx.add(this.start);  
    	ctx.add(this.end);
    //}
  },
	
	render: function (c) {
	  	console.log('CC');
	  	console.log(c);
	  	c.add(this.line);
		c.add(this.control);
		c.add(this.start);  
		c.add(this.end);
  	}
    
});

// TEST

var canvas = new fabric.Canvas('c', { 
//  backgroundColor: '#333', 
//  HOVER_CURSOR: 'pointer'
});

console.log(canvas);

var qd = new QuadraticCurve();

canvas.observe({
  'mouse:down': function(){console.log('e');},
  'mouse:up': function(){qd.observe('qd:loaded', canvas.renderAll.bind(canvas));}
});

canvas.add(qd);

qd.observe('qd:loaded', function() {
	console.log('loaded');
	canvas.renderAll.bind(canvas);
});

qd._render(canvas);

//canvas.renderAll.bind(canvas);


