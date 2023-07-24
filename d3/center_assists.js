var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 900 - margin.left - margin.right, height = 550 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/center_stats.csv").then(function(data) {
    data.forEach(function(d) {
        d.MP = +d.MP;
        d.AST = +d.AST;
    });

    x.domain(d3.extent(data, function(d) { return d.MP; })).nice();
    y.domain(d3.extent(data, function(d) { return d.AST; })).nice();

    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0.05);

    // tooltip mouseover
    var tipMouseover = function(d) {
        var tipcontent  = "Player Name : " + d.Player + "<br/>Team: " + d.Tm + "<br/>Position: " + d.Pos +
                            "<br/>Assists: " + d.AST + "<br/>MPG: " + d.MP;
        tooltip.transition()
            .duration(200)
            .style("opacity", 0)
        tooltip.html(tipcontent)
            .style("left",  (d3.event.pageX + 25) + "px") // or d3.pointer(event)[0]
            .style("top", (d3.event.pageY - 25) + "px") // or d3.pointer(event)[1]
        };
    // tooltip mouseout
    var tipMouseout = function(d) {
        tooltip.transition()
            .duration(300) // ms
            .style("opacity", 0);
    };

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .text("Minutes Played per Game");

    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .text("Assists per Game");

    svg.append("g")
        .attr("fill", "steelblue")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.MP))
        .attr("cy", d => y(d.PTS))
        .attr("r", 3.5)
        .attr("fill", d => d.Player === "Nikola Jokic" ? "red" : "steelblue")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);

    // Annotation at Jokic's Name
    var jokic = data.find(d => d.Player === "Nikola Jokic");
    if (jokic) {
        svg.append("text")
           .attr("x", x(jokic.MP))
           .attr("y", y(jokic.PTS) - 10) // position the text 10px above the data point
           .text("Jokic is the best playmaking center")
           .attr("font-size", "12px")
           .attr("text-anchor", "middle");
    }
});