/**
 * d3-fps-histogram
 */
import '../styles/d3-fps-histogram.css'
import {ElapsedTime} from "../src/elapsed-time-3.0";
import {select} from 'd3-selection'
import {format} from 'd3-format'
import {range, max, histogram} from 'd3-array'
import {scaleLinear} from 'd3-scale'
import {axisBottom} from 'd3-axis'
import 'd3-selection-multi'
import {transplot} from '../src/plot-transform'

export default function Histogram(on, style, config) {

  let BINS = 30;
  let messageStyle = {
      border: 0, margin: 0, "box-sizing": "border-box",
      padding: "0 0 0 6px", background: "black", "color": "orange",
      position: "absolute", left: config.width + "px"
    };
  let _message = () => "",
    posnContext = select(on).append("div")
      .attr("id", "metricsBlock")
      .styles({
        "white-space": "pre",
        position: "relative"
      }),
    wrapper = posnContext.append("div")
      .attr("id", "metrics")
      .styles({position: "absolute"}),
    hist = wrapper.append("div")
      .styles(style)
      .attr("id", "histogram")
      .append("svg")
      .styles({overflow: "visible", margin: 0})
      .attrs(config),
    elapsedTime = ElapsedTime(on, messageStyle)
      .message(function (value) {
        let this_lap = elapsedTime.lap().lastLap, aveLap = elapsedTime.aveLap(this_lap);
        return (aveLap ? format(" >5,.1f")(1 / aveLap) : format(" >5c")(" ")) + " fps\t" +
          _message.call(elapsedTime, value, this_lap, aveLap);
      }),
    plot = hist.append("g")
      .attrs(transplot(config.height))
      .classed("plot", true)
      .attrs({"fill": "url(#xColor)"}),
    _xAxis = axisBottom()
      .tickFormat("")
      .ticks(3)
      .tickSize(config.tickSize || 3),
    xAxis = (g) => {
      g.call(_xAxis)
        .attrs({
          "fill": "url(#xColor)", stroke: 'url(#xColor)'
        });
      g.select(".domain").attr("stroke", "none");
      let ticks = g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "black");
      ticks.select("line").attr("stroke-width", "0.5px")
    },
    xG = hist.append("g")
      .attrs({
        "transform": "translate(0," + (config.height) + ")",
        "id": "x-axis-fill"
      }),

    defs = hist.append("defs"),
    gradient = defs.append("linearGradient")
      .attrs({
        id: "xColor", x1: "0%", y1: "0%", x2: "100%", y2: "0%",
        gradientUnits: "userSpaceOnUse"
      });

  gradient.append("stop")
    .attrs({"offset": "0%", "stop-color": "red"});
  gradient.append("stop")
    .attrs({"offset": "50%", "stop-color": "orange"});
  gradient.append("stop")
    .attrs({"offset": "100%", "stop-color": "green"});

  let x = scaleLinear()
    .range([0, config.width]);
  if(config.domain){
    x.domain(config.domain)
    _xAxis.scale(x);
    xG.call(xAxis);
  }
  update(range(BINS));

  function update(data) {

    if (!data || !data.length) return;
    let _x = config.domain ? x : scaleLinear()
        .domain([0, max(data, config.values)])
        .range([0, config.width]),
      h = makeHist(data, config.values, _x),
      y = scaleLinear()
        .domain([0, max(h, function (d) {
          return d.length
        })])
        .range([0, 1]),
      bars = plot.selectAll(".bar").data(h),

    enter = bars.enter().append("rect")
      .attrs({
        class: "bar",
        opacity: 1,
        width: function (d) {
          return _x(d.x1 - d.x0)
        },
        height: config.height
      })
      .style('transform', 'scale(1,0)');
      // (config.domain ? enter : enter.merge(bars))
    enter.merge(bars).attrs({
          x: function (d) {
            return _x(d.x0)
          }
        });

    bars.exit().remove();

    bars.style("transform", function (d) {
      return `scale(1, ${y(d.length)})`
    });

    if(!config.domain) {
      _xAxis.scale(_x);
      xG.call(xAxis);
    }
  }

  update.svg = hist;
  update.message = function(f) {
    _message = f;
    return this
  };
  update.mark = function(a){
    elapsedTime.mark(a);
    if(!elapsedTime.aveLap.history.length) return;
    update(elapsedTime.aveLap.history);
  };
  update.start = function(aveWindow){elapsedTime.start(aveWindow)};
  update.selection = select(on);

  return update;

  function makeHist(data, values, x) {
    return histogram()
      .domain(x.domain())
      .thresholds(x.ticks(BINS))(data.map(d => values(d)))
  }

  function merge(source, target) {
    for (let p in source) if (target && !target.hasOwnProperty(p)) target[p] = source[p];
    return target;
  }
};

