const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const agenda = require('../../services/taskScheduler');

const Campaign = require('../../models/Campaign');
const CampaginUser = require('../../models/CampaignUsers');

// Route for Creating a campaign
router.post('', (req, res) => {
    Campaign.findOne({ name: req.body.name }).then(campaign => {
        if (campaign) {
            return res.status(400).json({ name: "Campaign name already exists" });
        } else {
            const newCampaign = new Campaign({
                name: req.body.name,
                description: req.body.description,
                userCount: req.body.receiverData.length
            });
            newCampaign
                .save()
                .then(newcampaign => {
                    // save in chunck of 100
                    let promiseArray = [];
                    for (let i = 0; i < req.body.receiverData.length; i = i + 100) {
                        const receiverData = req.body.receiverData.slice(i, i + 100);
                        let newCampaginUser = new CampaginUser({
                            customId: `${newcampaign.name}_${Math.round(new Date().getTime() / 1000)}`,
                            campaignId: newcampaign._id,
                            count: receiverData.length,
                            userData: receiverData
                        })
                        promiseArray.push(newCampaginUser.save());
                    }
                    Promise.all(promiseArray).then(response => {
                        res.json(newcampaign);
                    }).catch(error => {
                        res.json(newcampaign);
                    });
                })
                .catch(error => res.json(error));
        }
    });
});

// Get the campaign Details
router.get('', (req, res) => {
    Campaign.find().lean().then(campaigns => {
        if (campaigns) {
            res.status(200).json(campaigns);
        } else {
            res.status(200).json({ success: "true", message: "No Campaigns are found" })
        }
    });
});

// details of a specific campaign
router.get('/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: "false", message: "Invalid Campaign id" });
    }

    Campaign.findById({ _id: req.params.id }).lean().then(campaign => {
        if (campaign) {
            res.status(200).json(campaign);
        } else {
            res.status(400).json({ success: "false", message: "Campaign doesnt exists for the given id" });
        }
    });
});

// add schedule to campaign
router.post('/:id/schedule', (req, res) => {
    const campaignDataObj = {
        scheduledDate: new Date(req.body.scheduledDate).toISOString(),
        emailBody: req.body.emailBody,
        emailSubject: req.body.emailSubject,
        emailParams: req.body.emailParams
    };
    Campaign.findByIdAndUpdate({ _id: req.params.id }, {
        $push: {
            campaignData: campaignDataObj
        }
    }, { new: true }).then(campaign => {
        if (campaign) {
            // create a new Job for the campaign
            const campaignDataId = campaign.campaignData[campaign.campaignData.length - 1]._id;
            agenda.schedule(new Date(req.body.scheduledDate).toISOString(), 'create schedule', { campainId: campaign._id, campaignDataId });
        } else {
            res.status(400).json({ success: "false", message: "Campaign doesnt exists for the given id" });
        }
        res.json(campaign);
    }).catch(error => {
        console.log(error, "Err")
        res.status(400).json({ success: "false", message: error });
    });
});

// unsubscribe
router.post('/:customid/unsubscribe', (req, res) => {
    const customId = req.params.customid;
    const userId = req.query.userId;

    CampaginUser.update({ customId, 'userData._id': userId }, { $set: { 'userData.$.unsubscribe': true } })
        .lean()
        .then(response => {
            res.json(response);
        }).catch(error => {
            res.json({ success: "false", message: error });
        });
});

// get the list of users from a campaign
router.get('/:id/users', (req, res) => {
    const name = req.query.name;
    const limit = Number(req.query.limit);
    CampaignUser.find({ customId: new RegExp('^' + name + '_') })
        .sort({ customId: 1 })
        .limit(limit)
        .then(users => {
            res.json(users);
        }).catch(error => {
            console.log(error);
            res.json({ success: "false", message: error });
        });
});


module.exports = router;