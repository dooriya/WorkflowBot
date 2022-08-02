import { BotFrameworkAdapter, TurnContext } from "botbuilder";
import { ActionHandlerMiddleware } from "./actionHandlerMiddleware";

export class CardActionHandler {
    verb: string;
    callback: (context: TurnContext) => Promise<any>;
}

export interface ActionHandlerOptions {
    handlers: CardActionHandler[];
}

export class ActionHandlerBot {
    private readonly adapter: BotFrameworkAdapter;
    private middleware: ActionHandlerMiddleware;
  
    /**
     * Creates a new instance of the `ActionHandlerBot`.
     *
     * @param adapter The bound `BotFrameworkAdapter`.
     * @param options - initialize options
     */
    constructor(adapter: BotFrameworkAdapter, options?: ActionHandlerOptions) {
        this.middleware = new ActionHandlerMiddleware(options?.handlers);
        this.adapter = adapter.use(this.middleware);
    }

    registerHandler(id: string, callback: (context: TurnContext) => Promise<any>): this {
        if (id) {
            this.middleware.registerHandler(id, callback);
        }
        return this;
    }
}