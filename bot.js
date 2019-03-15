// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');

class MyBot {

    constructor(qnaServices,luisRecognizer) {
        this.qnaServices = qnaServices;
        this.luisRecognizer = luisRecognizer;
    }

    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        /*
        ***** ORIGINAL TUTORIAL *****
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
        */

        /*
        ***** ADDED QNA *****
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
        */

        /*
        ***** ONLY LUIS *****
         // By checking the incoming Activity type, the bot only calls LUIS in appropriate cases.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Perform a call to LUIS to retrieve results for the user's message.
            const results = await this.luisRecognizer.recognize(turnContext);

            // Since the LuisRecognizer was configured to include the raw results, get the `topScoringIntent` as specified by LUIS.
            const topIntent = results.luisResult.topScoringIntent;

            if (topIntent.intent !== 'None') {
                await turnContext.sendActivity(`LUIS Top Scoring Intent: ${ topIntent.intent }, Score: ${ topIntent.score }`);
            } else {
                // If the top scoring intent was "None" tell the user no valid intents were found and provide help.
                await turnContext.sendActivity(`No LUIS intents were found.
                                                \nThis sample is about identifying two user intents:
                                                \n - 'Calendar.Add'
                                                \n - 'Calendar.Find'
                                                \nTry typing 'Add Event' or 'Show me tomorrow'.`);
            }
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate &&
            turnContext.activity.recipient.id !== turnContext.activity.membersAdded[0].id) {
            // If the Activity is a ConversationUpdate, send a greeting message to the user.
            await turnContext.sendActivity('Welcome to the NLP with LUIS sample! Send me a message and I will try to predict your intent.');
        } else if (turnContext.activity.type !== ActivityTypes.ConversationUpdate) {
            // Respond to all other Activity types.
            await turnContext.sendActivity(`[${ turnContext.activity.type }]-type activity detected.`);
        }        
        */ 
        // By checking the incoming Activity type, the bot only calls LUIS in appropriate cases.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Perform a call to LUIS to retrieve results for the user's message.
            const results = await this.luisRecognizer.recognize(turnContext);

            // Since the LuisRecognizer was configured to include the raw results, get the `topScoringIntent` as specified by LUIS.
            const topIntent = results.luisResult.topScoringIntent;

            if (topIntent.intent !== 'None') {
                for (let i = 0; i < this.qnaServices.length; i++) {
                await turnContext.sendActivity(`LUIS Top Scoring Intent: ${ topIntent.intent }, Score: ${ topIntent.score }`);
                }
            } else {
                                    // Perform a call to the QnA Maker service to retrieve matching Question and Answer pairs.
                                    for (let i = 0; i < this.qnaServices.length; i++) {
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
                // If the top scoring intent was "None" tell the user no valid intents were found and provide help.
                /*
                await turnContext.sendActivity(`No LUIS intents were found.
                                                \nThis sample is about identifying two user intents:
                                                \n - 'Calendar.Add'
                                                \n - 'Calendar.Find'
                                                \nTry typing 'Add Event' or 'Show me tomorrow'.`);
                                                */
                                }
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate &&
            turnContext.activity.recipient.id !== turnContext.activity.membersAdded[0].id) {
            // If the Activity is a ConversationUpdate, send a greeting message to the user.
            await turnContext.sendActivity('Welcome to the NLP with LUIS sample! Send me a message and I will try to predict your intent.');
        } else if (turnContext.activity.type !== ActivityTypes.ConversationUpdate) {
            // Respond to all other Activity types.
            await turnContext.sendActivity(`[${ turnContext.activity.type }]-type activity detected.`);
        }        
    }
}

module.exports.MyBot = MyBot;
