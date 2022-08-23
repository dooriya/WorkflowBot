import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { InvokeResponse, StatusCodes, TurnContext } from "botbuilder";
import helloWorldCard from "../adaptiveCards/helloworldCardResponse.json";
import { CardData } from "../cardModels";
import { AdaptiveCardResponse, TeamsFxAdaptiveCardActionHandler } from "../sdk/interface";
import { InvokeResponseFactory } from "../sdk/invokeResponseFactory";

/**
 * The `HelloWorldCardActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card Action with `triggerVerb`.
 */
export class HelloWorldCardActionHandler implements TeamsFxAdaptiveCardActionHandler {
    triggerVerb = "doStuff";
    adaptiveCardResponse = AdaptiveCardResponse.ReplaceForInteractor;

    async handleActionInvoked(context: TurnContext, actionData: any): Promise<InvokeResponse> {
        const cardData: CardData = {
            title: "Hello World Bot",
            body: "Congratulations! Your task is processed successfully.",
        };
  
        const responseCard = AdaptiveCards.declare(helloWorldCard).render(cardData);
        return InvokeResponseFactory.adaptiveCard(responseCard);

        /**
         * If you want to  send invoke response with text message, you can: 
         * return InvokeResponseFactory.textMessage("[ACK] Successfully!");
         */

        /**
         * If you want to send invoke response with error message, you can:
         * return InvokeResponseFactory.errorResponse(StatusCodes.BAD_REQUEST, "some error occurred ....");
         */
    }
}