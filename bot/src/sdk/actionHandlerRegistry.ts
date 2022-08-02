import { TurnContext } from "botbuilder";
import { CardActionHandler } from "./actionHandler";

export interface IHandlerRegistry {
    registry: CardActionHandler[];
    registerHandler(id: string, handler: (context: TurnContext) => Promise<any>): void;
}

export class ActionHandlerRegistry implements IHandlerRegistry{
    registry: CardActionHandler[] = [];
    registerHandler(id: string, handler: (context: TurnContext) => Promise<any>): this {
        if (id) {           
            const actionHandler = new CardActionHandler();
            actionHandler.verb = id;
            actionHandler.callback = handler;
            this.registry.push(actionHandler);
        }

        return this;
    }
}