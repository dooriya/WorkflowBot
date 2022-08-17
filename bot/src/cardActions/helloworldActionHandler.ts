import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldCardAction.json";
import { CardPromptMessage, TeamsFxAdaptiveCardActionHandler } from "../sdk/interface";

/**
 * The `HelloWorldCardActionHandler` registers an action with the `TeamsFxAdaptiveCardActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldCardActionHandler implements TeamsFxAdaptiveCardActionHandler {
    triggerVerb = "acknowledged";

    async handleActionInvoked(context: TurnContext, actionData: any): Promise<IAdaptiveCard | CardPromptMessage | void> {
        return AdaptiveCards.declare(helloWorldCard).render(actionData);
    }
}