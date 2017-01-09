import $ from 'jquery';

export default () =>
  $(document).ready(function () {
    $(document).on('mouseover mouseout', 'a', function (e) {
      const href = $(this).attr('href');
      
      if (!href || href === '#') {
        return;
      }
      $('a')
        .filter('[href="' + $(this).attr('href') + '"]')
        .toggleClass('hover', e.type === 'mouseover');
    });
  });
