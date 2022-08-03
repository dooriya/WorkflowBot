import { incidentReportingCommand } from "../incidentReportingWorkflow";
import { ConversationBot } from "../sdk/conversation";

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
  notification: {
    enabled: true,
  },
  command: {
    enabled: true,
    commands: [ incidentReportingCommand ],
  },
  cardAction: {
    enabled: true,
    handlers: incidentReportingCommand.actionHandlerRegistry.registry
  }
});

// You can also register handler(s) after initialization, for example:
// teamsBot.command.registerCommand(incidentReportingWorkflow);
// teamsBot.cardAction
//   .registerHandler("createIncident", incidentReportingWorkflow.processCreateIncident)
//   .registerHandler("<verb>", incidentReportingWorkflow.processApproved);
  