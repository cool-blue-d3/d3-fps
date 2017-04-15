/**
 * web-worker.js
 *
 * Created by cool.blue on 8/04/2017.
 */

export function transferifyF64(a){
  let l = a.length, aF64 = new Float64Array(l);
  for(let i = 0; i < l; i++)
    aF64[i] = a[i];
  return aF64;
}

function self(){
  let _x, h, y;

  function prepare(data) {
    let _data = data();
    _x = config.domain ? x : scaleLinear()
      .domain([0, max(_data, config.values)])
      .range([0, config.width]);
    h = makeHist(_data, config.values, _x);
    y = scaleLinear()
      .domain([0, max(h, function (d) {
        return d.length
      })])
      .range([0, 1]);
  }


  self.onmessage = function (e) {
    self[e.data.method](e.data)
  };
}