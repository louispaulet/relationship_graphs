function loadData() {
  const filename = select.node().value;
  
  // Get the current value of the slider
  const linkDistance = document.getElementById('link-distance').value;

  d3.json("json_files/" + filename + ".json").then(data => {
    // Clear the previous graph
    d3.select("#graph").html("");
    
    createGraph(data, linkDistance);
  });
}

function createGraph(data, linkDistance) {
  const width = 800;
  const height = 600;

  const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const link = createLink(svg, data);
  const linkLabel = createLinkLabel(svg, data);
  const node = createNode(svg, data);
  const label = createLabel(svg, data);

  const simulation = createSimulation(data, linkDistance, width, height);

  simulation.on("tick", () => {
    updateGraph(link, node, label, linkLabel);
  });

  node.call(d3.drag()
    .on("start", d => dragstart(d, simulation))
    .on("drag", dragged)
    .on("end", d => dragend(d, simulation)));
}

function updateGraph(link, node, label, linkLabel) {
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
}

// helper functions for creating the elements of the graph
function createLink(svg, data) {
  return svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("class", "link");
}

function createLinkLabel(svg, data) {
  return svg.append("g")
  .attr("class", "link-labels")
  .selectAll("text")
  .data(data.links)
  .join("text")
  .attr("class", "link-label")
  .text(d => d.label);
}

function createNode(svg, data) {
  return svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .join("circle")
    .attr("class", "node")
    .attr("r", 20);
}

function createLabel(svg, data) {
  return svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data.nodes)
    .join("text")
    .attr("class", "label")
    .text(d => d.label);
}

function createSimulation(data, linkDistance, width, height) {
  return d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(linkDistance))
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide(50)).force("center", d3.forceCenter(width / 2, height / 2));
}

// drag-related functions
function dragstart(event, simulation) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragend(event, simulation) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

   


function createNewSVGWithBackground(svgElement) {
  const svgWithBackground = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgWithBackground.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgWithBackground.setAttribute('version', '1.1');
  
  const clonedSvg = svgElement.cloneNode(true);
  clonedSvg.removeAttribute('transform');
  clonedSvg.setAttribute('transform', 'scale(4)');
  
  const clonedSvgWidth = clonedSvg.getBBox().width;
  const clonedSvgHeight = clonedSvg.getBBox().height;
  
  svgWithBackground.setAttribute('width', clonedSvgWidth);
  svgWithBackground.setAttribute('height', clonedSvgHeight);

  const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  backgroundRect.setAttribute('x', '0');
  backgroundRect.setAttribute('y', '0');
  backgroundRect.setAttribute('width', clonedSvgWidth);
  backgroundRect.setAttribute('height', clonedSvgHeight);
  backgroundRect.setAttribute('fill', 'white');
  svgWithBackground.appendChild(backgroundRect);
  
  console.log(clonedSvgWidth)

  svgWithBackground.appendChild(clonedSvg);

  return svgWithBackground;
}


function updateNodeElements(svgWithBackground) {
  const nodeElements = svgWithBackground.querySelectorAll('.node');
  for (let i = 0; i < nodeElements.length; i++) {
    nodeElements[i].setAttribute('fill', 'lightgray');
  }
  
  const labelElements = svgWithBackground.querySelectorAll('.label');
  for (let i = 0; i < labelElements.length; i++) {
    labelElements[i].setAttribute('fill', 'blue');
  }
}


function updateLinkElements(svgWithBackground) {
  const linkElements = svgWithBackground.querySelectorAll('.link');
  for (let i = 0; i < linkElements.length; i++) {
    linkElements[i].setAttribute('stroke', 'pink');
  }
}

function updateLinkLabelElements(svgWithBackground) {
  const linkLabelElements = svgWithBackground.querySelectorAll('.link-label');
  for (let i = 0; i < linkLabelElements.length; i++) {
    linkLabelElements[i].setAttribute('fill', 'red');
  }
}

function saveAsPNG(){
  const filename = select.node().value;
  const svgElement = document.querySelector('svg');

  const svgWithBackground = createNewSVGWithBackground(svgElement);
  updateNodeElements(svgWithBackground);
  updateLinkElements(svgWithBackground);
  updateLinkLabelElements(svgWithBackground);

  const canvas = document.createElement('canvas');
  canvas.width = 3200;
  canvas.height = 2400;
  const ctx = canvas.getContext('2d');

  // Set white background color
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const svgString = new XMLSerializer().serializeToString(svgWithBackground);

  canvg(canvas, svgString, {
    ignoreDimensions: true,
    ignoreClear: true, // Preserve white background
  });

  const downloadLink = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  downloadLink.download = `${timestamp}_${filename}.png`;

  canvas.toBlob(function(blob) {
    downloadLink.href = URL.createObjectURL(blob);
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    document.body.removeChild(canvas);
  }, 'image/png');
}
