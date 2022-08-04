import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import card1a from "../adaptiveCards/helloworldAction1a.json";
import { TeamsFxBotCardActionHandler } from "../sdk/interface";

/**
 * The `HelloWorldActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldAction1aHandler implements TeamsFxBotCardActionHandler {
    triggerVerb: string = "doAction1a";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(card1a).render(actionData);
    }
}