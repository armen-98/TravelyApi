const { CronJob } = require('cron');
const moment = require('moment-timezone');
const removeAttachmentFiles = require('./workers/removeAttachmentFiles');

const timedifference = new Date().getTimezoneOffset();

const jobFactory = (time, schedule) =>
  new CronJob(
    time,
    schedule,
    null,
    false,
    null,
    null,
    null,
    timedifference,
  ).start();

/*
Cron worked with this variant

* second,
* minute,
* hour,
* day of month,
* month,
* day(s) of week.
*/

const cronJobs = () => {
  console.log(
    `Cron is started work and scheduled at ${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}`,
  );

  // Run every day at 00:00 AM
  jobFactory('00 00 00 * * *', removeAttachmentFiles);
};

module.exports = cronJobs;
