import algosdk from "algosdk";

export interface SimulateResponse {
    methodResults: algosdk.ABIResult[];
    simulateResponse: algosdk.modelsv2.SimulateResponse;
}

export interface TealSource {
    sourceMap: algosdk.SourceMap;
    programHash: string;
    source: string;
}

export interface MIMCPayload {
    mimcHash: Uint8Array;
    previousRValue: Uint8Array;
    computeStartIdx: number;
    computeEndIdx: number;
    constants: Uint8Array;
    mimcHashPreimage: Uint8Array;
}
