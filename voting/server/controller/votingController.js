import connectToNetwork from "../../application/app"


// This function registers the voter
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

const addCandidate = async (req, res) => {
    const { electionName, candidateId, candidateName, adminId } = req.body

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