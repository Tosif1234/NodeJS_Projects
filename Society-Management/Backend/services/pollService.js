import Poll from '../models/Poll.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';

export const pollService = {
  createPoll: async (pollData, adminUserId) => {
    const { question, options, expiresAt, pollType = 'Single', isAnonymous = false } = pollData;

    const mappedOptions = options.map((opt) => ({
      optionText: opt,
      votes: [],
    }));

    const poll = await Poll.create({
      question,
      pollType,
      isAnonymous,
      options: mappedOptions,
      expiresAt: new Date(expiresAt),
      createdBy: adminUserId,
    });

    const residents = await User.find({ role: 'Resident', status: 'Approved' }).select('_id');
    for (const resi of residents) {
      await Notification.create({
        recipient: resi._id,
        title: 'New Society Poll Created',
        message: `A new poll: "${question}" is open for voting.`,
        type: 'Poll',
      });
    }

    return poll;
  },

  submitVote: async (pollId, optionIds, residentUserId) => {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new AppError('Poll not found', 404);
    }

    if (poll.expiresAt < new Date()) {
      throw new AppError('This poll has expired and is closed for voting', 400);
    }

    poll.options.forEach((option) => {
      option.votes = option.votes.filter(
        (vote) => vote.user.toString() !== residentUserId.toString()
      );
    });

    if (poll.pollType === 'Single' && optionIds.length > 1) {
      throw new AppError('This is a single choice poll. You can only select one option.', 400);
    }

    let voteAdded = false;
    poll.options.forEach((option) => {
      if (optionIds.includes(option._id.toString())) {
        option.votes.push({
          user: residentUserId,
          votedAt: new Date(),
        });
        voteAdded = true;
      }
    });

    if (!voteAdded) {
      throw new AppError('No valid options selected for voting', 400);
    }

    await poll.save();
    return poll;
  },

  getPollDetails: async (pollId, userId, userRole) => {
    const poll = await Poll.findById(pollId).populate('options.votes.user', 'name phone');
    if (!poll) {
      throw new AppError('Poll not found', 404);
    }

    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);

    const hasVoted = poll.options.some((option) =>
      option.votes.some((vote) => {
        const voterId = vote.user._id ? vote.user._id : vote.user;
        return voterId.toString() === userId.toString();
      })
    );

    const options = poll.options.map((opt) => {
      const optionObj = opt.toObject();
      optionObj.voteCount = opt.votes.length;
      optionObj.percentage = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;

      optionObj.hasVoted = opt.votes.some((v) => {
        const voterId = v.user._id ? v.user._id : v.user;
        return voterId.toString() === userId.toString();
      });
      if (poll.isAnonymous && userRole !== 'Admin') {
        delete optionObj.votes; 
      }
      return optionObj;
    });

    const pollObj = poll.toObject();
    pollObj.options = options;
    pollObj.totalVotes = totalVotes;
    pollObj.hasVoted = hasVoted;

    return pollObj;
  },

  listPolls: async (userId, query = {}) => {
    const { status } = query; 
    const filter = {};

    if (status === 'Active') {
      filter.expiresAt = { $gt: new Date() };
    } else if (status === 'Expired') {
      filter.expiresAt = { $lte: new Date() };
    }

    const polls = await Poll.find(filter).sort({ createdAt: -1 });

    const formattedPolls = polls.map((p) => {
      const hasVoted = p.options.some((opt) =>
        opt.votes.some((v) => v.user.toString() === userId.toString())
      );
      const totalVotes = p.options.reduce((acc, opt) => acc + opt.votes.length, 0);

      const obj = p.toObject();
      obj.hasVoted = hasVoted;
      obj.totalVotes = totalVotes;

      obj.options = p.options.map((o) => {
        const optObj = o.toObject();
        optObj.voteCount = o.votes.length;
        optObj.hasVoted = o.votes.some((v) => v.user.toString() === userId.toString());
        delete optObj.votes;
        return optObj;
      });

      return obj;
    });

    return formattedPolls;
  },

  deletePoll: async (pollId, adminUserId) => {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new AppError('Poll not found', 404);
    }
    await poll.softDelete(adminUserId);
    return { success: true };
  },

  getPollAnalytics: async (pollId) => {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new AppError('Poll not found', 404);
    }

    const totalResidents = await User.countDocuments({
      role: 'Resident',
      status: 'Approved',
      isDeleted: { $ne: true },
    });

    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);

    const optionStats = poll.options.map((opt) => ({
      optionText: opt.optionText,
      voteCount: opt.votes.length,
      percentage: totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0,
    }));

    return {
      question: poll.question,
      pollType: poll.pollType,
      expiresAt: poll.expiresAt,
      isExpired: poll.expiresAt < new Date(),
      totalResidents,
      totalVotes,
      participationRatePercent: totalResidents > 0 ? (totalVotes / totalResidents) * 100 : 0,
      optionStats,
    };
  },
};
