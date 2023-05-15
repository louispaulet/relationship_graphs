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

document.getElementById('link-distance').addEventListener('change', loadData);
document.getElementById('download-btn').addEventListener('click', saveAsPNG);
