import { residentService } from '../services/residentService.js';
import ApiResponse from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../constants/roles.js';

const checkProfileAccess = (req, profile, allowModify = false) => {
  const isOwner = profile.user.toString() === req.user.id || (profile.user._id && profile.user._id.toString() === req.user.id);
  const isAdmin = req.user.role === ROLES.ADMIN;

    if (allowModify) {
    if (!isAdmin && !isOwner) {
      throw new AppError('You do not have permission to modify this profile', 403);
    }
  } else {
    const isSecurity = req.user.role === ROLES.SECURITY_STAFF;
    const isMaintenance = req.user.role === ROLES.MAINTENANCE_STAFF;

        if (!isAdmin && !isOwner && !isSecurity && !isMaintenance) {
      throw new AppError('You do not have permission to access this profile', 403);
    }
  }
};

const resolveProfile = async (req) => {
  let profile;
  if (req.params.id === 'me') {
    profile = await residentService.getProfileByUserId(req.user.id);
  } else {
    profile = await residentService.getProfileById(req.params.id);
  }
  if (!profile) {
    throw new AppError('Resident profile not found', 404);
  }
  return profile;
};

export const createProfile = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isAdmin && userId !== req.user.id) {
    throw new AppError('You can only create a resident profile for your own user account', 403);
  }

  const profile = await residentService.createProfile(req.body, req.user.id);

  return ApiResponse.success(res, 'Resident profile created successfully', profile, 201);
});

export const getProfile = asyncHandler(async (req, res) => {
  let profile;
  if (req.params.id === 'me') {
    profile = await residentService.getProfileByUserId(req.user.id);
    if (!profile) {
      return ApiResponse.success(res, 'Profile not created yet', null);
    }
  } else {
    profile = await residentService.getProfileById(req.params.id);
  }

  checkProfileAccess(req, profile, false);

  return ApiResponse.success(res, 'Profile retrieved successfully', profile);
});

export const listResidents = asyncHandler(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const paginationOptions = { page, limit };

  const result = await residentService.listResidents(filters, paginationOptions);

  return ApiResponse.success(res, 'Resident profiles listed successfully', result.profiles, 200, result.meta);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);

    checkProfileAccess(req, profile, true);

  const updateData = { ...req.body };

  if (req.file) {
    updateData.profileImage = req.file.path.replace(/\\/g, '/');
  }

  const updatedProfile = await residentService.updateProfile(profile._id, updateData, req.user.id);

  return ApiResponse.success(res, 'Resident profile updated successfully', updatedProfile);
});

export const deleteProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new AppError('Only Admins are allowed to delete resident profiles', 403);
  }

  await residentService.softDeleteProfile(req.params.id, req.user.id);

  return ApiResponse.success(res, 'Resident profile and associated user account deleted successfully (Soft Delete)');
});


export const getFamilyMembers = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, false);

  return ApiResponse.success(res, 'Family members retrieved successfully', profile.familyMembers);
});

export const addFamilyMember = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, true);

  const familyMembers = await residentService.addFamilyMember(profile._id, req.body);

  return ApiResponse.success(res, 'Family member added successfully', familyMembers);
});

export const updateFamilyMember = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, true);

  const familyMembers = await residentService.updateFamilyMember(
    profile._id,
    req.params.familyId,
    req.body
  );

  return ApiResponse.success(res, 'Family member updated successfully', familyMembers);
});

export const removeFamilyMember = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, true);

  const familyMembers = await residentService.removeFamilyMember(
    profile._id,
    req.params.familyId
  );

  return ApiResponse.success(res, 'Family member removed successfully', familyMembers);
});


export const getVehicles = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, false);

  return ApiResponse.success(res, 'Vehicles retrieved successfully', profile.vehicles);
});

export const addVehicle = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, true);

  const vehicles = await residentService.addVehicle(profile._id, req.body);

  return ApiResponse.success(res, 'Vehicle registered successfully', vehicles);
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, true);

  const vehicles = await residentService.updateVehicle(
    profile._id,
    req.params.vehicleId,
    req.body
  );

  return ApiResponse.success(res, 'Vehicle updated successfully', vehicles);
});

export const removeVehicle = asyncHandler(async (req, res) => {
  const profile = await resolveProfile(req);
  checkProfileAccess(req, profile, true);

  const vehicles = await residentService.removeVehicle(
    profile._id,
    req.params.vehicleId
  );

  return ApiResponse.success(res, 'Vehicle deregistered successfully', vehicles);
});
