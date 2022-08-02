import { BotFrameworkAdapter, TurnContext } from "botbuilder";
import { ActionMiddleware } from "./actionMiddleware";

export class CardActionHandler {
    verb: string;
    callback: (context: TurnContext) => Promise<any>;

    constructor(verb: string, callback: (context: TurnContext) => Promise<any>) {
        this.verb = verb;
        this .callback = callback;
    }
}

export interface CardActionOptions {
    handlers: CardActionHandler[];
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

    registerHandler(id: string, callback: (context: TurnContext) => Promise<any>): this {
        if (id) {
            this.middleware.registerHandler(id, callback);
        }
        return this;
    }
}