const filenames = [
  "Airplane",
  "Back_To_The_Future",
  "Futurama",
  "Harry_Potter",
  "Lego_Movie",
  "Parcs_And_Recs",
  "Shrek",
  "The_Lord_Of_The_Rings",
  "The_Matrix",
  "The_Office",
  
  "Affaire_Tapie_Credit_Lyonnais",
  "Donald_Trump",
  "Francois_Hollande",
  "Sarkozy",
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
