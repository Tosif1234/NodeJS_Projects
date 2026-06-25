import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  fetchProfile,
  addFamilyMember,
  removeFamilyMember,
  updateFamilyMember,
} from '../../store/slices/residentSlice.js';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Table from '../../components/Table.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { Users, Plus, Trash2, Edit2, LayoutGrid, List } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Swal from 'sweetalert2';

export const FamilyResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { profile, status } = useSelector((state) => state.resident);

  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [submittingFamily, setSubmittingFamily] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const {
    register: registerFamily,
    handleSubmit: handleSubmitFamily,
    reset: resetFamily,
    formState: { errors: familyErrors },
  } = useForm({
    defaultValues: {
      name: '',
      relation: 'Spouse',
      phone: '',
      age: '',
      isEmergencyContact: 'false',
    },
  });

  useEffect(() => {
    if (user && !profile) {
      dispatch(fetchProfile('me'));
    }
  }, [dispatch, user, profile]);

  const onSubmitFamilyMember = async (data) => {
    setSubmittingFamily(true);
    const payload = {
      ...data,
      isEmergencyContact: data.isEmergencyContact === 'true',
    };
    try {
      let result;
      if (editingFamilyId) {
        result = await dispatch(updateFamilyMember({ id: 'me', familyId: editingFamilyId, data: payload }));
      } else {
        result = await dispatch(addFamilyMember({ id: 'me', data: payload }));
      }

      if (addFamilyMember.fulfilled.match(result) || updateFamilyMember.fulfilled.match(result)) {
        showToast(`Household member ${editingFamilyId ? 'updated' : 'added'} successfully!`, 'success');
        setIsFamilyModalOpen(false);
        setEditingFamilyId(null);
        resetFamily({
          name: '',
          relation: 'Spouse',
          phone: '',
          age: '',
          isEmergencyContact: 'false',
        });
      } else {
        showToast(result.payload || `Failed to ${editingFamilyId ? 'update' : 'add'} household member`, 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingFamily(false);
    }
  };

  const openEditModal = (member) => {
    setEditingFamilyId(member._id);
    resetFamily({
      name: member.name,
      relation: member.relation,
      phone: member.phone || '',
      age: member.age || '',
      isEmergencyContact: member.isEmergencyContact ? 'true' : 'false',
    });
    setIsFamilyModalOpen(true);
  };

  const openAddModal = () => {
    setEditingFamilyId(null);
    resetFamily({
      name: '',
      relation: 'Spouse',
      phone: '',
      age: '',
      isEmergencyContact: 'false',
    });
    setIsFamilyModalOpen(true);
  };

  const handleRemoveFamilyMember = async (familyId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this household member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove them!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(removeFamilyMember({ id: 'me', familyId }));
      if (removeFamilyMember.fulfilled.match(actionResult)) {
        showToast('Household member removed.', 'success');
      } else {
        showToast(actionResult.payload || 'Failed to remove member', 'error');
      }
    }
  };

  if (status === 'loading' && !profile) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50 dark:bg-slate-800" />
        <Skeleton variant="card" className="h-48 bg-primary-50 dark:bg-slate-800" />
      </div>
    );
  }

  if (status === 'succeeded' && !profile) {
    return (
      <EmptyState
        title="Profile Required"
        description="Please complete your profile from the 'My Profile' tab before adding family members."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            My Family
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Manage your household members and emergency contacts.</p>
        </div>
        {profile && (
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={openAddModal}
              className="flex items-center gap-2 shadow-sm font-medium px-4 py-[9px] text-[15px] rounded-xl"
            >
              <Plus size={16} /> Add Member
            </Button>
          </div>
        )}
      </div>

      {profile && viewMode === 'list' && (
        <Table
          columns={[
            { header: 'Name', key: 'name', render: (val) => <span className="font-semibold text-primary-900 dark:text-slate-100">{val}</span> },
            { header: 'Relation', key: 'relation', render: (val) => <Badge variant="primary">{val}</Badge> },
            { header: 'Age', key: 'age', render: (val) => <span className="text-primary-600 dark:text-slate-400">{val ? `${val} yrs` : 'N/A'}</span> },
            { header: 'Phone Number', key: 'phone', render: (val) => <span className="text-primary-600 dark:text-slate-400">{val || 'N/A'}</span> },
            {
              header: 'Emergency Contact',
              key: 'isEmergencyContact',
              render: (val) => (
                <Badge variant={val ? 'error' : 'gray'}>
                  {val ? 'Yes' : 'No'}
                </Badge>
              )
            },
            {
              header: 'Actions',
              key: '_id',
              render: (val, row) => (
                <div className="flex items-center gap-4">
                  <button
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                    onClick={() => openEditModal(row)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="text-slate-400 hover:text-red-600 transition-colors"
                    onClick={() => handleRemoveFamilyMember(val)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={profile.familyMembers || []}
          emptyMessage="No family members registered."
        />
      )}

      {profile && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.familyMembers?.length > 0 ? (
            profile.familyMembers.map((member) => (
              <Card key={member._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.relation}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(member)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => handleRemoveFamilyMember(member._id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center"><span>Age</span> <span className="font-semibold text-slate-900 dark:text-slate-200">{member.age ? `${member.age} yrs` : 'N/A'}</span></div>
                  <div className="flex justify-between items-center"><span>Phone</span> <span className="font-semibold text-slate-900 dark:text-slate-200">{member.phone || 'N/A'}</span></div>
                  <div className="flex justify-between items-center"><span>Emergency Contact</span> <Badge variant={member.isEmergencyContact ? 'error' : 'gray'}>{member.isEmergencyContact ? 'Yes' : 'No'}</Badge></div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState title="No family members" description="You have not added any household members yet." />
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Family Member Modal */}
      <Modal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        title={editingFamilyId ? "Edit Household Member" : "Add Household Member"}
        description="Register a new family member to grant them access to society amenities and emergency contact listing."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFamilyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitFamily(onSubmitFamilyMember)}
              disabled={submittingFamily}
            >
              {submittingFamily ? 'Saving...' : (editingFamilyId ? 'Update Member' : 'Add Member')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitFamily(onSubmitFamilyMember)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="e.g. Anjali Verma"
            error={familyErrors.name?.message}
            {...registerFamily('name', { required: 'Name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Relationship"
              options={[
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Child', label: 'Child' },
                { value: 'Parent', label: 'Parent' },
                { value: 'Sibling', label: 'Sibling' },
                { value: 'Tenant', label: 'Tenant' },
                { value: 'Other', label: 'Other' },
              ]}
              {...registerFamily('relation')}
            />

            <Select
              label="Emergency Contact"
              options={[
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Yes' },
              ]}
              {...registerFamily('isEmergencyContact')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Age (Optional)"
              type="number"
              placeholder="e.g. 35"
              error={familyErrors.age?.message}
              {...registerFamily('age', { 
                valueAsNumber: true,
                min: { value: 0, message: 'Age cannot be negative' },
                max: { value: 120, message: 'Age seems invalid' }
              })}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g. +919876543210"
              error={familyErrors.phone?.message}
              {...registerFamily('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[1-9]\d{9,14}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FamilyResident;
