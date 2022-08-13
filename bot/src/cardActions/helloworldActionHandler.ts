import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldCardAction.json";
import { TeamsFxBotCardActionHandler, TeamsFxBotCardBehavior } from "../sdk/interface";

/**
 * The `HelloWorldCardActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldCardActionHandler implements TeamsFxBotCardActionHandler {
    triggerVerb = "acknowledged";
    cardBehavior = TeamsFxBotCardBehavior.Default;

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(helloWorldCard).render(actionData);
    }
}