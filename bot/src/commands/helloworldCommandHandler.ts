import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
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

    const helloWorldCardJson = AdaptiveCards.declare(helloWorldCard).render({
      title: "Resource Provision",
      body: "Click the 'Run' button to start provision resources",
    });

    return MessageFactory.attachment(CardFactory.adaptiveCard(helloWorldCardJson));
  }
}
