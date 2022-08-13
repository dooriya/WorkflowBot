import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TeamsInfo, TurnContext } from "botbuilder";
import statusResultCard from "../adaptiveCards/statusResult.json";
import statusCheckingCard from "../adaptiveCards/checkingStatus.json";
import { TeamsFxBotCardActionHandler, TeamsFxBotCardBehavior } from "../sdk/interface";

/**
 * The `HelloWorldCardActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class CheckStatusCardActionHandler implements TeamsFxBotCardActionHandler {
    triggerVerb = "checkStatus";
    cardBehavior = TeamsFxBotCardBehavior.UpdateCardToAllReceivers;

    checkStatusCount = 0;

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        console.log(`Bot received action: ${this.triggerVerb}`);

        const isFinished = await this.checkStatus();
        if (isFinished) {
            return AdaptiveCards.declare(statusResultCard).render(actionData);
        } else {
            return AdaptiveCards.declare(statusCheckingCard).render({
                checkStatusCount: this.checkStatusCount
            });
        }
    }

    // return true if the provision is finished.
    // return false if the provision is still in process.
    async checkStatus(): Promise<boolean> {
        if (this.checkStatusCount > 3) {
            this.checkStatusCount = 0;
        }
        this.checkStatusCount += 1;

        return Promise.resolve(this.checkStatusCount > 3);
    }
}
