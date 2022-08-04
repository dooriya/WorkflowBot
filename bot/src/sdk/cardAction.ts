// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BotFrameworkAdapter } from "botbuilder";
import { CardActionOptions, TeamsFxBotCardActionHandler } from "./interface";
import { CardActionMiddleware } from "./middleware";

/**
 * A command bot for receiving commands and sending responses in Teams.
 *
 * @remarks
 * Ensure each command should ONLY be registered with the command once, otherwise it'll cause unexpected behavior if you register the same command more than once.
 */
export class CardActionBot {
    private readonly adapter: BotFrameworkAdapter;
    private readonly middleware: CardActionMiddleware;

    /**
     * Creates a new instance of the `CardActionBot`.
     *
     * @param adapter The bound `BotFrameworkAdapter`.
     * @param options - initialize options
     */
    constructor(adapter: BotFrameworkAdapter, options?: CardActionOptions) {
        this.middleware = new CardActionMiddleware(options?.actions);
        this.adapter = adapter.use(this.middleware);
    }

    /**
     * Registers an action into the card action bot.
     *
     * @param action The action to registered.
     */
    public registerAction(action: TeamsFxBotCardActionHandler): void {
        if (action) {
            this.middleware.actionHandlers.push(action);
        }
    }

    /**
     * Registers actions into the card action bot.
     *
     * @param actions The actions to registered.
     */
    public registerActions(actions: TeamsFxBotCardActionHandler[]): void {
        if (actions) {
            this.middleware.actionHandlers.push(...actions);
        }
    }
}
