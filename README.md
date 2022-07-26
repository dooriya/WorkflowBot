# Sample Workflow Bot

This is a sample command bot powered by [Universal Actions for Adaptive Cards](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/universal-actions-for-adaptive-cards/overview?tabs=mobile) that can process incident management workflow.

**Typical Scenario**:
Megan, a safety inspector at Contoso, wants to create an incident and assign it to Alex. Megan also wants everyone in the team to be aware about the incident. Megan uses the `createIncident` command to trigger the workflow, and Alex can approve or reject the incident and let others know the status.

![workflow-bot](https://user-images.githubusercontent.com/10163840/181212378-888cfe0e-ebfe-4dce-af84-f301961b051a.gif)

The diagram below captures the adaptive card views transformation in this workflow:
![view-transformation](https://user-images.githubusercontent.com/10163840/181418059-87b6e1fa-53ab-4448-9e95-5fe9ce57edec.png)

The diagram below captures the sequence of events for initializing and processing the workflow:
![sequential-workflow](https://user-images.githubusercontent.com/10163840/181218504-880d8dfd-0383-4975-b87b-874beb52e82b.png)

## Development Steps
Assume developers are using a TeamsFx command bot:
1. [View] Define adaptive cards templates.
2. [Model] Define your card models that can used to render your cards.
2. [Controller] Handle the command response (the first card).
3. [Controller] Handle `adaptiveCard/action` invoke activities for refresh invoke or button click.

## Related Documents
- [Work with Universal Actions for Adaptive Cards](https://docs.microsoft.com/microsoftteams/platform/task-modules-and-cards/cards/universal-actions-for-adaptive-cards/work-with-universal-actions-for-adaptive-cards)
- [Sequential Workflow with Adaptive Card Universal Action](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/universal-actions-for-adaptive-cards/sequential-workflows)
