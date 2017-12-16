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