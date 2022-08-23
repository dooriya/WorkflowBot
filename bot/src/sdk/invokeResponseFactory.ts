import { IAdaptiveCard } from "adaptivecards";
import { InvokeResponse, StatusCodes } from "botbuilder";

export class InvokeResponseFactory {
    public static textMessage(message: string) {
        if (!message) {
            throw new Error("The text message cannot be null or empty");
        }

        return {
            status: StatusCodes.OK,
            body: {
                statusCode: StatusCodes.OK,
                type: 'application/vnd.microsoft.activity.message',
                value: message
            }
        }
    }

    public static adaptiveCard(card: IAdaptiveCard) {
        if (!card) {
            throw new Error("The adaptive card content cannot be null or undefined");
        }

        return {
            status: StatusCodes.OK,
            body: {
                statusCode: StatusCodes.OK,
                type: "application/vnd.microsoft.card.adaptive",
                value: card,
            }
        };
    }

    public static errorResponse(errorCode: StatusCodes, errorMessage: string): InvokeResponse {
        if (errorCode !== StatusCodes.BAD_REQUEST && errorCode !== StatusCodes.INTERNAL_SERVER_ERROR) {
            throw new Error(`Unexpected status Code: ${errorCode}. Expected: ${StatusCodes.BAD_REQUEST} (BadRequest) or ${StatusCodes.INTERNAL_SERVER_ERROR} (InternalServerError)`);
        }

        return {
            status: StatusCodes.OK,
            body: {
                statusCode: errorCode,
                type: 'application/vnd.microsoft.error',
                value: {
                    code: errorCode.toString(),
                    message: errorMessage
                }
            }
        };
    }

    public static createInvokeResponse(statusCode: StatusCodes, responseType: string, value: unknown): InvokeResponse {
        return {
            status: StatusCodes.OK,
            body: {
                statusCode: statusCode,
                type: responseType,
                value: value
            },
        };
    }
}