import {
    ActivityTypes,
    CardFactory,
    InvokeResponse,
    MessageFactory,
    Middleware,
    TurnContext
} from "botbuilder";
import { AdaptiveCardResponse, CardPromptMessage, CardPromptMessageType, TeamsFxAdaptiveCardActionHandler } from "./cardActionHandler";
import { InvokeResponseFactory } from "./invokeResponseFactory";

/**
 * @internal
 */
export class CardActionMiddleware implements Middleware {
    public readonly actionHandlers: TeamsFxAdaptiveCardActionHandler[] = [];
    private readonly defaultCardMessage: CardPromptMessage = {
        text: "Your response was sent to the app",
        type: CardPromptMessageType.Info
    };

    private readonly defaultInvokeResponseMessage: string = "Your response was sent to the app";

    constructor(handlers?: TeamsFxAdaptiveCardActionHandler[]) {
        if (handlers && handlers.length > 0) {
            this.actionHandlers.push(...handlers);
        }
    }

    async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if (context.activity.name === "adaptiveCard/action") {
            const action = context.activity.value.action;
            const actionVerb = action.verb;

            for (const handler of this.actionHandlers) {
                if (handler.triggerVerb === actionVerb) {
                    let response: InvokeResponse;
                    try {
                        response = await handler.handleActionInvoked(context, action.data);
                    } catch (error) {
                        await this.sendInvokeResponse(context, InvokeResponseFactory.textMessage(this.defaultInvokeResponseMessage));                      
                        throw error;
                    }

                    const responseType = response.body?.type;
                    switch (responseType) {
                        case "application/vnd.microsoft.activity.message":
                            await this.sendInvokeResponse(context, response);
                            break;
                        case "application/vnd.microsoft.card.adaptive":
                            const card = response.body?.value;
                            if (!card) {
                                await this.sendInvokeResponse(context, InvokeResponseFactory.textMessage(this.defaultInvokeResponseMessage));
                                throw new Error(`Adaptive card content cannot be found in the response body`);
                            }

                            if (card.refresh && handler.adaptiveCardResponse !== AdaptiveCardResponse.NewForAll) {
                                // Card won't be refreshed with AdaptiveCardResponse.ReplaceForInteractor.
                                // So set to AdaptiveCardResponse.ReplaceForAll here.
                                handler.adaptiveCardResponse = AdaptiveCardResponse.ReplaceForAll;
                            }

                            const activity = MessageFactory.attachment(CardFactory.adaptiveCard(card));
                            if (handler.adaptiveCardResponse === AdaptiveCardResponse.NewForAll) {                               
                                await this.sendInvokeResponse(context, InvokeResponseFactory.textMessage(this.defaultInvokeResponseMessage));
                                await context.sendActivity(activity);
                            } else if (handler.adaptiveCardResponse === AdaptiveCardResponse.ReplaceForAll) {
                                activity.id = context.activity.replyToId;
                                await context.updateActivity(activity);
                                await this.sendInvokeResponse(context, response);
                            } else {
                                await this.sendInvokeResponse(context, response);
                            }
                            break;
                        case "application/vnd.microsoft.error":                       
                        default:
                            await this.sendInvokeResponse(context, response);
                            break;
                    }
                }
            }
        }

        await next();
    }

    private async sendInvokeResponse(context: TurnContext, response: InvokeResponse) {
        await context.sendActivity({
            type: ActivityTypes.InvokeResponse,
            value: response
        });
    }
}