/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/
'use strict';

import { Context, Contract } from 'fabric-contract-api'

class VotingContract extends Contract {

    constructor() {
        super('VotingContract')
        this.electionCount = 0
    }


    /**
     * This function authenticates a voter
     * Return a boolean indicating if the voter is authenticated or not
     * @param {Context} ctx the transaction context
     * @param {String} secretPass the secret pass of the voter
     * @returns {Boolean} true if the voter is authenticated, false otherwise
     */

    async authenticateVoter(ctx, voterId, secretPass) {
        // Check if the contract options are set to allow the registration of voters
        await this.CheckInitialized(ctx);

        const userAsBytes = await ctx.stub.getState(voterId)
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`Voter ${voterId} does not exist`)
        }

        const user = JSON.parse(userAsBytes.toString())

        return user.secretPass === secretPass
    }

    // ADMIN FUNCTIONS

    /**
     * This function registers a new voter
     * Return the voter ID
     * @param {Context} ctx the transaction context
     * @param {String} secretPass the secret pass of the voter
     * @returns {String} the voter ID
     */

    async registerVoter(ctx, voterId, secretPass, adminId) {
        // Check if the contract options are set to allow the registration of voters
        await this.CheckInitialized(ctx);

        // This modifier checks if admin is calling the function
        this._onlyAdmin(adminId)

        // Check if the user already exists
        const exist = this.userExists(ctx, voterId)
        if (exist) {
            throw new Error(`User with ID ${voterId} already exists`)
        }

        const user = {
            voterId,
            secretPass,
            elections: []
        }

        await ctx.stub.putState(voterId, Buffer.from(JSON.stringify(user)))
        return { voterId, message: 'User registered successfully' }
    }

    /**
     * This function allows the admin to create a new election(ADMIN ONLY)
     * @param {Context} ctx the transaction context
     * @param {String} electionName the name of the election
     */
    async createElection(ctx, electionName, adminId) {
        // This modifier checks if admin is calling the function
        this._onlyAdmin(adminId)

        // Create the election object
        const election = {
            electionId: ctx.stub.getTxID(),
            electionNumber: this.electionCount++,
            electionName,
            candidates: [],
            voters: [],
            isActive: false
        }

        await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)))
        return {
            electionId: election.electionId,
            electionNumber: election.electionNumber,
            electionName: election.electionName,
            message: 'Election created successfully'
        }
    }

    /**
     * This function allows the admin to add candidate for an election(ADMIN ONLY)
     * @param {Context} ctx the transaction context
     * @param {String} electionId the election ID
     * @param {String} candidateName the candidate name
     * @param {String} adminId the admin ID
     */
    async addCandidate(ctx, electionId, candidateName, adminId) {
        // This modifier checks if admin is calling the function
        this._onlyAdmin(adminId)

        const election = await this._getElection(ctx, electionId)
        const candidate = {
            id: election.candidates.length + 1,
            name: candidateName,
            votes: 0
        }

        election.candidates.push(candidate)
        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)))
        return {
            message: 'Candidate added successfully',
            candidateId: candidate.id,
            candidateName: candidate.name,
            electionId: electionId
        }

    }

    /**
     * This function allows the admin to start an election(ADMIN ONLY)
     * @param {Context} ctx the transaction context
     * @param {String} electionId the election ID
     * @param {String} adminId the admin ID
     */
    async startElection(ctx, electionId, adminId) {
        // This modifier checks if admin is calling the function
        this._onlyAdmin(adminId)

        const election = await this._getElection(ctx, electionId)
        election.isActive = true
        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)))
        return {
            message: 'Election started successfully',
            electionId: electionId
        }
    }

    /**
     * This function allows the admin to end an election(ADMIN ONLY)
     * @param {Context} ctx the transaction context
     * @param {String} electionId the election ID
     * @param {String} adminId the admin ID
     * @returns 
     */
    async endVoting(ctx, electionId, adminId) {
        // This modifier checks if admin is calling the function
        this._onlyAdmin(adminId)

        const election = await this._getElection(ctx, electionId)
        election.isActive = false
        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)))
        return {
            message: 'Voting ended successfully',
            electionId: electionId
        }
    }

    // HELPER FUNCTIONS

    /**
    * This function permits only the admin to call certain functions (MODIFIER)
    */
    _onlyAdmin(adminId) {
        if (adminId !== 'admin') {
            throw new Error('Only admin can call this function')
        }
    }

    /**
     * This function get an election details by ID
     * @param {Context} ctx the transaction context
     * @param {String} electionId the ID of the election
     */
    async _getElection(ctx, electionId) {
        const elcetionAsBytes = await ctx.stub.getState(electionId)

        if (!elcetionAsBytes || elcetionAsBytes.length === 0) {
            throw new Error(`Election with ID ${electionId} does not exist`)
        }

        return JSON.parse(elcetionAsBytes.toString())
    }

    /**
     * This function gets a user
     * @param { Context} ctx the transaction context
     * @param {String} voterId the ID of the user
     */
    async _getUser(ctx, voterId) {
        const userAsBytes = await ctx.stub.getState(voterId)
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`User with ID ${voterId} does not exist`)
        }
        return JSON.parse(userAsBytes.toString())
    }

    /**
     * 
     * @param {Contex} ctx the transaction context 
     * @param {String} voterId the ID of the user
     * @returns {Boolean} true if the user exists, false otherwise
     */
    async userExists(ctx, voterId) {
        const userJSON = await ctx.stub.getState(voterId);
        return userJSON && userJSON.length > 0;
    }

    // PUBLIC FUNCTIONS

    /**
     * This function allows a voter to vote for a candidate
     * @param {Context} ctx the transaction context
     * @param {String} candidateId the ID of the candidate
     * @param {String} electionId the ID of the election
     * @param {String} voterId the ID of the voter
     * @returns {String} the ID of the candidate voted for
     */
    async vote(ctx, candidateId, electionId, voterId) {
        const user = await this._getUser(ctx, voterId)
        const election = await this._getElection(ctx, electionId)

        if (!election.isActive) {
            throw new Error(`Election with ID ${electionId} is not active`)
        }

        if (user.elections.includes(electionId)) {
            throw new Error(`User with ID ${voterId} has already voted in election with ID ${electionId}`)
        }

        const candidate = election.candidates.find(c => c.id === candidateId)
        if (!candidate) {
            throw new Error(`Candidate with ID ${candidateId} does not exist`)
        }

        candidate.votes++
        election.voters.push(voterId)

        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)))
        await ctx.stub.putState(voterId, Buffer.from(JSON.stringify(user)))

        return {
            message: 'Vote casted successfullly',
            candidateId: candidateId,
            electionId: electionId,
        }
    }

    // Get Election Results
    async getElectionResults(ctx, electionId) {
        const election = await this._getElection(ctx, electionId);

        const votes = election.candidates.map(candidate => {
            return {
                candidateId: candidate.id,
                candidateName: candidate.name,
                votes: candidate.votes
            };
        });
        // Sort the candidates by votes in descending order
        const result = votes.sort((a, b) => b.votes - a.votes);
        // Get the top 3 candidates
        // const topCandidates = votes.slice(0, 3);

        // Return the results   
        return result
    }

}

export default VotingContract