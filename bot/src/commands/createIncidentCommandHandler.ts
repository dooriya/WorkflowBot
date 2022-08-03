import { Activity, CardFactory, MessageFactory, TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import IncidentCard from "../adaptiveCards/incidentRequest.json";

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
    const IncidentCardJson = AdaptiveCards.declare(IncidentCard).render({
      incidentTitle: "Incident 101",
      createdByName: createdByUser.name
    });

    return MessageFactory.attachment(CardFactory.adaptiveCard(IncidentCardJson));
  }
}
