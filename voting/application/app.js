/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

// Load connection profile
const ccpPath = path.resolve('../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json') // <-- replace with your connection profile path
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))


// Connect to Fabric Network
async function connectToNetwork(userId) {
    const walletPath = path.join(process.cwd(), 'wallet') // <-- replace with your wallet path
    const wallet = await Wallets.newFileSystemWallet(walletPath)

    const identity = await wallet.get(userId)
    if (!identity) {
        throw new Error(`An identity for the user ${userId} does not exist in the wallet`)
    }

    const gateway = new Gateway()
    await gateway.connect(ccp, { wallet, identity: userId, discovery: { enabled: true, asLocalhost: true } })

    const network = await gateway.getNetwork('voting') // <-- replace 'mychannel' with your channel
    const contract = network.getContract('voting') // <-- replace 'votingcontract' with your chaincode name

    return { gateway, contract }
}

export default connectToNetwork