import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  fetchProfile,
  addVehicle,
  removeVehicle,
  updateVehicle,
} from '../../store/slices/residentSlice.js';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Table from '../../components/Table.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { Car, Plus, Trash2, Edit2, LayoutGrid, List } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Swal from 'sweetalert2';

export const VehiclesResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { profile, status } = useSelector((state) => state.resident);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [submittingVehicle, setSubmittingVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const {
    register: registerVehicle,
    handleSubmit: handleSubmitVehicle,
    reset: resetVehicle,
    formState: { errors: vehicleErrors },
  } = useForm({
    defaultValues: {
      vehicleType: 'Car',
      vehicleName: '',
      licensePlate: '',
    },
  });

  useEffect(() => {
    if (user && !profile) {
      dispatch(fetchProfile('me'));
    }
  }, [dispatch, user, profile]);

  const onSubmitVehicle = async (data) => {
    setSubmittingVehicle(true);
    try {
      let result;
      if (editingVehicleId) {
        result = await dispatch(updateVehicle({ id: 'me', vehicleId: editingVehicleId, data }));
      } else {
        result = await dispatch(addVehicle({ id: 'me', data }));
      }

      if (addVehicle.fulfilled.match(result) || updateVehicle.fulfilled.match(result)) {
        showToast(`Vehicle ${editingVehicleId ? 'updated' : 'registered'} successfully!`, 'success');
        setIsVehicleModalOpen(false);
        setEditingVehicleId(null);
        resetVehicle({
          vehicleType: 'Car',
          vehicleName: '',
          licensePlate: '',
        });
      } else {
        showToast(result.payload || `Failed to ${editingVehicleId ? 'update' : 'register'} vehicle`, 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingVehicle(false);
    }
  };

  const openEditModal = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    resetVehicle({
      vehicleType: vehicle.vehicleType,
      vehicleName: vehicle.vehicleName,
      licensePlate: vehicle.licensePlate,
    });
    setIsVehicleModalOpen(true);
  };

  const openAddModal = () => {
    setEditingVehicleId(null);
    resetVehicle({
      vehicleType: 'Car',
      vehicleName: '',
      licensePlate: '',
    });
    setIsVehicleModalOpen(true);
  };

  const handleRemoveVehicle = async (vehicleId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this vehicle?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(removeVehicle({ id: 'me', vehicleId }));
      if (removeVehicle.fulfilled.match(actionResult)) {
        showToast('Vehicle removed.', 'success');
      } else {
        showToast(actionResult.payload || 'Failed to remove vehicle', 'error');
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
        description="Please complete your profile from the 'My Profile' tab before registering vehicles."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Car className="text-indigo-600 dark:text-indigo-400" size={24} />
            My Vehicles
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Register and manage your parked vehicles.</p>
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
              <Plus size={16} /> Register Vehicle
            </Button>
          </div>
        )}
      </div>

      {profile && viewMode === 'list' && (
        <Table
          columns={[
            { header: 'Vehicle Type', key: 'vehicleType', render: (val) => <Badge variant={val === 'Car' ? 'success' : val === 'EV' ? 'primary' : 'accent'}>{val}</Badge> },
            { header: 'Model / Name', key: 'vehicleName', render: (val) => <span className="text-primary-900 dark:text-slate-100 font-medium">{val}</span> },
            { header: 'License Plate', key: 'licensePlate', render: (val) => <span className="font-mono text-xs text-primary-600 dark:text-slate-300 bg-primary-100 dark:bg-slate-800 px-2 py-1 rounded">{val}</span> },
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
                    onClick={() => handleRemoveVehicle(val)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            }
          ]}
          data={profile.vehicles || []}
          emptyMessage="No vehicles registered."
        />
      )}

      {profile && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.vehicles?.length > 0 ? (
            profile.vehicles.map((vehicle) => (
              <Card key={vehicle._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{vehicle.vehicleName}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">{vehicle.licensePlate}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(vehicle)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => handleRemoveVehicle(vehicle._id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span>Vehicle Type</span> 
                    <Badge variant={vehicle.vehicleType === 'Car' ? 'success' : vehicle.vehicleType === 'EV' ? 'primary' : 'accent'}>{vehicle.vehicleType}</Badge>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState title="No vehicles" description="You have not registered any vehicles yet." />
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Vehicle Modal */}
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        title={editingVehicleId ? "Edit Vehicle" : "Register Vehicle"}
        description="Add a new vehicle to your profile to receive parking authorization."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsVehicleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitVehicle(onSubmitVehicle)}
              disabled={submittingVehicle}
            >
              {submittingVehicle ? 'Saving...' : (editingVehicleId ? 'Update Vehicle' : 'Register Vehicle')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitVehicle(onSubmitVehicle)} className="flex flex-col gap-4">
          <Select
            label="Vehicle Type"
            options={[
              { value: 'Car', label: 'Car' },
              { value: 'Bike', label: 'Bike' },
              { value: 'EV', label: 'Electric Vehicle' },
              { value: 'Other', label: 'Other' },
            ]}
            {...registerVehicle('vehicleType')}
          />

          <Input
            label="Vehicle Make & Model"
            type="text"
            placeholder="e.g. Honda Civic"
            error={vehicleErrors.vehicleName?.message}
            {...registerVehicle('vehicleName', { required: 'Vehicle model is required' })}
          />

          <Input
            label="License Plate Number"
            type="text"
            placeholder="e.g. MH-12-AB-1234"
            error={vehicleErrors.licensePlate?.message}
            {...registerVehicle('licensePlate', {
              required: 'License plate is required',
              pattern: {
                value: /^[A-Z0-9\s\-]{4,15}$/i,
                message: 'Please enter a valid license plate number',
              },
            })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default VehiclesResident;
