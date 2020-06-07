const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignDataSchema = new Schema({
    scheduledDate: {
        type: Date,
        required: true
    },
    emailBody: {
        type: String,
        required: true
    },
    emailSubject: {
        type: String,
        required: true
    },
    emailParams: {
        type: Schema.Types.Mixed
    }
});

// Create Schema
const CampaignSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    campaignData: {
        type: [CampaignDataSchema]
    },
    userCount: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

CampaignSchema.index({name: 1});

module.exports = Campaign = mongoose.model("campaign", CampaignSchema);
