import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import assignedToCard from "../adaptiveCards/assignedTo.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { TeamsFxBotActionHandler, TeamsFxWorkflowActionType } from "../sdk/interface";

export class ReviewIncidentRefreshAction implements TeamsFxBotActionHandler {
    verb: string = "reviewRefresh";
    type: TeamsFxWorkflowActionType = "refresh";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        return AdaptiveCards.declare(assignedToCard).render(actionData);
    }
}
