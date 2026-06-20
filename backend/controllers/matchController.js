const MatchDiscussion = require('../models/MatchDiscussion');
const { getLiveMatches, getMatchById } = require('../services/cricketApiService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get live matches
// @route   GET /api/matches/live
const getLive = async (req, res) => {
    try {
        const matches = await getLiveMatches();
        return sendSuccess(res, 200, 'Live matches fetched', { matches });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Get single match details
// @route   GET /api/matches/:id
const getMatch = async (req, res) => {
    try {
        const match = await getMatchById(req.params.id);
        return sendSuccess(res, 200, 'Match fetched', { match });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Get match discussion messages
// @route   GET /api/matches/:id/discussion
const getDiscussion = async (req, res) => {
    try {
        const messages = await MatchDiscussion.find({ matchId: req.params.id })
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('userId', 'name avatar');

        return sendSuccess(res, 200, 'Discussion fetched', { messages });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Post to match discussion
// @route   POST /api/matches/:id/discussion
const postDiscussion = async (req, res) => {
    try {
        const msg = await MatchDiscussion.create({
            matchId: req.params.id,
            userId: req.user._id,
            message: req.body.message,
        });

        const populated = await MatchDiscussion.findById(msg._id).populate('userId', 'name avatar');
        return sendSuccess(res, 201, 'Message sent', { message: populated });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

module.exports = { getLive, getMatch, getDiscussion, postDiscussion };