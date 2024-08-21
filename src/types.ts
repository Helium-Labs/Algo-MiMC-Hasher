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