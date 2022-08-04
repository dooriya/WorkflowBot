import { Activity, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import helloWorldCommandResponseCard from "../adaptiveCards/helloworldCommandResponse.json";
import submitActionResponseCard from "../adaptiveCards/submitActionResponse.json";
import getStatusActionResponseCard from "../adaptiveCards/getStatusActionResponse.json";
import { CardData } from "../cardModels";
import { CardActionHandler } from "../sdk/actionHandler";
import { MessageBuilder } from "../sdk/messageBuilder";

/**
 * The `IncidentReportingWorkflow` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */

export class HelloWorldCommand implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "helloWorld";
  actionHandlers: CardActionHandler[] = [
    { verb: "submit", callback: this.handleSubmitAction },
    { verb: "getStatus", callback: this.handleGetStatusAction }
  ];


  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    // Render your adaptive card for reply message
    const cardData: CardData = {
      title: "Your Hello World Bot is Running",
      body: "Congratulations! Your hello world bot is running. You cal click the `submit` button bellow to trigger an async action."
    };

    return MessageBuilder.attachAdaptiveCard<CardData>(helloWorldCommandResponseCard, cardData);
  }

  // @WorkflowStep("submit")
  async handleSubmitAction(context: TurnContext, cardData: any): Promise<any> {
    const responseCard = AdaptiveCards.declare(submitActionResponseCard).render(cardData);
    return responseCard;
  }

  // @WorkflowStep("getStatus")
  async handleGetStatusAction(context: TurnContext, cardData: any): Promise<any> {
    // Mock API call to retrieve async action execution status
    const actionStatus = "In Progress";
    const data = { status: actionStatus };
    const responseCard = AdaptiveCards.declare(getStatusActionResponseCard).render(data);
    return responseCard;
  }
}

export const helloWorldCommand = new HelloWorldCommand();