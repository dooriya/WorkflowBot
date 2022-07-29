import { InvokeResponse, StatusCodes } from "botbuilder";

export class ResponseHelper {
    public static createInvokeResponse(card: any): InvokeResponse<any> {
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