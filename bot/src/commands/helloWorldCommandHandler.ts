import { Activity, CardFactory, CloudAdapterBase, MessageFactory, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "../sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import helloWorldCommandResponseCard from "../adaptiveCards/helloworldCommandResponse.json";
import refreshResponseCard from "../adaptiveCards/refreshResponse.json";
import doActionResponseCard from "../adaptiveCards/actionResponse.json";
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
    { verb: "refresh", handleActionInvoked: this.handleRefreshAction },
    { verb: "submit", handleActionInvoked: this.handleSubmitAction }
  ];

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    // Render your adaptive card for reply message
    const cardData: CardData = {
      title: "Your Hello World Bot is Running",
      body: "Congratulations! Your hello world bot is running.",
      userMRI: context.activity.from.id,
    };

    return MessageBuilder.attachAdaptiveCard<CardData>(helloWorldCommandResponseCard, cardData);
  }

  async handleRefreshAction(context: TurnContext, cardData: any): Promise<any> {
    const userId = context.activity.from.id;
    switch (userId) {
      case "userA's id":  // refresh for userA specific view
        // return cardB;
      case "userB's id":  // refresh for userB specific view
        // return cardA;
      default:            // refresh for all refresh users defined in userIds 
          const responseCard = AdaptiveCards.declare(refreshResponseCard).render(cardData);
          return responseCard;
    } 
  }

  async handleSubmitAction(context: TurnContext, cardData: any): Promise<any> {
    const responseCard = AdaptiveCards.declare(doActionResponseCard).render(cardData);

    // optionally, you can use message edit to update the message for all users
    const rejectedActivity = MessageFactory.attachment(CardFactory.adaptiveCard(responseCard));
    rejectedActivity.id = context.activity.replyToId;;
    await context.updateActivity(rejectedActivity);

    return responseCard;
  }
}

export const helloWorldCommand = new HelloWorldCommand();