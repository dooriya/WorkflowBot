import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldAction.json";
import { TeamsFxBotActionHandler } from "../sdk/interface";

export class HelloWorldActionHandler implements TeamsFxBotActionHandler {
    triggerVerb: string = "acknowledged";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        return AdaptiveCards.declare(helloWorldCard).render(actionData);
    }
}