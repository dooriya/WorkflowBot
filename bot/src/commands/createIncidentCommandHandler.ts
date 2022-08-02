import { Activity, CardFactory, MessageFactory, TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import initialCreateCard from "../adaptiveCards/initialCreate.json";

/**
 * The `HelloWorldCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class CreateIncidentCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "createIncident";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    var createdByUser = await TeamsInfo.getMember(context, context.activity.from.id);
    const initialCardJson = AdaptiveCards.declare(initialCreateCard).render({
      createdByName: createdByUser.name,
      createdByUserId: createdByUser.id
    });

    return MessageFactory.attachment(CardFactory.adaptiveCard(initialCardJson));
  }
}
