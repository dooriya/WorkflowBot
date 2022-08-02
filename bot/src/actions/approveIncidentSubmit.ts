import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import approvedCard from "../adaptiveCards/approvedIncident.json";
import { TeamsFxBotActionHandler, TeamsFxWorkflowActionType } from "../sdk/interface";

export class ApproveIncidentSubmitAction implements TeamsFxBotActionHandler {
    verb: string = "approved";
    type: TeamsFxWorkflowActionType = "submit";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        return AdaptiveCards.declare(approvedCard).render(actionData);
    }
}