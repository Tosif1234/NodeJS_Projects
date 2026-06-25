import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, Trash2, Eye } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

import {
  fetchNotificationsFeed,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../store/slices/notificationSlice.js';

export const NotificationsFeed = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  const { feed, status } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotificationsFeed());
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      showToast('Notification marked as read.');
    } catch (err) {
      showToast(err || 'Failed to update notification.', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      showToast('All notifications marked as read.');
    } catch (err) {
      showToast(err || 'Failed to update notifications.', 'error');
    }
  };

  const isLoading = status === 'loading' && feed.length === 0;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-slide-in">
      <div className="flex justify-between items-center border-b border-primary-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Bell size={24} className="text-accent-600 dark:text-accent-400" />
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white">Notifications Feed</h1>
        </div>
        {feed.some(n => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} icon={<Check size={14} />}>
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <Skeleton variant="card" count={3} />
      ) : feed.length === 0 ? (
        <EmptyState
          title="Notification inbox clean!"
          description="You have no notifications in your inbox at the moment."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {feed.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all flex justify-between items-start gap-4 ${
                item.isRead
                  ? 'bg-slate-50 dark:bg-slate-900/50 border-primary-100 dark:border-slate-800 text-primary-500 dark:text-slate-400'
                  : 'bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-700 text-primary-900 dark:text-slate-100 shadow-md shadow-accent-500/5 dark:shadow-accent-500/10'
              }`}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-bold ${item.isRead ? 'text-primary-600 dark:text-slate-400' : 'text-primary-900 dark:text-slate-100'}`}>
                    {item.title}
                  </span>
                  <Badge>{item.type}</Badge>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-accent-500 dark:bg-accent-400" />
                  )}
                </div>
                <p className="text-xs text-primary-600 dark:text-slate-300 leading-relaxed mt-1">{item.message}</p>
                <span className="text-[10px] text-primary-500 dark:text-slate-500 mt-2 font-semibold">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {!item.isRead && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleMarkRead(item._id)}
                  icon={<Eye size={12} />}
                  className="shrink-0"
                >
                  Mark read
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsFeed;

