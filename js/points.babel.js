"use strict";

var NodesJs = function NodesJs(parameters) {
  var t_NodesJs = this;
  t_NodesJs.id = parameters.id;
  t_NodesJs.container = parameters.container;
  t_NodesJs.particleSize = parameters.particleSize ? parameters.particleSize : 2;
  t_NodesJs.lineSize = parameters.lineSize ? parameters.lineSize : 1;
  t_NodesJs.particleColor = parameters.particleColor ? 'rgba(' + parameters.particleColor.join(',') + ')' : 'rgba(255,255,255,0.3)';
  t_NodesJs.lineColor = parameters.lineColor ? parameters.lineColor : '255,255,255';
  t_NodesJs.backgroundFrom = parameters.backgroundFrom;
  t_NodesJs.backgroundTo = parameters.backgroundTo;
  t_NodesJs.backgroundDuration = parameters.backgroundDuration;
  t_NodesJs.number = parameters.number ? parameters.number : 100;
  t_NodesJs.speed = parameters.speed ? parameters.speed : 20;
  t_NodesJs.nobg = parameters.nobg ? parameters.nobg : false;
  t_NodesJs.pointerCircleRadius = parameters.pointerCircleRadius ? parameters.pointerCircleRadius : 150;
  t_NodesJs.nodes = [];
  var canvas = document.getElementById(t_NodesJs.id);
  var ctx;
  var cw = document.querySelector(t_NodesJs.container).offsetWidth;
  var ch = document.querySelector(t_NodesJs.container).offsetHeight;
  var t0 = Date.now();
  var dt = 0;

  t_NodesJs.placeNodes = function (number) {
    t_NodesJs.nodes = [];

    for (var i = 0; i < number; i++) {
      t_NodesJs.nodes.push([Math.floor(Math.random() * (cw - 0 + 1)) + 0, Math.floor(Math.random() * (ch - 0 + 1)) + 0, Math.random() * (Math.PI * 2 - 0 + 1) + 0, []]);
    }
  };

  t_NodesJs.placeNodes(t_NodesJs.number);

  var step = function step() {
    ctx = canvas.getContext('2d');
    canvas.width = document.querySelector(t_NodesJs.container).offsetWidth;
    canvas.height = document.querySelector(t_NodesJs.container).offsetHeight;
    cw = canvas.width;
    ch = canvas.height;
    window.requestAnimationFrame(step);
    ctx.clearRect(0, 0, cw, ch);
    t_NodesJs.nodes.forEach(function (_node, _node_i) {
      _node[0] += Math.cos(_node[2]) * t_NodesJs.speed * (dt / 1000.0);
      _node[1] += Math.sin(_node[2]) * t_NodesJs.speed * (dt / 1000.0);

      if (_node[0] < 0) {
        _node[0] = cw + _node[0] % cw;
      }

      if (_node[0] > cw) {
        _node[0] = _node[0] % cw;
      }

      if (_node[1] < 0) {
        _node[1] = ch + _node[1] % ch;
      }

      if (_node[1] > ch) {
        _node[1] = _node[1] % ch;
      }

      ctx.fillStyle = t_NodesJs.particleColor;
      ctx.beginPath();
      ctx.arc(_node[0], _node[1], t_NodesJs.particleSize, 0, Math.PI * 2, true);
      ctx.fill();
      _node[3] = [];
      t_NodesJs.nodes.forEach(function (_node2, _node2_i) {
        if (_node_i == _node2_i) {
          return true;
        }

        if (_node[3].indexOf(_node2_i) > -1) {
          return true;
        }

        var dx = Math.abs(_node[0] - _node2[0]);
        var dy = Math.abs(_node[1] - _node2[1]);
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        var alpha = 0;

        if (d <= 300) {
          alpha = 0.3 - 0.3 * d / 200;
        }

        if (alpha == 0) {
          return true;
        }

        _node2[3].push(_node_i);

        ctx.strokeStyle = 'rgba(' + t_NodesJs.lineColor + ',' + alpha + ')';
        ctx.lineWidth = t_NodesJs.lineSize;
        ctx.beginPath();
        ctx.moveTo(_node[0], _node[1]);
        ctx.lineTo(_node2[0], _node2[1]);
        ctx.stroke();
      });
    });
    dt = Date.now() - t0;
    t0 = Date.now();
  };

  window[window.addEventListener ? 'addEventListener' : 'attachEvent'](window.addEventListener ? 'load' : 'onload', function () {
    step();
  });

  window.onresize = function () {
    // t_NodesJs.number = window.innerWidth < 700 ? 10 : 40;
    step();
  };
};

var nodesjs = new NodesJs({
  id: 'nodes',
  container: '.jumbotron',
  particleSize: 8,
  particleColor: [255, 255, 255, 0.3],
  lineSize: 2,
  lineColor: [255, 255, 255],
  backgroundFrom: [10, 25, 100],
  backgroundTo: [25, 50, 150],
  backgroundDuration: 400,
  nobg: true,
  number: window.innerWidth < 700 ? 20 : 40,
  speed: 20,
  pointerCircleRadius: 20
});