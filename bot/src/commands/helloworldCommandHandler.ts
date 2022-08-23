import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface";
import helloWorldCard from "../adaptiveCards/helloworldCommand.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { CardData } from "../cardModels";
import { MessageBuilder } from "@microsoft/teamsfx";

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

    // Render your adaptive card for reply message
    const cardData: CardData = {
      title: "Your Hello World Bot is Running",
      body: "Congratulations! Your hello world bot is running. Click the button below to trigger an action.",
    };

    return MessageBuilder.attachAdaptiveCard<CardData>(helloWorldCard, cardData);
  }
}
