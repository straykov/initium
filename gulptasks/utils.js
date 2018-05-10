const log    = require('fancy-log');
const beeper = require('beeper');

const onError = function(error) {
  log([
    (error.name + ' in ' + error.plugin).bold.red,
    '',
    error.message,
    ''
  ].join('\n'));
  beeper();
  this.emit('end');
};

module.exports.onError = onError;
