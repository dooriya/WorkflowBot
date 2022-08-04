import { BotFrameworkAdapter, TurnContext } from "botbuilder";
import { ActionMiddleware } from "./actionMiddleware";
import { CardActionOptions } from "./interface";

export interface CardActionHandler {
    verb: string;
    callback: (context: TurnContext, cardData: any) => Promise<any>;
}

export class ActionBot {
    private readonly adapter: BotFrameworkAdapter;
    private middleware: ActionMiddleware;
  
    /**
     * Creates a new instance of the `ActionBot`.
     *
     * @param adapter The bound `BotFrameworkAdapter`.
     * @param options - initialize options
     */
    constructor(adapter: BotFrameworkAdapter, options?: CardActionOptions) {
        this.middleware = new ActionMiddleware(options?.handlers);
        this.adapter = adapter.use(this.middleware);
    }

    registerHandler(actionHandler: CardActionHandler) {
        if (actionHandler.verb) {
            this.middleware.registerHandler(actionHandler);
        }
    }
}