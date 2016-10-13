$(document).ready(function() {
  $(document).on('mouseover mouseout', "a", function(e) {
    var href = $(this).attr('href');
    if (!href || href == '#') {
      return;
    }
    $("a")
      .filter('[href="' + $(this).attr('href') + '"]')
      .toggleClass("hover", e.type == 'mouseover');
  });
});