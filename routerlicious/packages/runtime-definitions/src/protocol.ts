import { IUser } from "./users";

export enum MessageType {
    // Empty operation message. Used to send an updated reference sequence number.
    NoOp = "noop",

    // System message sent to indicate a new client has joined the collaboration
    ClientJoin = "join",

    // System message sent to indicate a client has left the collaboration
    ClientLeave = "leave",

    // Proposes a new consensus value
    Propose = "propose",

    // Message used to reject a pending proposal
    Reject = "reject",

    // TODO the attach and operation names are partially historican. We may want to rename to align with changes
    // coming from code loading.

    // Creates a new channel and attaches chaincode to it
    Attach = "attach",

    // Channel operation.
    Operation = "objOp",

    // Forced snapshot
    Save = "save",
}

/**
 * An envelope wraps the contents with the intended target
 */
export interface IEnvelope {
    // The target for the envelope
    address: string;

    // The contents of the envelope
    contents: any;
}

/**
 * Branch origin information
 */
export interface IBranchOrigin {
    // Origin branch of the message
    id: string;

    // Sequence number for the message in branch id
    sequenceNumber: number;

    // Min sequence number for the message in branch id
    minimumSequenceNumber: number;
}

export interface INack {
    // The operation that was just nacked
    operation: IDocumentMessage;

    // The sequence number the client needs to catch up to
    sequenceNumber: number;
}

/**
 * Document specific message
 */
export interface IDocumentMessage {
    // The document's client sequence number
    clientSequenceNumber: number;

    // The reference sequence number the message was sent relative to
    referenceSequenceNumber: number;

    // The type of document message being sent
    type: string;

    // The contents of the message
    contents: any;
}

/**
 * Sequenced message for a distributed document
 */
export interface ISequencedDocumentMessage {
    // The user that submitted the delta
    user: IUser;

    // The client ID that submitted the delta
    clientId: string;

    // The sequenced identifier
    sequenceNumber: number;

    // The minimum sequence number for all connected clients
    minimumSequenceNumber: number;

    // The document's client sequence number
    clientSequenceNumber: number;

    // The reference sequence number the message was sent relative to
    referenceSequenceNumber: number;

    // The type of operation
    type: string;

    // The contents of the message
    contents: any;

    // Origin branch information for the message. Can be marked undefined if the current
    // message is also the origin.
    origin: IBranchOrigin;
}

/**
 * Message related to a distributed data type
 */
export interface IObjectMessage {
    // The object's client sequence number
    clientSequenceNumber: number;

    // The reference object sequence number the message was sent relative to
    referenceSequenceNumber: number;

    // The type of message for the object
    type: string;

    // The operation to perform on the object
    contents: any;
}

/**
 * Sequenced message for a distributed data type
 */
export interface ISequencedObjectMessage {
    // User who sent the message.
    user: IUser;

    // The sequenced identifier
    sequenceNumber: number;

    // The minimum sequence number for all connected clients
    minimumSequenceNumber: number;

    // The document's client sequence number
    clientSequenceNumber: number;

    // The reference sequence number the message was sent relative to
    referenceSequenceNumber: number;

    // The client ID that submitted the delta
    clientId: string;

    // The type of operation
    type: string;

    // The contents of the message
    contents: any;

    // Origin branch information for the message. Can be marked undefined if the current
    // message is also the origin.
    origin: IBranchOrigin;
}

/**
 * An envelope wraps the contents with the intended target
 */
export interface IEnvelope {
    // The target for the envelope
    address: string;

    // The contents of the envelope
    contents: any;
}

export interface ISave {
    type: string;

    message: string;
}
