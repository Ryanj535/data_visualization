function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      panelData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      panelData.append("h5").text(`${key}: ${value}`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {
    var trace1 = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      labels: sampleData.otu_labels,
      mode: "markers",
      text: sampleData.otu_labels,
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth",
      }
    }];
    console.log(typeof sampleData.sample_values);

    // @TODO: Build a Bubble Chart using the sample data
    var layout = {
      showlegend: false,
      height: 600,
      width: 1400,
    }
    Plotly.newPlot("bubble", trace1, layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var topTen = sampleData.sample_values.slice(0,10);
    var tenLabels = sampleData.otu_ids.slice(0,10);
    var tenText = sampleData.otu_labels.slice(0,10);
    var trace2 = [{
      values: topTen,
      labels: tenLabels,
      hovertext: tenText,
      type: 'pie'
    }];
    var layout2 = {
      height: 400,
      width: 500
    }
    Plotly.newPlot("pie", trace2, layout2);
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
