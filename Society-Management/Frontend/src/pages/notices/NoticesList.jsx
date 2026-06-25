import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminNotices, deleteExistingNotice } from '../../store/slices/noticeSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { Megaphone, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import NoticeModal from './NoticeModal.jsx';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

export const NoticesList = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { adminNotices, status, error } = useSelector((state) => state.notice);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminNotices({}));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('notice_updated', () => {
      dispatch(fetchAdminNotices({}));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this notice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(deleteExistingNotice(id));
      if (deleteExistingNotice.fulfilled.match(actionResult)) {
        showToast('Notice deleted successfully.');
      } else {
        showToast(actionResult.payload || 'Failed to delete notice', 'error');
      }
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Title & Summary',
      key: 'title',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary-900 text-sm">{row.title}</span>
          <span className="text-xs text-primary-500 truncate max-w-[300px]">{row.content}</span>
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
      header: 'Status',
      key: 'status',
      render: (val) => <Badge>{val}</Badge>,
    },
    {
      header: 'Published Date',
      key: 'createdAt',
      render: (val) => (
        <span className="text-xs text-primary-500 flex items-center gap-1">
          <Calendar size={12} /> {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: '_id',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Button size="xs" variant="outline" className="text-primary-600 border-primary-200 hover:bg-primary-50" onClick={() => handleEdit(row)}>
            <Edit2 size={13} />
          </Button>
          <Button size="xs" variant="outline" className="text-red-600 border-red-200 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleDelete(val)}>
            <Trash2 size={13} />
          </Button>
        </div>
      ),
    },
  ];

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50" />
        <Skeleton variant="card" className="h-96 bg-primary-50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight flex items-center gap-2">
            <Megaphone className="text-amber-600" size={24} />
            Notice Board Administration
          </h1>
          <p className="text-sm text-primary-500">Broadcast administrative notices, maintenance windows, or festive event schedules.</p>
        </div>
        <Button onClick={handleCreate}>Create Notice</Button>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      <Card className="p-0 overflow-hidden bg-white border-primary-200 ">
        <Table
          columns={columns}
          data={adminNotices || []}
          emptyMessage="No notices published on notice board."
        />
      </Card>

      <NoticeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        notice={editingNotice} 
      />
    </div>
  );
};

export default NoticesList;

