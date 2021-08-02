function grabData(sample) {
  // Grab the data for the selected sample
  // Sends http request to the specified url to load .json file or data and executes callback function with parsed json data objects
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for selected sample number
    var dataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = dataArray[0];
    // Use d3 to select the PANEL with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Clear any existing metadata
    PANEL.html("");

    // Add keys and values to the panel
    // d3 is used to append new
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // EXTRA BONUS: Build the Gauge Chart
    drawGaugeCh(result.wfreq);
  });
}

function drawCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var dataArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = dataArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    drawCharts(firstSample);
    grabData(firstSample);
  });
}

function optionChanged(nextSample) {
  // Fetch the new data for the selected sample
  drawCharts(nextSample);
  grabData(nextSample);
}

// Initialize
init();