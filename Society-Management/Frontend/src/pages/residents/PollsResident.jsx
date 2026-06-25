import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPollsList, submitPollVote } from '../../store/slices/pollSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { Vote, Calendar, LayoutGrid, List as ListIcon, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import { io } from 'socket.io-client';

export const PollsResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { polls, status, error } = useSelector((state) => state.poll);
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchPollsList({}));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('poll_updated', () => {
      dispatch(fetchPollsList({}));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const handleCastVote = async (id, optionId) => {
    const result = await dispatch(submitPollVote({ id, optionId }));
    if (submitPollVote.fulfilled.match(result)) {
      showToast('Thank you! Your vote has been recorded.');
      dispatch(fetchPollsList({}));
    } else {
      showToast(result.payload || 'Failed to submit vote', 'error');
    }
  };

  const hasVoted = (pollObj) => {
    return pollObj.hasVoted;
  };

  const getVoteDistribution = (pollObj) => {
    const total = pollObj.totalVotes || 0;
    return pollObj.options?.map((opt) => {
      const count = opt.voteCount || 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { text: opt.optionText, count, pct, id: opt._id, hasVoted: opt.hasVoted };
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50 dark:bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-48 bg-primary-50 dark:bg-slate-800" />
          <Skeleton variant="card" className="h-48 bg-primary-50 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  const filteredPolls = (polls || []).filter(poll => {
    const isExpired = new Date(poll.expiresAt) < new Date();
    const pollStatus = isExpired ? 'Closed' : 'Active';
    return statusFilter === 'All' || pollStatus === statusFilter;
  });

  const columns = [
    {
      header: 'Poll Question',
      key: 'question',
      render: (val) => <span className="font-semibold text-slate-900 dark:text-slate-100">{val}</span>,
    },
    {
      header: 'Expires At',
      key: 'expiresAt',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Calendar size={12} /> {new Date(val).toLocaleDateString()}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val, row) => {
        const isExpired = new Date(row.expiresAt) < new Date();
        return <Badge variant={isExpired ? 'gray' : 'success'}>{isExpired ? 'Closed' : 'Active'}</Badge>;
      },
    },
    {
      header: 'My Vote',
      key: 'voted',
      render: (val, row) => {
        const voted = hasVoted(row);
        return <Badge variant={voted ? 'accent' : 'warning'}>{voted ? 'Voted' : 'Pending'}</Badge>;
      },
    },
    {
      header: 'Action',
      key: '_id',
      render: (val, row) => {
        const voted = hasVoted(row);
        const isExpired = new Date(row.expiresAt) < new Date();
        if (voted || isExpired) return <span className="text-xs text-slate-500 dark:text-slate-400 italic">No actions</span>;
        return <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={() => setViewMode('grid')}>Vote in Grid</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white tracking-tight flex items-center gap-2">
            <Vote className="text-primary-500" size={24} />
            Polls & Voting
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Participate in community surveys and view aggregation rates.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-2">
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 appearance-none text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {viewMode === 'list' ? (
        <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
          <Table
            columns={columns}
            data={filteredPolls}
            emptyMessage="No polls match your current filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.length > 0 ? (
            filteredPolls.map((poll) => {
              const voted = hasVoted(poll);
              const distribution = getVoteDistribution(poll);
              const isExpired = new Date(poll.expiresAt) < new Date();

              return (
                <Card key={poll._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col gap-4 bg-white dark:bg-slate-900 group">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Expires: {new Date(poll.expiresAt).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Total Votes: {poll.totalVotes || 0}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 leading-snug">{poll.question}</h3>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 mt-3">
                    {distribution?.map((opt) => (
                      <div key={opt.id} className={`flex flex-col gap-2 p-3 rounded-lg transition-all duration-300 border bg-transparent ${
                        opt.hasVoted 
                          ? 'border-emerald-400 ring-1 ring-emerald-200 dark:border-emerald-600 dark:ring-emerald-800/40' 
                          : 'border-slate-200 dark:border-slate-800'
                      }`}>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-700 dark:text-slate-200">
                          <span>{opt.text}</span>
                          <span className="text-xs text-slate-500">{opt.pct}% ({opt.count})</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                              opt.hasVoted 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`} 
                            style={{ width: `${opt.pct}%` }} 
                          >
                          </div>
                        </div>
                        {!isExpired && (
                          <div className="mt-1">
                            {opt.hasVoted ? (
                              <Badge variant="success" className="px-2 py-0.5 text-[10px] font-medium w-max">Selected</Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-max text-xs h-7 px-3 py-0"
                                onClick={() => handleCastVote(poll._id, opt.id)}
                              >
                                Vote
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                    {isExpired ? (
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">🔒 Closed</span>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">🟢 Active</span>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full">
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                  <Vote size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No polls found</h3>
                <p className="text-slate-500 mt-1 max-w-sm">No polls match your current filters.</p>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollsResident;

