import connectToNetwork from "../../application/app"


//@desc This function registers the voter
// @route POST /api/voting/registerVoter
// @access Private
// @param {String} userId the ID of the voter
// @param {String} secretPass the secret pass of the voter
// @param {String} adminId the ID of the admin
const registerVoter = async (req, res) => {
    const { userId, secretPass, adminId } = req.body

    try {
        const { gateway, contract } = await connectToNetwork()
        const result = await contract.submitTransaction('registerVoter', userId, secretPass, adminId)
        await gateway.disconnect()
        res.status(200).json({
            message: `Voter ${userId} registered successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to register voter: ${error}`)
        res.status(500).json({
            error: `Failed to register voter: ${error.message}`
        })
    }
}

//@desc This function authenticates the voter
// @route POST /api/voting/authenticateVoter
// @access Public
// @param {String} userId the ID of the voter
// @param {String} secretPass the secret pass of the voter
const authenticateVoter = async (req, res) => {
    const { userId, secretPass } = req.body

    try {
        const { gateway, contract } = await connectToNetwork()
        const result = await contract.evaluateTransaction('authenticateVoter', userId, secretPass)
        await gateway.disconnect()
        res.status(200).json({
            message: `Voter ${userId} authenticated successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to authenticate voter: ${error}`)
        res.status(500).json({
            error: `Failed to authenticate voter: ${error.message}`
        })
    }
}

//@desc This function creates the a new election
// @route POST /api/voting/createElection
// @access Private
// @param {String} electionName the name of the election
// @param {String} adminId the ID of the admin
const createElection = async (req, res) => {
    const { electionName, adminId } = req.body

    try {
        const { gateway, contract } = await connectToNetwork()
        const result = await contract.submitTransaction('createElection', electionName, adminId)
        await gateway.disconnect()
        res.status(200).json({
            message: `Election ${electionName} created successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to create election: ${error}`)
        res.status(500).json({
            error: `Failed to create election: ${error.message}`
        }) 
    }
}

//@desc This function adds a new candidate to an election
// @route POST /api/voting/addCandidate
// @access Private
// @param {String} electionId the ID of the election
// @param {String} candidateName the name of the candidate
// @param {String} adminId the ID of the admin
const addCandidate = async (req, res) => {
    const { electionId, candidateName, adminId } = req.body

    try {
        const { gateway, contract } = await connectToNetwork()
        const result = await contract.submitTransaction('addCandidate', electionId, candidateName, adminId)
        await gateway.disconnect()
        res.status(200).json({
            message: `Candidate ${candidateName} added successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to add candidate: ${error}`)
        res.status(500).json({
            error: `Failed to add candidate: ${error.message}`
        })
    }
}

//@desc This function starts an election
// @route POST /api/voting/startElection
// @access Private
// @param {String} electionId the ID of the election
// @param {String} adminId the ID of the admin
const endElection = async (req, res) => {
    const { electionId, adminId } = req.body

    try {
        const { gateway, contract } = await connectToNetwork()
        const result = await contract.submitTransaction('endElection', electionId, adminId)
        await gateway.disconnect()
        res.status(200).json({
            message: `Election ${electionId} ended successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to end election: ${error}`)
        res.status(500).json({
            error: `Failed to end election: ${error.message}`
        })
    }
}

//@desc This function allows a user to vote for a candidate
// @route POST /api/voting/vote
// @access Public
// @param {String} electionId the ID of the election
// @param {String} candidateId the ID of the candidate
// @param {String} voterId the ID of the voter
const vote = async (req, res) => {
    const { candidateId, electionId, voterId } = req.body

    try {
       const { gateway, contract } = await connectToNetwork()
        const result = await contract.submitTransaction('vote', candidateId, electionId, voterId) 
        await gateway.disconnect()
        res.status(200).json({
            message: `Vote for candidate ${candidateId} in election ${electionId} by voter ${voterId} submitted successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to submit vote: ${error}`)
        res.status(500).json({
            error: `Failed to submit vote: ${error.message}`
        })
    }
}

//@desc This function gets the results of an election
// @route POST /api/voting/getElectionResults/:electionId
// @access Public
// @param {String} electionId the ID of the election
const getElectionResults = async (req, res) => {
    const { electionId } = req.params

    try {
        const { gateway, contract } = await connectToNetwork()
        const result = await contract.evaluateTransaction('getElectionResults', electionId)
        await gateway.disconnect()
        res.status(200).json({
            message: `Election results for ${electionId} retrieved successfully`, 
            result: JSON.parse(result.toString()) 
        })
    } catch (error) {
        console.error(`Failed to get election results: ${error}`)
        res.status(500).json({
            error: `Failed to get election results: ${error.message}`
        })
    }
}

export { 
    registerVoter,
    authenticateVoter,
    createElection,
    addCandidate,
    endElection,
    vote,
    getElectionResults
}