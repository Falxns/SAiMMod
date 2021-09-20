const a = document.getElementById("a");
const R0 = document.getElementById("R0");
const m = document.getElementById("m");
const ravnomernA = document.getElementById("ravnomern_a");
const ravnomernB = document.getElementById("ravnomern_b");
const selector = document.getElementById("selectRaspred");
const elementsRavnomern = document.getElementsByClassName("ravnomern");

function drawHistogram(resArray) {
  document.getElementById("histogram").innerHTML = "";

  var formatCount = d3.format(",.3f");

  var margin = { top: 50, right: 30, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // var x = d3.scale.linear().domain([0, 1]).range([0, width]);
  var x = d3.scale
    .linear()
    .domain([0, d3.max(resArray) + 1])
    .range([0, width]);
  var y = d3.scale.linear().domain([0, 1]).range([height, 0]);

  var data = d3.layout.histogram().bins(x.ticks(20))(resArray);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

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
      return (
        "translate(" +
        x(d.x) +
        "," +
        (height - (height - y(d.y)) / resArray.length) +
        ")"
      );
    });

  bar
    .append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function (d) {
      return (height - y(d.y)) / resArray.length;
    });

  bar
    .append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function (d) {
      return formatCount(d.y / resArray.length);
    });

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, 0)")
    .call(yAxis);
}

function lemer(a, R0, m) {
  let arr = [];
  let res = [];
  let buff;
  let i = 1;

  arr.push(R0);
  while (true) {
    buff = (a * arr[i - 1]) % m;
    if (res.includes(buff / m)) {
      break;
    }
    arr.push(buff);
    res.push(buff / m);
    i++;
  }
  return res;
}

function calculateValues() {
  let mat;
  let disp;
  switch (selector.value) {
    case "ravnomern":
      mat = (+ravnomernA.value + +ravnomernB.value) / 2;
      disp = (+ravnomernB.value - +ravnomernA.value) ** 2 / 12;
      break;
  }
  // let mat = resArray.reduce((prev, curr) => prev + curr) / resArray.length;

  // let disp =
  //   resArray.reduce((prev, curr) => prev + Math.pow(curr - mat, 2)) /
  //   (resArray.length - 1);
  document.getElementById("res_mat").innerHTML = mat;
  document.getElementById("res_disp").innerHTML = disp;
  document.getElementById("res_otklon").innerHTML = Math.sqrt(disp);
}

function ravnomern(inputArray, a, b) {
  return inputArray.map((curr) => {
    return a + (b - a) * curr;
  });
}

document.getElementById("submit").onclick = (e) => {
  let gener = lemer(+a.value, +R0.value, +m.value);
  let res = ravnomern(gener, +ravnomernA.value, +ravnomernB.value);

  drawHistogram(res);
  calculateValues();
};

selector.onchange = (e) => {
  switch (selector.value) {
    case "ravnomern":
      Array.prototype.forEach.call(elementsRavnomern, (el) => {
        el.className = "ravnomern";
      });
      break;
    case "gay":
      Array.prototype.forEach.call(elementsRavnomern, (el) => {
        el.className = "ravnomern hidden";
      });
      break;
  }
};
