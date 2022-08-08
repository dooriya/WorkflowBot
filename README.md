# Card Action Chaining
In the card action chaining pattern, a sequence of adaptive card actions is executed in a specific order. In this pattern, the card action output of one card is applied to the card action input of another card. 

![](./chaining.png)

You can use TeamsFx SDK to implement the card action chaining pattern concisely as shown in this example. 

In this example, the adaptive card `Card 1` can be sent by command bot or notification bot. When the action defined in `Card 1` is executed by users, the card action handler `Handler 1` will be triggered and return another card `Card 2`. Then the existing `Card 1` will be replaced by `Card 2`. Similarly, `Card 3` will be returned once the action defined in `Card 2` is executed. 

## Related Documents

- [About Bot Workflow](https://microsoftapc.sharepoint.com/:w:/t/DevDivTeamsDevXProductTeam/EcyFDXNQGqVIiqHCaRt5T4cBUDDcy7ixA0ppYdWVJCE4vw?e=TAtEzt)