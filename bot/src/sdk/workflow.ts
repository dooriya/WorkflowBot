import { CardFactory, InvokeResponse, MessageFactory, StatusCodes, TeamsActivityHandler, TurnContext } from "botbuilder";
import { IAdaptiveCard } from "adaptivecards";

export interface TeamsFxWorkflowAction {
    verb: string;
    type: TeamsFxWorkflowActionType;

    run(actionData: any, context: TurnContext): Promise<IAdaptiveCard>;
}

export type TeamsFxWorkflowActionType = "refresh" | "submit";

export class BotActivityHandler extends TeamsActivityHandler {
    private readonly actions: TeamsFxWorkflowAction[];

    constructor(actions: TeamsFxWorkflowAction[]) {
        super();
        this.actions = actions;
    }

    protected async onInvokeActivity(context: TurnContext): Promise<InvokeResponse<any>> {
        const actionData = context.activity.value.action.data;
        const actionVerb = context.activity.value.action.verb;
        for (const action of this.actions) {
            if (actionVerb === action.verb) {
                const card = await action.run(actionData, context);

                if (action.type === "submit") {
                    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(card));
                    activity.id = context.activity.replyToId;;
                    await context.updateActivity(activity);
                } else {
                    return this.createInvokeResponse(card);
                }
            }
        }

        return this.createInvokeResponse(undefined);
    }

    private createInvokeResponse(card: any): InvokeResponse<any> {
        const cardRes = {
            statusCode: StatusCodes.OK,
            type: 'application/vnd.microsoft.card.adaptive',
            value: card
        };

        const res = {
            status: StatusCodes.OK,
            body: cardRes
        };

        return res;
    }
}