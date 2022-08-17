import { 
    ActivityTypes, 
    CardFactory, 
    InvokeResponse, 
    MessageFactory, 
    Middleware, 
    StatusCodes, 
    TaskModuleResponse, 
    TaskModuleTaskInfo, 
    TurnContext 
} from "botbuilder";
import { AdaptiveCardResponse, TeamsFxAdaptiveCardActionHandler } from "./cardActionHandler";

/**
 * @internal
 */
export class CardActionMiddleware implements Middleware {
    public readonly actionHandlers: TeamsFxAdaptiveCardActionHandler[] = [];

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
                if (handler.triggerVerb == actionVerb) {
                    const responseCard = await handler.handleActionInvoked(context, action.data);
                    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(responseCard));

                    if (responseCard) {
                        switch (handler.adaptiveCardResponse) {
                            case AdaptiveCardResponse.NewForAll:
                                // Send an invoke response to respond to the `adaptiveCard/action` invoke activity
                                await this.sendInvokeResponse(null, context);
                                await context.sendActivity(activity);
                                break;
                            case AdaptiveCardResponse.ReplaceForAll:
                                activity.id = context.activity.replyToId;
                                await context.updateActivity(activity);
                                await this.sendInvokeResponse(responseCard, context);
                                break;
                            default:
                                await this.sendInvokeResponse(responseCard, context);
                        }
                    } else {
                        await this.sendInvokeResponse(null, context);
                    }
                }
            }
        }

        await next();
    }

    private createAdaptiveCardInvokeResponse(card: any): InvokeResponse<any> {
        if (card) {
            const cardRes = {
                statusCode: StatusCodes.OK,
                type: 'application/vnd.microsoft.card.adaptive',
                value: card
            };
    
            const res = {
                status: StatusCodes.OK,
                body: cardRes
            };

            return res;
        }
        

        return undefined;
    }

    private async sendInvokeResponse(card: any, context: TurnContext): Promise<void> {
        let invokeResponse: InvokeResponse;
        if (card) {
            invokeResponse = this.createAdaptiveCardInvokeResponse(card);
        } else {
            // A default invoke response if the response card is null
            invokeResponse = {
                status: StatusCodes.OK,
                body:
                {
                    statusCode: 200,
                    type: "application/vnd.microsoft.activity.message",
                    value: "Your response was sent to the app"
                }
            }
        }

        await context.sendActivity({
            type: ActivityTypes.InvokeResponse,
            value: invokeResponse
        });
    }
}