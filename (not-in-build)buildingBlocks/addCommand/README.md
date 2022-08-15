# Add more command
The Command and Response feature enables register simple commands and respond to them with adaptive cards. This enables your users to type in simple messages in Teams and your application can provide an appropriate response based on the contents of the message.

You can use the following 3 steps to add more command in your app:

1. [Step 1: add adaptive card for command response](#step-1-add-adaptive-card-for-command-response)
1. [Step 2: add new command handler](#step-2-add-new-command-handler)
3. [Step 3: register your command handler](#step-3-register-your-command-handler)
4. [Step 4: add command definition in manifest](#step-4-add-command-definition-in-manifest)

### Step 1: add adaptive card for command response
You can build your response data in text format or follow the steps bellow to use adaptive card to render rich content in Teams:

* Prepare your adaptive card content in a JSON file（e.g. myCard.json) under the `bot/adaptiveCards` folder, here is a sample adaptive card JSON payload:
```json
{
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "TextBlock",
            "size": "Medium",
            "weight": "Bolder",
            "text": "Your Hello World Bot is Running"
        },
        {
            "type": "TextBlock",
            "text": "Congratulations! Your hello world bot is running. Click the documentation below to learn more about Bots and the Teams Toolkit.",
            "wrap": true
        }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.4"
}
```

### Step 2: add new command handler

Add a .ts/.js file (e.g. `xxxCommandHandler.ts`) under `bot/src` to handle your bot command, and include the following boilerplate code to get-started:

```typescript
import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { MessageBuilder } from "@microsoft/teamsfx";

export class myCommandHandler1 implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = "<string or RegExp pattern to trigger the command>";

    async handleCommandReceived(
        context: TurnContext,
        message: CommandMessage
    ): Promise<string | Partial<Activity>> {
        // verify the command arguments which are received from the client if needed.
        console.log(`Bot received message: ${message.text}`);

        // do something to process your command and return message activity as the response.
        // You can leverage `MessageBuilder` utilities from the `@microsoft/teamsfx` SDK 
        // to facilitate building message with cards supported in Teams.
    }    
}
```

- Provide the `triggerPatterns` that can trigger this command handler. Usually it's the command name defined in your manifest, or you can use RegExp to handle a complex command (e.g. with some options in the command message).

- Implement `handleCommandReceived` to handle the command and return a response that will be used to notify the end users. 
    * You can retrieve useful information for the conversation from the `context` parameter if needed.
    * Parse command input if needed: 
        * `message.text`: the use input message
        * `message.matches`: the capture groups if you uses the RegExp for `triggerPatterns` to trigger the command.


### Step 3: register your command handler

Open `bot\src\internal\initialize.ts`: 
   
- update the call to `ConversationBot` constructor to include your new added command handlers.

```typescript
export const commandBot = new ConversationBot({
    ...
    command: {
        enabled: true,
        commands: [ 
            new HelloWorldCommandHandler(),
            new myCommandHandler1() ],
    },
});
```

### Step 4: add command definition in manifest
You can edit the manifest template file `templates\appPackage\manifest.template.json` to include:
* The command `title` that user type in the message compose area to trigger the command.
* The `command` description for this command.

    ![manifest-add-command](https://user-images.githubusercontent.com/10163840/160374446-7fd164d6-63c9-47b2-9bf1-0d6a88731e8d.png)


Now, you are all done with the code development of adding a new command and response into your bot app. You can just press `F5` to local debug with the command-response bot, or use provision and deploy command to deploy the change to Azure.     
