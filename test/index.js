/**
 * Created by cool.blue on 2/04/2017.
 */
import FpsMeter from '../src/d3-fps-histogram'
import {select, event, mouse} from 'd3-selection'
import {format} from 'd3-format'
import {scaleLinear} from 'd3-scale'
import {randomNormal} from 'd3-random'

let container = select('#container'),
  metrics = container.append("div")
    .attr("id", "metrics")
    .style("white-space", "pre"),
  hist = FpsMeter("#metrics", {display: "inline-block"}, {
    height: 10, width: 100,
    values: function (d) {
      return 1 / d
    },
    domain: [0, 60]
  })
    .message(function (this_lap, aveLap) {
      return 'lap:' + format(" >4,.1f")(1 / aveLap)
    }),
  containerWidth = 960,
  containerHeight = 470 - hist.selection.node().clientHeight,
  fps = 60, sigma = 1,
  svg = container.append('svg').attr('height', containerHeight).attr('width', containerWidth);
  hist.svg.on('mousemove', function() {
      fps = x(mouse(hist.svg.node())[0]);
    }
  )
    .on('wheel', function(){
      sigma -= event.deltaY;
      event.preventDefault();
    });
  let x = scaleLinear().domain([0, hist.svg.attr('width')])
    .range([0,60]),
    y = scaleLinear().domain([0, 100])
      .range([0,10]).clamp(true);

hist.start(100);

function tick(){
  let a = Math.random();
  let _s = y(sigma);
  sigma = y.invert(_s);
  hist.mark(a);
  window.setTimeout(() => window.requestAnimationFrame(tick), randomNormal(1/fps * 1000, _s)())
}

window.requestAnimationFrame(tick);