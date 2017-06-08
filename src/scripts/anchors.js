const $anchors = $('a[href^="#"]');

$anchors.click(function (e) {
  const $link = $(this);
  const $target = $($link.attr('href'));
  if ($target.length > 0) {
    $('html, body').animate({
        scrollTop: $target.offset().top
    }, 2000, 'easeOutCubic');
  }
  e.preventDefault();
});
