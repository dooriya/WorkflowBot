import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import card2 from "../adaptiveCards/helloworldAction2.json";
import { TeamsFxBotCardActionHandler } from "../sdk/interface";

/**
 * The `HelloWorldActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldAction2Handler implements TeamsFxBotCardActionHandler {
    triggerVerb: string = "doAction2";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(card2).render(actionData);
    }
}