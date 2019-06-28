function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
// function buildCharts() {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  console.log(sample);
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // console.log(response);  
    array = [];
    for (var i = 0; i < data.otu_ids.length; i++) {
      array.push({"otu_ids": data.otu_ids[i], "otu_labels": data.otu_labels[i], "sample_values": data.sample_values[i]});
    };
    array.sort((a, b) => b.sample_values - a.sample_values);
    array = array.slice(0, 10);
    console.log(array);

    var trace1 = {
      values: array.map(data.sample_values),
      type: 'pie'
    };

    var data = [trace1];

    Plotly.newPlot("pie", data);
  });
}
// buildCharts();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
