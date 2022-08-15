import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldCardAction.json";
import { TeamsFxAdaptiveCardActionHandler } from "../sdk/interface";

/**
 * The `MyCardActionHandler1` registers an action with the `TeamsFxAdaptiveCardActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class MyCardActionHandler1 implements TeamsFxAdaptiveCardActionHandler {
    triggerVerb: string = "acknowledged";

    async handleActionInvoked(context: TurnContext, actionData: any): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(helloWorldCard).render(actionData);
    }
}