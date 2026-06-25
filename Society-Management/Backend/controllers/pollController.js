import { pollService } from '../services/pollService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createPoll = asyncHandler(async (req, res) => {
  const poll = await pollService.createPoll(req.body, req.user.id);

  return ApiResponse.success(res, 'Poll created successfully', poll, 201);
});

export const votePoll = asyncHandler(async (req, res) => {
  const { optionIds } = req.body; 

  const poll = await pollService.submitVote(req.params.id, optionIds, req.user.id);

  const io = req.app.get('io');
  if (io) {
    io.emit('poll_updated', { pollId: poll._id });
  }

  const formattedPoll = await pollService.getPollDetails(poll._id, req.user.id, req.user.role);

  return ApiResponse.success(res, 'Vote recorded successfully', formattedPoll);
});

export const getDetails = asyncHandler(async (req, res) => {
  const poll = await pollService.getPollDetails(req.params.id, req.user.id, req.user.role);

  return ApiResponse.success(res, 'Poll details retrieved successfully', poll);
});

export const listPolls = asyncHandler(async (req, res) => {
  const polls = await pollService.listPolls(req.user.id, req.query);

  return ApiResponse.success(res, 'Polls list retrieved successfully', polls);
});

export const deletePoll = asyncHandler(async (req, res) => {
  await pollService.deletePoll(req.params.id, req.user.id);

  return ApiResponse.success(res, 'Poll deleted successfully');
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await pollService.getPollAnalytics(req.params.id);

  return ApiResponse.success(res, 'Poll analytics retrieved successfully', analytics);
});
