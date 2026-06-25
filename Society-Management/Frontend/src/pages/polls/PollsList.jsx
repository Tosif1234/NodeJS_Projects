import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPollsList, deleteExistingPoll } from '../../store/slices/pollSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { Vote, Calendar, Trash2, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import { io } from 'socket.io-client';
import PollModal from './PollModal.jsx';
import Swal from 'sweetalert2';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export const PollsList = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { polls, status, error } = useSelector((state) => state.poll);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPollsList({}));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('poll_updated', () => {
      dispatch(fetchPollsList({}));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this poll?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(deleteExistingPoll(id));
      if (deleteExistingPoll.fulfilled.match(actionResult)) {
        showToast('Poll deleted successfully.');
      } else {
        showToast(actionResult.payload || 'Failed to delete poll', 'error');
      }
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const getVoteCount = (pollObj) => {
    return pollObj.totalVotes || 0;
  };

  // Chart Data Preparation
  const recentPoll = polls?.filter(p => new Date(p.expiresAt) > new Date())[0] || polls?.[0];
  const pieData = recentPoll?.options?.map(opt => ({
    name: opt.optionText,
    value: opt.voteCount || 0
  })) || [];

  const barData = (polls || []).slice(0, 5).map(p => ({
    name: p.question.length > 15 ? p.question.substring(0, 15) + '...' : p.question,
    Votes: p.totalVotes || 0,
    fullQuestion: p.question
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const columns = [
    {
      header: 'Poll Question',
      key: 'question',
      render: (val) => <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{val}</span>,
    },
    {
      header: 'Vote Count',
      key: '_id',
      render: (val, row) => (
        <span className="text-xs text-primary-600 dark:text-slate-400 font-medium">
          🗳️ {getVoteCount(row)} responses
        </span>
      ),
    },
    {
      header: 'Expires Date',
      key: 'expiresAt',
      render: (val) => {
        const isExpired = new Date(val) < new Date();
        return (
          <div className="flex flex-col">
            <span className="text-xs text-primary-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> {new Date(val).toLocaleDateString()}
            </span>
            <Badge variant={isExpired ? 'gray' : 'success'} className="mt-1 w-max flex items-center gap-1 shadow-sm px-2">
              {isExpired ? '🔒 Closed' : '🟢 Active'}
            </Badge>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      key: '_id',
      render: (val) => (
        <Button size="xs" variant="outline" className="text-red-600 border-red-200 dark:border-red-500/30 dark:text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleDelete(val)}>
          <Trash2 size={13} />
        </Button>
      ),
    },
  ];

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50 dark:bg-slate-800" />
        <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Vote className="text-primary-500 dark:text-slate-400" size={24} />
            Polls & Voting Management
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Launch community voting campaigns, collect opinions, and gauge resident agreement.</p>
        </div>
        <Button onClick={handleCreate}>Create Poll</Button>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {/* Analytics Dashboard */}
      {polls && polls.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 border-slate-200 dark:border-slate-800 flex flex-col gap-4 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PieChartIcon size={18} className="text-emerald-500" />
              Latest Poll Distribution
            </h3>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">
              {recentPoll?.question}
            </div>
            <div className="h-64 w-full">
              {pieData.every(d => d.value === 0) ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">No votes yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-5 border-slate-200 dark:border-slate-800 flex flex-col gap-4 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 size={18} className="text-primary-500" />
              Recent Poll Engagement
            </h3>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Total votes across recent polls</div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="Votes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
        <Table
          columns={columns}
          data={polls || []}
          emptyMessage="No community polls created."
        />
      </Card>

      <PollModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default PollsList;

