import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { createNewNotice, updateExistingNotice } from '../../store/slices/noticeSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const NoticeModal = ({ isOpen, onClose, notice = null }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (notice) {
        setValue('title', notice.title);
        setValue('content', notice.content);
        setValue('category', notice.category);
        setValue('status', notice.status);
      } else {
        reset();
      }
    }
  }, [isOpen, notice, setValue, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Create FormData object since the endpoint expects it for potential file uploads
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('status', data.status || 'Published');
    
    // Default to all roles if none selected in UI (since there's no UI for it yet)
    formData.append('targetRoles', JSON.stringify(['Resident', 'Security Staff', 'Maintenance Staff']));
    
    if (data.attachment && data.attachment.length > 0) {
      formData.append('attachment', data.attachment[0]);
    }

    try {
      if (notice) {
        const result = await dispatch(updateExistingNotice({ id: notice._id, formData }));
        if (updateExistingNotice.fulfilled.match(result)) {
          showToast('Notice updated successfully', 'success');
          onClose();
        } else {
          showToast(result.payload || 'Failed to update notice', 'error');
        }
      } else {
        const result = await dispatch(createNewNotice(formData));
        if (createNewNotice.fulfilled.match(result)) {
          showToast('Notice created successfully', 'success');
          onClose();
        } else {
          showToast(result.payload || 'Failed to create notice', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={notice ? 'Edit Notice' : 'Create New Notice'}
      size="md"
    >
      <form id="notice-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Enter notice title"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary-900">Content</label>
          <textarea
            className="w-full px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 min-h-[120px] resize-y"
            placeholder="Notice content..."
            {...register('content', { required: 'Content is required' })}
          />
          {errors.content && <span className="text-xs text-red-500">{errors.content.message}</span>}
        </div>

        <Select
          label="Category"
          error={errors.category?.message}
          {...register('category', { required: 'Category is required' })}
        >
          <option value="">Select Category</option>
          <option value="General">General</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Event">Event</option>
          <option value="Meeting">Meeting</option>
          <option value="Emergency">Emergency</option>
        </Select>

        <Select
          label="Status"
          error={errors.status?.message}
          {...register('status')}
          defaultValue="Published"
        >
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
        </Select>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary-900">Attachment (Optional)</label>
          <input
            type="file"
            className="text-sm text-primary-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
            {...register('attachment')}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="notice-form">
            {notice ? 'Update Notice' : 'Create Notice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NoticeModal;
