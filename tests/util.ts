import algosdk from 'algosdk';
import { getTealSourceMapForTxn } from '../src/util';
import fs from 'fs';
import path from 'path';
import { base64ToBase64url } from '../src/util';
import { SimulateResponse } from '../src/types';
import { AssertDefined } from '../src/util';

interface GroupSource {
    'sourcemap-location': string;
    hash: string;
}
export function generateSourceMapForSimulationResponse(simres: algosdk.modelsv2.SimulateResponse) {

    const debugFolder = path.resolve(__dirname, 'debug');
    // Create the debug folder if it doesn't exist
    if (!fs.existsSync(debugFolder)) {
        fs.mkdirSync(debugFolder);
    }

    const txGroup = simres.txnGroups[0]
    AssertDefined(txGroup, "txGroup must be defined")
    const groupSources: GroupSource[] = []
    for (const txnResult of txGroup.txnResults) {
        const tealMap = getTealSourceMapForTxn(txnResult.txnResult.txn)
        if (tealMap === undefined) {
            continue
        }
        const sourceMapPath = path.join(debugFolder, `${base64ToBase64url(tealMap.programHash)}.teal.tok.map`);
        const sourcePath = path.join(debugFolder, `${base64ToBase64url(tealMap.programHash)}.teal`);

        // Write sourceMap to sourceMap.json
        fs.writeFileSync(sourceMapPath, JSON.stringify(tealMap.sourceMap, null, 2));
        fs.writeFileSync(sourcePath, tealMap.source);

        groupSources.push({
            "sourcemap-location": sourceMapPath,
            hash: tealMap.programHash
        })
    }

    const sourcemapObj = {
        "txn-group-sources": groupSources
    }
    const sourceMapDirectoryPath = path.join(debugFolder, 'sources.avm.json');
    fs.writeFileSync(sourceMapDirectoryPath, JSON.stringify(sourcemapObj, null, 2));
}

export function assertSimulateResponseErrorFree(simulate: SimulateResponse) {
    if (!simulate.simulateResponse?.txnGroups[0]?.failedAt) {
        return
    }
    const simulateResponse = simulate.simulateResponse
    // Contract account simulate response
    const execTrace = simulateResponse.get_obj_for_encoding()

    generateSourceMapForSimulationResponse(simulateResponse)

    // Define the folder and file paths
    const debugFolder = path.resolve(__dirname, 'debug');
    const execTracePath = path.join(debugFolder, 'simulate-response.trace.avm.json');

    // Create the debug folder if it doesn't exist
    if (!fs.existsSync(debugFolder)) {
        fs.mkdirSync(debugFolder);
    }

    // Write execTrace to execTrace.json
    fs.writeFileSync(execTracePath, JSON.stringify(execTrace, null, 2));

    // Throw the error. Generally this should only be invoked in response to an error for debugging.
    AssertDefined(simulate.simulateResponse?.txnGroups[0]?.failureMessage, 'Failure message must be present')
    throw new Error("Simulate Debugging: " + simulate.simulateResponse?.txnGroups[0]?.failureMessage)
}
