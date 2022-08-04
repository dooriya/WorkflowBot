import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import card1c from "../adaptiveCards/helloworldAction1c.json";
import { TeamsFxBotCardActionHandler } from "../sdk/interface";

/**
 * The `HelloWorldActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldAction1cHandler implements TeamsFxBotCardActionHandler {
    triggerVerb: string = "doAction1c";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(card1c).render(actionData);
    }
}