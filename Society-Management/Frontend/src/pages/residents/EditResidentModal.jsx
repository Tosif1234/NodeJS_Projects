import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { updateProfile, fetchResidentsList } from '../../store/slices/residentSlice.js';
import { X } from 'lucide-react';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const EditResidentModal = ({ isOpen, onClose, profile }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    block: '',
    flatNumber: '',
    occupancyType: 'Owner'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        name: profile.user?.name || '',
        phone: profile.user?.phone || '',
        block: profile.block || '',
        flatNumber: profile.flatNumber || '',
        occupancyType: profile.occupancyType || 'Owner'
      });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, profile]);

  if (!isOpen || !profile) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // updateProfile takes { id: profile._id, formData: data }
    const result = await dispatch(updateProfile({
      id: profile._id,
      formData
    }));

    if (updateProfile.fulfilled.match(result)) {
      showToast('Resident profile updated successfully!', 'success');
      dispatch(fetchResidentsList({})); // Refresh list
      onClose();
    } else {
      showToast(result.payload || 'Failed to update profile', 'error');
    }
    
    setIsSubmitting(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Edit Resident
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="edit-resident-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Block"
                name="block"
                value={formData.block}
                onChange={handleChange}
                required
              />
              <Input
                label="Flat Number"
                name="flatNumber"
                value={formData.flatNumber}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              label="Occupancy Type"
              name="occupancyType"
              value={formData.occupancyType}
              onChange={handleChange}
            >
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
            </Select>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="edit-resident-form" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditResidentModal;
