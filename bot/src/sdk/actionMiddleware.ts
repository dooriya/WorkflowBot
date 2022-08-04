import { ActivityTypes, InvokeResponse, Middleware, StatusCodes, TurnContext } from "botbuilder";
import { CardActionHandler } from "./actionHandler";

export class ActionMiddleware implements Middleware  {
    private readonly actionHandlers: Map<string, CardActionHandler> = new Map<string, CardActionHandler>();

    constructor(handlers?: CardActionHandler[])  {
        if (handlers && handlers.length > 0) {
            this.registerHandlers(handlers);
        }
    }

    async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if (context.activity.name == "adaptiveCard/action") {
            const action = context.activity.value.action;
            const verb = action.verb;

            if (this.actionHandlers.has(verb)) {
                const handler = this.actionHandlers.get(verb);
                const responseCard = await handler.callback(context, action.data);
                const invokeResponse = this.createAdaptiveCardInvokeResponse(responseCard);

                await context.sendActivity({
                    type: ActivityTypes.InvokeResponse,
                    value: invokeResponse,
                });
            }
        }

        await next();     
    }

    registerHandler(cardActionHandler: CardActionHandler) {
        const verb = cardActionHandler.verb;
        if (verb && this.actionHandlers.has(verb)) {
            this.actionHandlers.set(verb, cardActionHandler);
        }
    }

    registerHandlers(handlers: CardActionHandler[]) {
        for (const handler of handlers) {
            // Note: if more than two handlers use the same verb id, then the first one will be taken.
            if (!this.actionHandlers.has(handler.verb)) {
                this.actionHandlers.set(handler.verb, handler);
            }
        }
    }

    private createAdaptiveCardInvokeResponse(card: any): InvokeResponse<any> {
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
}