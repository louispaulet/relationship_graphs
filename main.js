const filenames = [
    "Airplane",
    "Back_To_The_Future",
    "Donald_Trump",
    "Francois_Hollande",
    "Futurama",
    "Harry_Potter",
    "Parcs_And_Recs",
    "Sarkozy",
    "Shrek",
    "The_Lord_Of_The_Rings",
    "The_Matrix",
    "The_Office"
];


// Fill the dropdown with the filenames
const select = d3.select("#json-select");
filenames.forEach(filename => {
  select.append("option").text(filename);
});

// Load data when a new option is selected
select.on("change", loadData);
loadData(); // Load initial data

function loadData() {
  const filename = select.node().value;
  
  // Get the current value of the slider
  const linkDistance = document.getElementById('link-distance').value;

  d3.json("json_files/"+filename+".json").then(data => {
    // Clear the previous graph
    d3.select("#graph").html("");
  const width = 800;
  const height = 600;

  const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("class", "link");
    
  const linkLabel = svg.append("g")
  .attr("class", "link-labels")
  .selectAll("text")
  .data(data.links)
  .join("text")
  .attr("class", "link-label")
  .text(d => d.label);

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .join("circle")
    .attr("class", "node")
    .attr("r", 20);

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data.nodes)
    .join("text")
    .attr("class", "label")
    .text(d => d.label);

  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(linkDistance))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
      
    linkLabel
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2);
  });

  node.call(d3.drag()
    .on("start", dragstart)
    .on("drag", dragged)
    .on("end", dragend));

  function dragstart(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragend(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
});
 
}


// Add this at the end of your main.js file
document.getElementById('link-distance').addEventListener('input', loadData);
