import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldCardResponse.json";
import { AdaptiveCardResponse, TeamsFxAdaptiveCardActionHandler } from "../sdk/cardActionHandler";


/**
 * The `HelloWorldCardActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldCardActionHandler implements TeamsFxAdaptiveCardActionHandler {
    triggerVerb = "acknowledged";
    adaptiveCardResponse = AdaptiveCardResponse.ReplaceForInteractor;

    async handleActionInvoked(context: TurnContext, actionData: any): Promise<void | IAdaptiveCard> {
        return AdaptiveCards.declare(helloWorldCard).render(actionData);
    }
}