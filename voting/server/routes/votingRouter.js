import express from 'express';
import { registerVoter, authenticateVoter, createElection, addCandidate, endElection, vote, getElectionResults } from '../controller/votingController';

const router  = express.Router()

router.post('/registerVoter', registerVoter)
router.post('/authenticateVoter', authenticateVoter)
router.post('/createElection', createElection)
router.post('/addCandidate', addCandidate)
router.post('/endElection', endElection)
router.post('/vote', vote)
router.get('/getElectionResults/:electionId', getElectionResults)


export default router

