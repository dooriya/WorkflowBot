import { HelloWorldAction1aHandler } from "../actions/helloworldAction1aHandler";
import { HelloWorldAction1bHandler } from "../actions/helloworldAction1bHandler";
import { HelloWorldAction1cHandler } from "../actions/helloworldAction1cHandler";
import { HelloWorldAction2Handler } from "../actions/helloworldAction2Handler";
import { HelloWorldCommandHandler } from "../commands/helloworldCommandHandler";
import { ConversationBot } from "../sdk/conversation";

// Create the command bot and register the command handlers for your app.
// You can also use the commandBot.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
export const commandBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: process.env.BOT_ID,
    appPassword: process.env.BOT_PASSWORD,
  },
  command: {
    enabled: true,
    commands: [new HelloWorldCommandHandler()],
  },
  cardAction: {
    enabled: true,
    actions: [
      new HelloWorldAction1aHandler(),
      new HelloWorldAction1bHandler(),
      new HelloWorldAction1cHandler(),
      new HelloWorldAction2Handler()
    ],
  }
});
