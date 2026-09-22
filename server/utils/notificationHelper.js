const Notification = require("../models/Notification");

/**
 * createNotification — create a notification document safely.
 * Failures are logged but never thrown so the calling controller
 * is never disrupted by a notification write error.
 *
 * @param {Object} opts
 * @param {string}  opts.recipient - ObjectId of the user who receives it
 * @param {string}  [opts.sender]  - ObjectId of the user who triggered it
 * @param {string}  opts.type      - one of the enum values on the model
 * @param {string}  opts.message   - readable text shown in the UI
 * @param {string}  [opts.link]    - frontend route to navigate to on click
 */
async function createNotification({ recipient, sender, type, message, link = "" }) {
  try {
    // Don't notify yourself (e.g. vendor messages their own shop in testing)
    if (sender && sender.toString() === recipient.toString()) return;

    await Notification.create({ recipient, sender, type, message, link });
  } catch (err) {
    // Log but never throw — notifications are non-critical
    console.error("Notification create error:", err.message);
  }
}

module.exports = createNotification;