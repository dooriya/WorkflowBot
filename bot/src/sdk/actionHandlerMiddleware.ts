import { ActivityTypes, InvokeResponse, Middleware, StatusCodes, TurnContext } from "botbuilder";
import { CardActionHandler } from "./actionHandler";

export class ActionHandlerMiddleware implements Middleware  {
    private readonly actionHandlers: Map<string, (context: TurnContext) => any> = new Map();

    constructor(handlers?: CardActionHandler[])  {
        if (handlers && handlers.length > 0) {
            this.registerHandlers(handlers);
        }
    }

    registerHandler(verb: string, handler: (context: TurnContext) => any) {
        if (verb && this.actionHandlers.has(verb)) {
            this.actionHandlers.set(verb, handler);
        }
    }

    registerHandlers(handlers: CardActionHandler[]) {
        for (const handler of handlers) {
            // Note: if more than two handlers use the same verb id, then the first one will be taken.
            if (!this.actionHandlers.has(handler.verb)) {
                this.actionHandlers.set(handler.verb, handler.callback);
            }
        }
    }

    async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if (context.activity.name == "adaptiveCard/action") {
            const action = context.activity.value.action;
            const verb = action.verb;

            if (this.actionHandlers.has(verb)) {
                const handler = this.actionHandlers.get(verb);
                const responseCard = await handler(context);
                const invokeResponse = this.createAdaptiveCardInvokeResponse(responseCard);

                await context.sendActivity({
                    type: ActivityTypes.InvokeResponse,
                    value: invokeResponse,
                });
            }
        }

        await next();     
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