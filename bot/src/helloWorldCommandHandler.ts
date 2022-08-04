import { Activity, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "./sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import helloWorldCommandResponseCard from "./adaptiveCards/helloworldCommandResponse.json";
import action1aResponseCard from "./adaptiveCards/action1aResponse.json";
import action1bResponseCard from "./adaptiveCards/action1bResponse.json";
import action1cResponseCard from "./adaptiveCards/action1cResponse.json";
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
    { verb: "doAction1a", handleActionInvoked: this.handleAction1a },
    { verb: "doAction1b", handleActionInvoked: this.handleAction1b },
    { verb: "doAction1c", handleActionInvoked: this.handleAction1c },
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

  // @WorkflowStep("doAction1a")
  async handleAction1a(context: TurnContext, cardData: any): Promise<any> {
    const assignedToCardJson = AdaptiveCards.declare(action1aResponseCard).render(cardData);
    return assignedToCardJson;
  }

  // @WorkflowStep("doAction1b")
  async handleAction1b(context: TurnContext, cardData: any): Promise<any> {
    const assignedToCardJson = AdaptiveCards.declare(action1bResponseCard).render(cardData);
    return assignedToCardJson;
  }

  // @WorkflowStep("doAction1c")
  async handleAction1c(context: TurnContext, cardData: any): Promise<any> {
    const assignedToCardJson = AdaptiveCards.declare(action1cResponseCard).render(cardData);
    return assignedToCardJson;
  }

  // @WorkflowStep("doAction2")
  async handleAction2(context: TurnContext, cardData: any): Promise<any> {
    const responseCard = AdaptiveCards.declare(action2ResponseCard).render(cardData);
    return responseCard;
  }
}

export const helloWorldCommand = new HelloWorldCommand();