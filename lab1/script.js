// const a = 3;
// const R0 = 1;
// const m = 5;
const a = document.getElementById("a");
const R0 = document.getElementById("R0");
const m = document.getElementById("m");

let arr;
let res;
let i;
let buff;
let periodStart;

// function lemer(a, m) {
//   buff = (a * arr[i - 1]) % m;
//   if (res.includes(buff / m)) {
//     return;
//   }
//   arr.push(buff);
//   res.push(buff / m);
//   i++;
//   lemer(a, m);
// }

function lemer(a, m) {
  while (true) {
    buff = (a * arr[i - 1]) % m;
    if (res.includes(buff / m)) {
      periodStart = res.indexOf(buff / m);
      break;
    }
    arr.push(buff);
    res.push(buff / m);
    i++;
  }
}

document.getElementById("submit").onclick = (e) => {
  arr = [];
  res = [];
  i = 1;
  // arr.push(Math.pow(2, 20) - 5);
  // lemer(Math.pow(2, 20) - 7, Math.pow(2, 21));
  arr.push(R0.value);
  lemer(a.value, m.value);
  document.getElementById("histogram").innerHTML = "";

  var formatCount = d3.format(",.0f");

  var margin = { top: 10, right: 30, bottom: 30, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear().domain([0, 1]).range([0, width]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram().bins(x.ticks(20))(res);

  var y = d3.scale
    .linear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.y;
      }),
    ])
    .range([height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");

  var svg = d3
    .select("#histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function (d) {
      return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

  bar
    .append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function (d) {
      return height - y(d.y);
    });

  bar
    .append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function (d) {
      return formatCount(d.y);
    });

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  let mat = res.reduce((prev, curr) => prev + curr) / res.length;
  document.getElementById("res_mat").innerHTML = mat;

  let disp =
    res.reduce((prev, curr) => prev + Math.pow(curr - mat, 2)) /
    (res.length - 1);
  document.getElementById("res_disp").innerHTML = disp;

  document.getElementById("res_otklon").innerHTML = Math.sqrt(disp);

  let k = 0;
  for (let j = 1; j < res.length; j += 2) {
    if (Math.pow(res[j - 1], 2) + Math.pow(res[j], 2) < 1) {
      k++;
    }
  }
  document.getElementById("res_ravnomern").innerHTML = (2 * k) / res.length;

  document.getElementById("res_period").innerHTML = res.length - periodStart;

  document.getElementById("res_aperiod").innerHTML = res.length;
};
