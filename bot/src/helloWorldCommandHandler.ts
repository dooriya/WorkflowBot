import { Activity, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "./sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import helloWorldCommandResponseCard from "./adaptiveCards/helloworldCommandResponse.json";
import actionResponseCard from "./adaptiveCards/actionResponse.json";
import { CardData } from "./cardModels";
import { CardActionHandler } from "./sdk/actionHandler";
import { MessageBuilder } from "./sdk/messageBuilder";

/**
<<<<<<< HEAD
 * The `HelloWorldCommand` registers a pattern with the `TeamsFxBotCommandHandler` and responds
=======
 * The `IncidentReportingWorkflow` registers a pattern with the `TeamsFxBotCommandHandler` and responds
>>>>>>> 8c8f7fb (Simple helloworld sample for action handling)
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */

export class HelloWorldCommand implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "helloWorld";
  actionHandlers: CardActionHandler[] = [
    { verb: "doAction", callback: this.handleAction }
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

  // @WorkflowStep("doAction")
<<<<<<< HEAD
  async handleAction(context: TurnContext, cardData: any): Promise<any> {
    const responseCard = AdaptiveCards.declare(actionResponseCard).render(cardData);
    return responseCard;
=======
  async handleAction(context: TurnContext): Promise<any> {
    const action = context.activity.value.action;
    const assignedToCardJson = AdaptiveCards.declare(actionResponseCard).render(action.data);
    return assignedToCardJson;
>>>>>>> 8c8f7fb (Simple helloworld sample for action handling)
  }
}

export const helloWorldCommand = new HelloWorldCommand();