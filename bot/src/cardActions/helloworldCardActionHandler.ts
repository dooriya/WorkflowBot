import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldCardAction.json";
import { TeamsFxBotCardActionHandler } from "../sdk/interface";

/**
 * The `HelloWorldActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldCardActionHandler implements TeamsFxBotCardActionHandler {
    triggerVerb: string = "auto-refresh";
    refresh = true;

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard | void> {
        return AdaptiveCards.declare(helloWorldCard).render(actionData);
    }
}