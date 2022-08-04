import { Activity, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface"
import getStatusActionResponseCard from "../adaptiveCards/getStatusActionResponse.json";
import { MessageBuilder } from "../sdk/messageBuilder";

/**
 * The `GetStatusCommand` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class GetStatusCommand implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "getStatus";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    // Mock API call to retrieve async action execution status
    const actionStatus = "Completed";
    const cardData = { status: actionStatus };
    return MessageBuilder.attachAdaptiveCard(getStatusActionResponseCard, cardData);
  }
}

export const getStatusCommand = new GetStatusCommand();