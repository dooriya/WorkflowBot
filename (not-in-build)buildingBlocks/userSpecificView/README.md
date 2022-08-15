# Auto-refresh to user-specific view

Earlier if Adaptive Cards were sent in a Teams conversation, all users would see the exact same card content. With the action auto-refreshed pattern, User Specific Views of Adaptive Cards can be provided to users. In this way, the same Adaptive Card can now refresh to a User Specific Adaptive Card. A user can progress through their workflow without modifying the card for other users. 

It provides powerful scenarios like approvals, poll creator controls, ticketing, incident management, and project management cards. 

![image](https://user-images.githubusercontent.com/10163840/184892286-46419511-ad34-4815-aad2-ead28f536c05.png)

Below are the steps to implement this pattern with TeamsFx SDK.

### Step 1: enable refresh in a base adaptive card
As illustrated above, user-specific views are refreshed from a base card (e.g. the `card2` is refreshed from `card1`). So you need to enable `auto-refresh` on the base card (e.g. the `card1`). There're two options to achieve this:

#### **Option 1**: enable user-specific view refresh with SDK
The base card can be sent as a command response or a card action response. So you can enable user-specific view refresh in a `handleCommandReceived` of a command handler, or in a `handleActionInvoked` of a card action handler where the base card iss returned.

Below is a sample that a command response can be auto-refreshed to user-specific view. 
```typescript
import baseCard from "../adaptiveCards/myResponseCard1.json"; 

export class MyCommandHandler1 implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "helloWorld";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    const refreshVerb = "userViewRefresh";        // verb to identify the refresh action
    const userIds = [ context.activity.from.id ]; // users who will be refreshed
    const data = { key: "value"};                 // optional data associated with the action

    const responseCard = AdaptiveCards
        .declare(baseCard)
        .refresh(refreshVerb, userIds, data)
        .render(cardData);
    
    return MessageFactory.attachment(CardFactory.adaptiveCard(responseCard));
  }
}
```

#### Option 2: enable user-specific view refresh in your adaptive card JSON

Here's the sample refresh action defined in `myResponseCard1.json`: 

```json
{ 
  "type": "AdaptiveCard", 
  "refresh": { 
    "action": { 
      "type": "Action.Execute", 
      "title": "Refresh", 
      "verb": "auto-refresh" ,
      "data": { 
        "key": "value" 
      }
    }, 
    "userIds": [ 
      "${userID}" 
    ] 
  }, 
  "body": [ 
    ... 
  ], 
  ... 
}
```

`myResponseCard1` will be refreshed automatically to User Specific View and trigger the action for the specific users, which are defined in userIds property of refresh property of the Adaptive Card JSON. The card remains the same for other users in the conversation. You need to replace `${userID}` with user MRI in code when rendering your card content.

### Step 2: add card action handler to handle "refresh"

```typescript
import myResponseCard1 from "../adaptiveCards/myResponseCard1.json"; 

export class Handler1 implements TeamsFxBotCardActionHandler { 
    triggerVerb: string = "auto-refresh"; 
 
    async handleActionInvoked(context: TurnContext, actionData: any): Promise<IAdaptiveCard | void> { 
        return AdaptiveCards.declare(card2).render(actionData); 
    } 
} 
```
 
### Step 3: register the action handler 

bot/src/internal/initialize.ts 
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
 
## Related Documents

- [Sample: Action Chaining Pattern](https://github.com/dooriya/WorkflowBot/tree/qinezh/draft-chaining)
- [Sample: Action Conditional Pattern](https://github.com/dooriya/WorkflowBot/tree/qinezh/draft-fan)
- [Sample: Action Auto-Refreshed Pattern](https://github.com/dooriya/WorkflowBot/tree/qinezh/draft-refresh)
- [About Bot Workflow](https://microsoftapc.sharepoint.com/:w:/t/DevDivTeamsDevXProductTeam/EcyFDXNQGqVIiqHCaRt5T4cBUDDcy7ixA0ppYdWVJCE4vw?e=TAtEzt)
