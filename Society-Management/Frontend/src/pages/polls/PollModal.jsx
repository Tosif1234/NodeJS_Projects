import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { createNewPoll } from '../../store/slices/pollSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Plus, X } from 'lucide-react';

const PollModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(['', '']); // Start with 2 options

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      showToast('A poll must have at least two options', 'error');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const onSubmit = async (data) => {
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      showToast('Please provide at least two valid options', 'error');
      return;
    }

    setLoading(true);

    const pollData = {
      ...data,
      options: validOptions.map(opt => ({ optionText: opt })),
    };

    try {
      const result = await dispatch(createNewPoll(pollData));
      if (createNewPoll.fulfilled.match(result)) {
        showToast('Poll created successfully', 'success');
        reset();
        setOptions(['', '']);
        onClose();
      } else {
        showToast(result.payload || 'Failed to create poll', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Poll"
      size="md"
    >
      <form id="poll-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Poll Question"
          placeholder="E.g., What color should we paint the lobby?"
          error={errors.question?.message}
          {...register('question', { required: 'Question is required' })}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              label="Poll Type"
              {...register('pollType')}
            >
              <option value="Single">Single Choice</option>
              <option value="Multiple">Multiple Choice</option>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              label="Expires At"
              type="datetime-local"
              error={errors.expiresAt?.message}
              {...register('expiresAt', { required: 'Expiration date is required' })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-semibold text-primary-900">Poll Options</label>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className="flex-1 px-3 py-2 bg-white border border-primary-200 rounded-xl text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Remove option"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-max mt-1 text-primary-600 border-primary-200"
            onClick={addOption}
          >
            <Plus size={14} className="mr-1" /> Add Option
          </Button>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="poll-form">
            Create Poll
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PollModal;
