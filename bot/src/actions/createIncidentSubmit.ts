import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TeamsInfo, TurnContext } from "botbuilder";
import { IncidentDetails } from "../cardModels";
import reviewIncidentCard from "../adaptiveCards/reviewIncident.json";
import { TeamsFxBotActionHandler, TeamsFxWorkflowActionType } from "../sdk/interface";

export class CreateIncidentSubmitAction implements TeamsFxBotActionHandler {
    verb: string = "createIncident";
    type: TeamsFxWorkflowActionType = "submit";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        const assignedToUser = await TeamsInfo.getMember(context, actionData.assignedToUserId);
        const incidentDetails: IncidentDetails = {
            incidentId: Math.random().toString(),
            incidentTitle: actionData.incidentTitle,
            createdByUserId: actionData.createdByUserId,
            createdByName: actionData.createdByName,
            assignedToUserId: actionData.assignedToUserId,
            assignedToName: assignedToUser.name
        };

        return AdaptiveCards.declare(reviewIncidentCard).render(incidentDetails);
    }
}