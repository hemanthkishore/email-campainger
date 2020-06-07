const Campaign = require('../models/Campaign');
const CampaignUser = require('../models/CampaignUsers');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const fetchUsers = (index, limit) => {
    return new Promise(resolve => {
        console.log(index, limit);
        CampaignUser.find({ customId: new RegExp('^' + index + '_') })
            .sort({ customId: 1 })
            .limit(limit)
            .then(users => {
                return resolve(users);
            });
    });
}

const sendEmails = (userDetails, data) => {
    const users = userDetails.userData;
    return new Promise(resolve => {
        const mails = [];
        users.forEach(user => {
            if (!user.unsubscribe) {
                const unsubscribeURL = process.env.NODE_ENV === "production" ?
                    `https://rocky-taiga-73939.herokuapp.com/${userDetails.customId}/unsubscribe?userId=${user._id}` :
                    `http://localhost:3000/campaigns/${userDetails.customId}/unsubscribe?userId=${user._id}`
                mails.push({
                    to: user.email,
                    from: 'hemanth7kishore@gmail.com',
                    subject: data.emailSubject,
                    text: data.emailBody,
                    html: `<p>${data.emailBody}</p> <br></br> <a href='${unsubscribeURL}'>Unsubscribe from this list.</a>`,
                });
            }
        });
        sgMail.send(mails).then(response => {
            return resolve(response);
        }).catch(error => {
            console.log(error.response.body.errors, "error");
        });
    });
}

module.exports = (agenda) => {
    agenda.define('create schedule', (job) => {
        // mark the campaign as started

        const data = job.attrs.data;
        Campaign.findById({ _id: data.campainId }).then(async response => {

            const campaignData = response.campaignData.find(e => {
                return e.equals(data.campaignDataId)
            });
            console.log(campaignData, "ccc");
            // get the users and send the emails
            let max_limit = response.userCount / 100 + 1;

            for (let i = 1; i <= max_limit; i++) {
                const users = await fetchUsers(response.name, i);
                await sendEmails(users[0], campaignData);
            }

            // update the campaign as finished
            Campaign.updateOne(
                { _id: data.campainId, 'campaignData._id': data.campaignDataId },
                { $set: { 'campaignData.$.status': 'completed' } }
            ).then(response=>{
                console.log(response, "resp");
            }).catch(error=>{
                console.log(error, "error");
            });
        }).catch(error => {
            console.log(error, "rrr");
        });
    });
}