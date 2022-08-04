import { TurnContext } from "botbuilder";
import { CardActionHandler } from "./actionHandler";

export interface IActionRegistry {
    registry: CardActionHandler[];
    registerHandler(id: string, handler: (context: TurnContext, cardData: any) => Promise<any>): void;
}

export class ActionRegistry implements IActionRegistry{
    registry: CardActionHandler[] = [];
    registerHandler(id: string, handleActionInvoked: (context: TurnContext, cardData: any) => Promise<any>): this {
        if (id) {           
            const actionHandler: CardActionHandler = {
                verb: id,
                handleActionInvoked: handleActionInvoked
            };

            this.registry.push(actionHandler);
        }

        return this;
    }
}