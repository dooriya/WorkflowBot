import { Activity, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "./sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import helloWorldCommandResponseCard from "./adaptiveCards/helloworldCommandResponse.json";
import action1ResponseCard from "./adaptiveCards/action1Response.json";
import action2ResponseCard from "./adaptiveCards/action2Response.json";
import { CardData } from "./cardModels";
import { CardActionHandler } from "./sdk/actionHandler";
import { MessageBuilder } from "./sdk/messageBuilder";

/**
 * The `HelloWorldCommand` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */

export class HelloWorldCommand implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "helloWorld";
  actionHandlers: CardActionHandler[] = [
    { verb: "doAction1", handleActionInvoked: this.handleAction1 },
    { verb: "doAction2", handleActionInvoked: this.handleAction2 }
  ];

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    // Render your adaptive card for reply message
    const cardData: CardData = {
      title: "Your Hello World Bot is Running",
      body: "Congratulations! Your hello world bot is running. Click the documentation below to learn more about Bots and the Teams Toolkit.",
    };

    return MessageBuilder.attachAdaptiveCard<CardData>(helloWorldCommandResponseCard, cardData);
  }

  // @WorkflowStep("doAction1")
  async handleAction1(context: TurnContext, cardData: any): Promise<any> {
    const responseCard = AdaptiveCards.declare(action1ResponseCard).render(cardData);
    return responseCard;
  }

  // @WorkflowStep("doAction2")
  async handleAction2(context: TurnContext, cardData: any): Promise<any> {
    const responseCard = AdaptiveCards.declare(action2ResponseCard).render(cardData);
    return responseCard;
  }
}

export const helloWorldCommand = new HelloWorldCommand();