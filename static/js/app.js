
// Function to grab data from samples file
function getInfo() {
  // Go over the samples
  d3.json("samples.json").then(data_0 => {
      console.log(data_0);
      // Initial values & setup
      var ids = data_0.samples[0].otu_ids;
      console.log(ids)
      var sampleValues =  data_0.samples[0].sample_values.slice(0,10).reverse();
      console.log(sampleValues)
      var labels =  data_0.samples[0].otu_labels.slice(0,10);
      console.log (labels)
  // Bring back the top 10 OTUs found. 
      var OTU_top = ( data_0.samples[0].otu_ids.slice(0, 10)).reverse();
  // Bring back the OTU ids.
      var OTU_id = OTU_top.map(d => "OTU " + d);
      console.log(`OTU IDS: ${OTU_id}`)
   // Bring back labels.
      var labels =  data_0.samples[0].otu_labels.slice(0,10);
      console.log(`OTU_labels: ${labels}`)
      var trace = {
          x: sampleValues,
          y: OTU_id,
          text: labels,
          marker: {
          color: 'blue'},
          type:"bar",
          orientation: "h",
      };
      // Create the data variable.
      var data = [trace];

      // Create the layout variable.
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 30
          }
      };

      // Create the horizontal bar chart.
  Plotly.newPlot("bar", data, layout);
      // Create a bubble chart that displays each sample.
      var trace1 = {
          x: data_0.samples[0].otu_ids,
          y: data_0.samples[0].sample_values,
          mode: "markers",
          marker: {
              size: data_0.samples[0].sample_values,
              color: data_0.samples[0].otu_ids
          },
          text:  data_0.samples[0].otu_labels

      };

      // Setting bubble plot layout
      var layout_2 = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
      };

      // Create the data variable. 
      var data1 = [trace1];

  // Create the bubble plot.
  Plotly.newPlot("bubble", data1, layout_2); 
  
  });
}  
// Create function that will bring back required data.
function getDemoInfo(id) {
// Read the data file.
  d3.json("samples.json").then((data)=> {
// Grab metadata
      var metadata = data.metadata;
      console.log(metadata)
    // Filter metadata by id
     var result = metadata.filter(meta => meta.id.toString() === id)[0];
    // Select demographic panel
     var demographicInfo = d3.select("#sample-metadata");
   // Empty the demographic panel
     demographicInfo.html("");

   // Get demoographic data and append it.
      Object.entries(result).forEach((key) => {   
          demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}
// Create function for changing ids.
function optionChanged(id) {
  getInfo(id);
  getDemoInfo(id);
}

// Create funtion for initial data rendering
function init() {
  // Select from dropdown menu.
  var dropdown = d3.select("#selDataset");
  // Read data file.
  d3.json("samples.json").then((data)=> {
      console.log(data)
      // Grab metadata.
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // Use functions to display data.
      getInfo(data.names[0]);
      getDemoInfo(data.names[0]);
  });
}
// Initialize the dashboard
init();