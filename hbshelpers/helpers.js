var moment = require('moment-timezone');

function formatDate(date) {
    // Get the UTC standard date version of this date
    m = moment.utc(date);
    // Convert it to Minnesota's timezone, and format it neatly
    // Date will be in the format "Tuesday, Jan 1st 2017, 3:50 pm"
    return m.tz('America/Chicago').format('dddd, MMM Do YYYY, h:mm a');
}

function length(array) {
    return array.length;
}


module.exports = {
    formatDate,
    length
}