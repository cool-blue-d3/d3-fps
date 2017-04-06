/**
 * Created by cool.blue on 2/04/2017.
 */
import FpsMeter from '../src/d3-fps-histogram'
import {select, event, mouse} from 'd3-selection'
import 'd3-selection-multi'
import {format} from 'd3-format'
import {scaleLinear} from 'd3-scale'
import {randomNormal} from 'd3-random'

let container = select('#container'),
  metrics = container.append("div")
    .attr("id", "metrics"),
  hist = FpsMeter("#metrics", {display: "block"}, {
    height: 10, width: 100,
    values: function (d) {
      return 1 / d
    },
    domain: [0, 60]
  })
    .message(function (this_lap, aveLap) {
      return 'lap: ' + format(" >4,.1f")(1 / aveLap)
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
    y = scaleLinear().domain([0, 1000])
      .range([0,10]).clamp(true);

hist.start(100);

export let t0 = window.performance.now(), tlap;
function tick(){
  let a = Math.random();
  let _s = y(sigma);
  let tlapAct = (-t0 + (t0 = window.performance.now())),
    tDemand,
    k = 0.1;
  sigma = y.invert(_s);
  tlap = randomNormal(1/fps * 1000, _s)();
  tDemand =  (tlap - tlapAct * k) / (1 - k);
  // console.log(`SP: ${Math.round(1000/tlap)}\tAct: ${Math.round(1000/tlapAct)}\tOP: ${Math.round(1000/tDemand)}\tSigma: ${_s}`);
  window.setTimeout(() => window.requestAnimationFrame(tick), tlap);
  // window.requestAnimationFrame(tick);
  // if(Math.random()*10 < _s)
  //   window.requestAnimationFrame(tick);
  // else
  //   window.requestAnimationFrame(() => window.requestAnimationFrame(tick));
  hist.mark(a);
}

window.requestAnimationFrame(tick);