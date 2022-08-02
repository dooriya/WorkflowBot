import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IAdaptiveCard } from "adaptivecards";
import { TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import { AssignToMember, CreateIncidentData } from "../cardModels";
import createIncidentCard from "../adaptiveCards/createIncident.json";
import { TeamsFxBotActionHandler, TeamsFxWorkflowActionType } from "../sdk/interface";

export class InitialCreateRefreshAction implements TeamsFxBotActionHandler {
    verb: string = "initialRefresh";
    type: TeamsFxWorkflowActionType = "refresh";

    async handleActionReceived(actionData: any, context: TurnContext): Promise<IAdaptiveCard> {
        const allMembers = await this.getAllMembers(context);
        const assignees: AssignToMember[] = [];
        for (const member of allMembers) {
            const memberInfo: AssignToMember = { value: member.id, title: member.name };
            assignees.push(memberInfo);
        }

        // prepare card data
        var createdUser = await TeamsInfo.getMember(context, context.activity.from.id);
        const createIncidentData: CreateIncidentData = {
            createdByName: context.activity.from.name,
            createdByUserId: createdUser.id,
            assignees: assignees
        };

        // generate response card
        return AdaptiveCards.declare(createIncidentCard).render(createIncidentData);
    }

    private async getAllMembers(context: TurnContext): Promise<TeamsChannelAccount[]> {
        const allMembers: TeamsChannelAccount[] = [];
        let continuationToken: string | undefined;
        do {
            const pagedMembers = await TeamsInfo.getPagedMembers(context, undefined, continuationToken);
            continuationToken = pagedMembers.continuationToken;
            allMembers.push(...pagedMembers.members);
        } while (continuationToken !== undefined);

        return allMembers;
    }
}