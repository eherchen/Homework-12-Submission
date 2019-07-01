function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`
    d3.json(url).then(function(data) {
      var table = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
      table.html("");


    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(data).forEach(([key, value]) => {
        var item = table.append("p");
        item.text(key + ": " + value);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // var url = `/samples/${sample}`;
  //   d3.json(`/${sample}`).then(function(data) {

    var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    };
    var bubbleChart = [trace1];
    Plotly.newPlot("bubble", bubbleChart);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    array = [];
    for (var i = 0; i < data.otu_ids.length; i++) {
      array.push({"otu_ids": data.otu_ids[i], "otu_labels": data.otu_labels[i], "sample_values": data.sample_values[i]});
    };
    array.sort((a, b) => b.sample_values - a.sample_values);
    array = array.slice(0, 10);
    console.log(array);

    var trace2 = {
      values: array.map(row => row.sample_values),
      type: 'pie'
    };

    var pieData = [trace2];

    Plotly.newPlot("pie", pieData);
  });
}


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
