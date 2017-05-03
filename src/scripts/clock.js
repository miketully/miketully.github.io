const $clock = $('#clock');

function tick() {
  $clock.html(moment().format('h:mm A'));
}

setInterval(tick, 1000);
