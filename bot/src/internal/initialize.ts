import { helloWorldCommand } from "../helloWorldCommandHandler";
import { ConversationBot } from "../sdk/conversation";
import { CardActionHandler } from "../sdk/actionHandler"

// Create the command bot and register the command handlers for your app.
// You can also use the commandBot.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
export const teamsBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: process.env.BOT_ID,
    appPassword: process.env.BOT_PASSWORD,
  },
  command: {
    enabled: true,
    commands: [ helloWorldCommand ],
  },
  cardAction: {
    enabled: true,
    handlers:  helloWorldCommand.actionHandlers 
    // or use `handlers: [ new CardActionHandler("doAction", helloWorldCommand.handleAction) ]`
    
  }
});

// You can also register handler(s) after initialization, for example:
// teamsBot.command.registerCommand(helloWorldCommand);
// teamsBot.cardAction
//   .registerHandler("doAction", helloWorldCommand.handleAction)
//   .registerHandler("doAction2", helloWorldCommand.handleAction2)
//   .registerHandler("doAction3", helloWorldCommand.handleAction3);

  