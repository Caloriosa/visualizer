$(document).ready(function(event) {
  $("form").each(function(){
    var form = $(this);
    form.validate({showErrors: function() {}});
    form.submit(function( event ) {
      //console.log(form.valid());
      if (form.valid() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.addClass("was-validated");
    });
  });
});

function drawLineChart(elementID, dataUrl) {
  var options = {
    type: 'line',
    data: []
  };
  var jsonData = $.ajax({
    url: dataUrl,
    dataType: 'json'
  }).done(function (results) {
    options.data = results
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById(elementID + "-canvas");

    // Instantiate a new chart
    var myLineChart = new Chart(ctx, options);
  }).fail(function(err) {
    console.log("error while loading graph " + elementID + " datasource: " + dataUrl);
    document.getElementById(elementID).innerText = "Error while loading graph!";
  });
}