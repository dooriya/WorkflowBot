import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { CardFactory, InvokeResponse, MessageFactory, StatusCodes, TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import { AssignToMember, CreateIncidentData, IncidentDetails } from "./cardModels";
import createIncidentCard from "./adaptiveCards/createIncident.json";
import reviewIncidentCard from "./adaptiveCards/reviewIncident.json";
import assignedToCard from "./adaptiveCards/assignedTo.json";
import approvedCard from "./adaptiveCards/approvedIncident.json";
import rejectedCard from "./adaptiveCards/rejectedIncident.json";
import { ResponseHelper } from "./responseHelper";


export class IncidentManagementWorkflow {
    async processInitialRefresh(context: TurnContext): Promise<InvokeResponse<any>> {
        // prepare card data
        const assignees: AssignToMember[] = await this.getAssignees(context);
        var createdUser = await TeamsInfo.getMember(context, context.activity.from.id);
        const createIncidentData: CreateIncidentData = {
            createdByName: context.activity.from.name,
            createdByUserId: createdUser.id,
            assignees: assignees
        };

        // generate response card
        const createIncidentCardJson = AdaptiveCards.declare(createIncidentCard).render(createIncidentData);
        return ResponseHelper.createInvokeResponse(createIncidentCardJson);
    }

    async processCreateIncident(context: TurnContext): Promise<InvokeResponse<any>> {
        const action = context.activity.value.action;
        const assignedToUser = (await TeamsInfo.getMember(context, action.data.assignedToUserId));
        action.data.assignedToName = assignedToUser.name;
        const incidentDetails: IncidentDetails = {
            incidentId: Math.random().toString(),
            incidentTitle: action.data.incidentTitle,
            createdByUserId: action.data.createdByUserId,
            createdByName: action.data.createdByName,
            assignedToUserId: action.data.assignedToUserId,
            assignedToName: action.data.assignedToName
        };
        const reviewCardJson = AdaptiveCards.declare(reviewIncidentCard).render(incidentDetails);

        // Update the card for assignee
        const replyActivity = MessageFactory.attachment(CardFactory.adaptiveCard(reviewCardJson));
        replyActivity.id = context.activity.replyToId;;
        await context.updateActivity(replyActivity);

        // Update the card for creator
        return ResponseHelper.createInvokeResponse(reviewCardJson);
    }

    async processReviewRefresh(context: TurnContext): Promise<InvokeResponse<any>> {
        const action = context.activity.value.action;
        const assignedToCardJson = AdaptiveCards.declare(assignedToCard).render(action.data);
        return ResponseHelper.createInvokeResponse(assignedToCardJson);
    }

    async processApproved(context: TurnContext): Promise<InvokeResponse<any>> {
        const action = context.activity.value.action;
        const approvedCardJson = AdaptiveCards.declare(approvedCard).render(action.data);

        // Update the card for creator
        const approvedActivity = MessageFactory.attachment(CardFactory.adaptiveCard(approvedCardJson));
        approvedActivity.id = context.activity.replyToId;;
        await context.updateActivity(approvedActivity);

        // // Update the card for assignee (resolver)
        return ResponseHelper.createInvokeResponse(approvedCardJson);
    }

    async processRejected(context: TurnContext): Promise<InvokeResponse<any>> {
        const action = context.activity.value.action;
        const rejectedCardJson = AdaptiveCards.declare(rejectedCard).render(action.data);

        // Update the card for creator
        const rejectedActivity = MessageFactory.attachment(CardFactory.adaptiveCard(rejectedCardJson));
        rejectedActivity.id = context.activity.replyToId;;
        await context.updateActivity(rejectedActivity);

        // // Update the card for assignee (resolver)
        return ResponseHelper.createInvokeResponse(rejectedCardJson);
    }

    private async getAssignees(context: TurnContext): Promise<AssignToMember[]> {
        const allMembers: TeamsChannelAccount[] = [];
        let continuationToken: string | undefined;
        do {
            const pagedMembers = await TeamsInfo.getPagedMembers(context, undefined, continuationToken);
            continuationToken = pagedMembers.continuationToken;
            allMembers.push(...pagedMembers.members);
        } while (continuationToken !== undefined);

        const assignees: AssignToMember[] = [];
        for (const member of allMembers) {
            if (member.aadObjectId !== context.activity.from.aadObjectId) {
                const memberInfo: AssignToMember = { value: member.id, title: member.name };
                assignees.push(memberInfo);
            }
        }

        return assignees;
    }
}
