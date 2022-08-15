# Card Action Auto-Refreshed

Earlier if Adaptive Cards were sent in a Teams conversation, all users would see the exact same card content. With the action auto-refreshed pattern, User Specific Views of Adaptive Cards can be provided to users. In this way, the same Adaptive Card can now refresh to a User Specific Adaptive Card. A user can progress through their workflow without modifying the card for other users. 

It provides powerful scenarios like approvals, poll creator controls, ticketing, incident management, and project management cards. 

![](./refresh.png)

Below are the steps to implement this pattern with TeamsFx SDK. 

### Step 1: add refresh action to your adaptive card 

Here's the sample refresh action defined in `myResponseCard1.json`: 

```json
{ 
  "type": "AdaptiveCard", 
  "refresh": { 
    "action": { 
      "type": "Action.Execute", 
      "title": "Refresh", 
      "verb": "auto-refresh" 
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

`myResponseCard1` will be refreshed automatically to User Specific View and trigger the action for the specific users, which are defined in userIds property of refresh property of the Adaptive Card JSON. The card remains the same for other users in the conversation. 

### Step 2: add card action handler 

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
