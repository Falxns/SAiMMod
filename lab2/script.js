const a = document.getElementById("a");
const R0 = document.getElementById("R0");
const m = document.getElementById("m");
const ravnomernA = document.getElementById("ravnomern_a");
const ravnomernB = document.getElementById("ravnomern_b");
const gaussM = document.getElementById("gauss_m");
const gaussS = document.getElementById("gauss_s");
const exponentL = document.getElementById("exponent_l");
const selector = document.getElementById("selectRaspred");
const elementsRavnomern = document.getElementsByClassName("ravnomern");
const elementsGauss = document.getElementsByClassName("gauss");
const elementsExponent = document.getElementsByClassName("exponent");

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
    case "exponent":
      mat = 1 / +exponentL.value;
      disp = 1 / (+exponentL.value) ** 2;
      break;
  }

  document.getElementById("res_mat").innerHTML = mat;
  document.getElementById("res_disp").innerHTML = disp;
  document.getElementById("res_otklon").innerHTML = Math.sqrt(disp);
}

function ravnomern(inputArray, a, b) {
  return inputArray.map((curr) => {
    return a + (b - a) * curr;
  });
}

function gauss(inputArray, m, s) {
  let res = 0;
  for (let i = 0; i < 6; i++) {
    res += inputArray[i];
  }
  return m + s * Math.sqrt(2) * (res - 3);
}

function exponent(inputArray, l) {
  return inputArray.map((curr) => {
    return -(1 / l) * Math.log(curr);
  });
}

document.getElementById("submit").onclick = (e) => {
  let gener = lemer(+a.value, +R0.value, +m.value);
  let res;
  switch (selector.value) {
    case "ravnomern":
      res = ravnomern(gener, +ravnomernA.value, +ravnomernB.value);
      break;
    case "gauss":
      res = gauss(gener, +gaussM.value, +gaussS.value);
      break;
    case "exponent":
      res = exponent(gener, +exponentL.value);
      break;
  }

  drawHistogram(res);
  calculateValues();
};

selector.onchange = (e) => {
  switch (selector.value) {
    case "ravnomern":
      Array.prototype.forEach.call(elementsRavnomern, (el) => {
        el.className = "ravnomern";
      });
      Array.prototype.forEach.call(elementsGauss, (el) => {
        el.className = "gauss hidden";
      });
      Array.prototype.forEach.call(elementsExponent, (el) => {
        el.className = "exponent hidden";
      });
      break;
    case "gauss":
      Array.prototype.forEach.call(elementsGauss, (el) => {
        el.className = "gauss";
      });
      Array.prototype.forEach.call(elementsRavnomern, (el) => {
        el.className = "ravnomern hidden";
      });
      Array.prototype.forEach.call(elementsExponent, (el) => {
        el.className = "exponent hidden";
      });
      break;
    case "exponent":
      Array.prototype.forEach.call(elementsExponent, (el) => {
        el.className = "exponent";
      });
      Array.prototype.forEach.call(elementsRavnomern, (el) => {
        el.className = "ravnomern hidden";
      });
      Array.prototype.forEach.call(elementsGauss, (el) => {
        el.className = "gauss hidden";
      });
      break;
  }
};
