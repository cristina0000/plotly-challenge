function construct_metadata(sample) {
  d3.json("samples.json").then((bb_data) => {
    var metadata = bb_data.metadata;
    
    var result = metadata.filter(Obj => Obj.id == sample);
    var result = result[0];
    var ref = d3.select("#sample-metadata");

    Object.entries(result).forEach(([key, value]) => {
      ref.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function build_plots(sample) {
  d3.json("samples.json").then((bb_data) => {
    var samples = bb_data.samples;
    var result = samples.filter(Obj => Obj.id == sample);
    var result = result[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Bubble plot
    var bubble_layout = {
      title: "Bacteria Cultures for Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU Id" },
      margin: { t: 40}
    };
    var bubble_data = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Portland"
        }
      }
    ];

    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    //bar plot
    var y_ticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var bar_data = [
      {
        y: y_ticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var bar_layout = {
      title: "Top 10 Bacteria Cultures",
      margin: { t: 40, l: 100 }
    };

    Plotly.newPlot("bar", bar_data, bar_layout);
  });
}

function initialize_dashboard() {
  var reference = d3.select("#selDataset");

  d3.json("samples.json").then((bb_data) => {
    var sample_names = bb_data.names;

    sample_names.forEach((sample) => {
      reference
        .append("option")
        .text(sample)
        .property("value", sample);
    });

      var first_sample = sample_names[0];
    buildPlots(first_sample);
    construct_metadata(first_sample);
  });
}

function option_changed(sample) {
  build_plots(sample);
  construct_metadata(sample);
}
initialize_dashboard();
