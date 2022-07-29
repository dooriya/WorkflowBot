import { InvokeResponse, TeamsActivityHandler, TurnContext } from "botbuilder";
import { IncidentManagementWorkflow } from "./incidentManagementWorkflow";
import { ResponseHelper } from "./responseHelper";

export class BotActivityHandler extends TeamsActivityHandler {
    protected async onInvokeActivity(context: TurnContext): Promise<InvokeResponse<any>> {
        const action = context.activity.value.action;
        const verb = action.verb;
        const workflow = new IncidentManagementWorkflow();

        switch (verb) {
            case "initialRefresh":
                return await workflow.processInitialRefresh(context);
            case "reviewRefresh":
                return await workflow.processReviewRefresh(context);
            case "createIncident":
                return await workflow.processCreateIncident(context);  
            case "approved":
                return await workflow.processApproved(context);
            case "rejected":
                return await workflow.processRejected(context);
        }

        return ResponseHelper.createInvokeResponse(undefined);
    }
}