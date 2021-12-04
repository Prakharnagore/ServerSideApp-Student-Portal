$(document).ready(function () {
  /*-------------------S T U D E N T   S T A T E   A P P E N D --------------------------------- */
  $.getJSON("/studentportal/getstudentstate", function (data) {
    $.each(data, function (index, item) {
      $("#studentstate").append(
        $("<option>").text(item.statename).val(item.idstates)
      );
    });
  });
  /*-------------------S T U D E N T   C I T Y    A P P E N D --------------------------------- */
  $("#studentstate").change(function () {
    $("#studentcity").empty();
    $("#studentcity").append($("<option>").text("Choose City"));
    $.getJSON(
      "/studentportal/getstudentcity",
      { idstates: $("#studentstate").val() },
      function (data) {
        $.each(data, function (index, item) {
          $("#studentcity").append($("<option>").text(item.cityname));
        });
      }
    );
  });
  /*------------------------------------------------------------------------------------ */
  if ($("#studentgender").val() == "Choose Gender") {
    $("#studentgender").append($("<option>").text("Male"));
    $("#studentgender").append($("<option>").text("Female"));
  }
  if ($("#studentgender").val() == "Male") {
    $("#studentgender").append($("<option>").text("Female"));
  }
  if ($("#studentgender").val() == "Female") {
    $("#studentgender").append($("<option>").text("Male"));
  }
});
