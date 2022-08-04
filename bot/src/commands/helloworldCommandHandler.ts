import { Activity, CardFactory, MessageFactory, TeamsInfo, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface";
import helloWorldCard from "../adaptiveCards/helloworldCommand.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";

/**
 * The `HelloWorldCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class HelloWorldCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "helloWorld";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    var createdByUser = await TeamsInfo.getMember(context, context.activity.from.id);
    const helloWorldCardJson = AdaptiveCards.declare(helloWorldCard).render({
      createdByUserId: createdByUser.id,
      title: "Your Hello World Bot is Running",
      body: "Congratulations! Your hello world bot is running. Card will refreshed automatically for creator view, and keep unchanged for others view.",
    });

    return MessageFactory.attachment(CardFactory.adaptiveCard(helloWorldCardJson));
  }
}
