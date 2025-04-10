/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import grpc from '@grpc/grpc-js'
import { connect, hash, signers } from '@hyperledger/fabric-gateway'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { TextDecoder } from 'node:util'

import { Gateway, Wallets } from 'fabric-network'

const channelName = envOrDefault('CHANNEL_NAME', 'voting')
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'voting')
const mspId = envOrDefault('MSP_ID', 'Org1MSP')


