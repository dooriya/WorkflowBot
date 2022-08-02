import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TurnContext } from "botbuilder";
import rejectedCard from "../adaptiveCards/rejectedIncident.json";
import { TeamsFxBotActionHandler, TeamsFxWorkflowActionType } from "../sdk/interface";

export class RejectIncidentSubmitAction implements TeamsFxBotActionHandler {
    verb: string = "rejected";
    type: TeamsFxWorkflowActionType = "submit";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        return AdaptiveCards.declare(rejectedCard).render(actionData);
    }
}