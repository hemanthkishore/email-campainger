const Agenda = require('agenda');
const db = require("../config/keys").mongoURI;

const agenda = new Agenda({
    db: { address: db, collection: "jobs" },
    maxConcurrency: 5,
    defaultConcurrency: 1,
    processEvery: '1 second'
});
require('./runCampaignJob')(agenda);
agenda.on('ready',  async function () {
    await agenda.start();
});

module.exports = agenda
