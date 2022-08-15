import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import myResponseCard1 from "../adaptiveCards/myResponseCard1.json";
import { TeamsFxAdaptiveCardActionHandler } from "../sdk/interface";

/**
 * The `MyCardActionHandler1` registers an action with the `TeamsFxAdaptiveCardActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class MyCardActionHandler1 implements TeamsFxAdaptiveCardActionHandler {
    triggerVerb: string = "myaction1";

    async handleActionInvoked(context: TurnContext, actionData: any): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(myResponseCard1).render(actionData);
    }
}