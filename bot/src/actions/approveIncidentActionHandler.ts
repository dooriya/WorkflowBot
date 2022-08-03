import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import approvedCard from "../adaptiveCards/incidentApproved.json";
import { TeamsFxBotActionHandler, TeamsFxWorkflowActionType } from "../sdk/interface";

export class ApproveIncidentActionHandler implements TeamsFxBotActionHandler {
    verb: string = "approved";
    type: TeamsFxWorkflowActionType = "submit";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        return AdaptiveCards.declare(approvedCard).render(actionData);
    }
}