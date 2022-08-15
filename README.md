# Respond to Adaptive Card Action

When user gets an Adaptive Card, it can provide one or more buttons in the card to ask for user's input, do something like calling some APIs, and then send another adaptive card in conversation.

You can use the following 3 steps to achieve this:

1. [Step 1: add an action to your Adaptive Card](#step-1-add-an-action-to-your-adaptive-card)
2. [Step 2: add action handler ](#step-2-add-action-handler)
3. [Step 3: register the action handler](#step-3-register-the-action-handler)

## Step 1: add an action to your Adaptive Card

Here's a sample action with type `Action.Execute`:
```json
{ 
  "type": "AdaptiveCard", 
  "body": [...], 
  "actions": [
    { 
      "type": "Action.Execute", 
      "verb": "doAction1", 
      "title": "DoAction1" 
    }
  ], 
  ... 
} 
```

`Action.Execute` invoking the bot can return Adaptive Cards as a response, which will replace the existing card in conversation by default.  

## Step 2: add action handler 

Add handler to implements `TeamsFxAdaptiveCardActionHandler` to process the logic when corresponding action is executed.

Please note:
* The `triggerVerb` is the verb name of your action. 
* The `actionData` is the output of last card on user action and you can access the information input by the user. 
* If an Adaptive Card is returned, then the existing card will be replaced with it by default.

```typescript
import card2 from "../adaptiveCards/card2.json"; 

export class Handler1 implements TeamsFxAdaptiveCardActionHandler { 
    triggerVerb = "doAction1";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> { 
        return AdaptiveCards.declare(card2).render(actionData); 
    } 
} 
```

## Step 3: register the action handler

1. Go to `bot/src/internal/initialize.ts`;
2. Update your `conversationBot` initialization to enable cardAction feature and add the handler to `actions` array:

```typescript
export const commandBot = new ConversationBot({ 
  ... 
  cardAction: { 
    enabled: true, 
    actions: [ 
      new Handler1() 
    ], 
  } 
}); 
```
 
