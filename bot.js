// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');

class MyBot {

    constructor(qnaServices) {
        this.qnaServices = qnaServices;
    }

    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        /*
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
        */
       if (turnContext.activity.type === ActivityTypes.Message) {
        for (let i = 0; i < this.qnaServices.length; i++) {
            // Perform a call to the QnA Maker service to retrieve matching Question and Answer pairs.
            const qnaResults = await this.qnaServices[i].getAnswers(turnContext);

            // If an answer was received from QnA Maker, send the answer back to the user and exit.
            if (qnaResults[0]) {
                await turnContext.sendActivity(qnaResults[0].answer);
                return;
            }
        }
        // If no answers were returned from QnA Maker, reply with help.
        await turnContext.sendActivity('No QnA Maker answers were found. '
            + 'This example uses a QnA Maker Knowledge Base that focuses on smart light bulbs. '
            + `Ask the bot questions like "Why won't it turn on?" or "I need help."`);
    } else {
        await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
    }
    }
}

module.exports.MyBot = MyBot;
