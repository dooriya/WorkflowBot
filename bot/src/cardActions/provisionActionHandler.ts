import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TeamsInfo, TurnContext } from "botbuilder";
import checkStatusCard from "../adaptiveCards/checkingStatus.json";
import { TeamsFxBotCardActionHandler, TeamsFxBotCardBehavior } from "../sdk/interface";

/**
 * The `HelloWorldCardActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldCardActionHandler implements TeamsFxBotCardActionHandler {
    triggerVerb = "run";
    cardBehavior = TeamsFxBotCardBehavior.UpdateCardToAllReceivers;

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        console.log(`Bot received action: ${this.triggerVerb}`);

        // call async API to provision resources
        // and return the card with status checking immediately
        var createdByUser = await TeamsInfo.getMember(context, context.activity.from.id);
        return AdaptiveCards.declare(checkStatusCard).render({
            createdByUserID: createdByUser.id,
            checkStatusCount: 0
        });
    }
}