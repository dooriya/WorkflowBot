import { BotFrameworkAdapter, TurnContext } from "botbuilder";
import { IAdaptiveCard } from "adaptivecards";

/**
 * Options used to control how the response card will be sent to users.
 */
export enum AdaptiveCardResponse {
    /**
     * The response card will be replaced the current one for the interactor.
     */
     ReplaceForInteractor,

    /**
     * The response card will be replaced the current one for all users in the chat.
     */
     ReplaceForAll,

    /**
     * The response card will be sent as a new message for all users in the chat.
     */
     NewForAll
}

/**
 * Interface for adaptive card action handler that can process card action invoke and return a response.
 */
export interface TeamsFxAdaptiveCardActionHandler {
    /**
     * The verb defined in adaptive card action that can trigger this handler.
     */
    triggerVerb: string;

    /**
     * Indicate the behavior for how the card response will be sent in Teams conversation.
     */
    adaptiveCardResponse?: AdaptiveCardResponse,
    
    /**
     * The handler function that will be invoked when the action is fired.
     * @param context The turn context.
     * @param actionData The contextual data that associated with the action.
     */
    handleActionInvoked(context: TurnContext, actionData: any): Promise<IAdaptiveCard | void>;
}