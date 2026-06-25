import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNoticeFeed, markNoticeRead } from '../../store/slices/noticeSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { Megaphone, Calendar, CheckCircle2, LayoutGrid, List as ListIcon, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import { io } from 'socket.io-client';

export const NoticesResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { feed, status, error } = useSelector((state) => state.notice);
  const [viewMode, setViewMode] = useState('list');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchNoticeFeed({}));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('notice_updated', () => {
      dispatch(fetchNoticeFeed({}));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    const result = await dispatch(markNoticeRead(id));
    if (markNoticeRead.fulfilled.match(result)) {
      showToast('Announcement marked as read.');
      dispatch(fetchNoticeFeed({}));
    } else {
      showToast(result.payload || 'Failed to update notice read status', 'error');
    }
  };

  const columns = [
    {
      header: 'Title & Summary',
      key: 'title',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className={`font-semibold text-sm ${row.isRead ? 'text-primary-500 dark:text-slate-400 line-through' : 'text-primary-900 dark:text-slate-100 font-bold'}`}>{row.title}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400 max-w-[400px] truncate">{row.content}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => {
        const variants = {
          General: 'primary',
          Emergency: 'error',
          Maintenance: 'warning',
          Event: 'success',
          Meeting: 'accent',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
    },
    {
      header: 'Date',
      key: 'createdAt',
      render: (val) => (
        <span className="text-xs text-primary-500 dark:text-slate-400 flex items-center gap-1">
          <Calendar size={12} /> {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Action',
      key: '_id',
      render: (val, row) => {
        if (row.isRead) {
          return (
            <span className="text-xs text-primary-500 dark:text-slate-400 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-primary-500 dark:text-slate-400" /> Read
            </span>
          );
        }
        return (
          <Button size="xs" variant="outline" onClick={() => handleMarkAsRead(row._id)}>
            Mark Read
          </Button>
        );
      },
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

  const filteredNotices = (feed || []).filter(notice => {
    return categoryFilter === 'All' || notice.category === categoryFilter;
  }).sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.isRead ? 1 : -1;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white tracking-tight flex items-center gap-2">
            <Megaphone className="text-amber-600" size={24} />
            Notice Board
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">View latest announcements, guidelines, schedules, and administrative circulars.</p>
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 appearance-none text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Emergency">Emergency</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Event">Event</option>
            <option value="Meeting">Meeting</option>
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
            data={filteredNotices}
            emptyMessage="No notices match your current filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <Card key={notice._id} className={`p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow ${notice.isRead ? 'opacity-70' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`font-bold ${notice.isRead ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                      {notice.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={notice.category === 'Emergency' ? 'error' : notice.category === 'Maintenance' ? 'warning' : notice.category === 'Event' ? 'success' : notice.category === 'Meeting' ? 'accent' : 'primary'}>
                    {notice.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {notice.isRead ? (
                    <span className="text-xs text-primary-500 flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-primary-500" /> Read
                    </span>
                  ) : (
                    <Button size="xs" variant="outline" onClick={() => handleMarkAsRead(notice._id)}>
                      Mark Read
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                  <Megaphone size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No notices found</h3>
                <p className="text-slate-500 mt-1 max-w-sm">No notices match your current filters.</p>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoticesResident;

