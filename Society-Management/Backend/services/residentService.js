import ResidentProfile from '../models/ResidentProfile.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const residentService = {
  createProfile: async (profileData, createdByUserId) => {
    const { userId, flatNumber, block, floor, streetAddress, occupancyType } = profileData;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (user.role !== 'Resident') {
      throw new AppError('Profile creation is only allowed for users with Resident role', 400);
    }

    const existingProfile = await ResidentProfile.findOne({ user: userId });
    if (existingProfile) {
      throw new AppError('Resident profile already exists for this user', 400);
    }

    const profile = await ResidentProfile.create({
      user: userId,
      flatNumber,
      block,
      floor,
      streetAddress,
      occupancyType,
      createdBy: createdByUserId,
    });

    return profile;
  },

  getProfileById: async (profileId) => {
    const profile = await ResidentProfile.findById(profileId).populate(
      'user',
      'name email phone avatar status isVerified role'
    );
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }
    return profile;
  },

  getProfileByUserId: async (userId) => {
    const profile = await ResidentProfile.findOne({ user: userId }).populate(
      'user',
      'name email phone avatar status isVerified role'
    );
    if (!profile) {
      return null;
    }
    return profile;
  },

  updateProfile: async (profileId, updateData, updatedByUserId) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    const allowedFields = ['flatNumber', 'block', 'floor', 'streetAddress', 'occupancyType', 'profileImage'];

        allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        profile[field] = updateData[field];
      }
    });

    profile.updatedBy = updatedByUserId;
    await profile.save();

    const userUpdateFields = ['name', 'phone', 'status'];
    const hasUserUpdates = userUpdateFields.some(field => updateData[field] !== undefined);

        if (hasUserUpdates) {
      const user = await User.findById(profile.user);
      if (user) {
        if (updateData.name !== undefined) user.name = updateData.name;
        if (updateData.phone !== undefined) user.phone = updateData.phone;
        if (updateData.status !== undefined) user.status = updateData.status;
        await user.save();
      }
    }

    return profile.populate('user', 'name email phone avatar status isVerified role');
  },

  softDeleteProfile: async (profileId, deletedByUserId) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    await profile.softDelete(deletedByUserId);

    const user = await User.findById(profile.user);
    if (user) {
      await user.softDelete(deletedByUserId);
    }

    return { success: true };
  },

  listResidents: async (query, paginationOptions) => {
    const { block, flatNumber, occupancyType, search } = query;
    const { page = 1, limit = 10 } = paginationOptions;

        const filter = {};

    if (block) filter.block = block;
    if (flatNumber) filter.flatNumber = flatNumber;
    if (occupancyType) filter.occupancyType = occupancyType;

    let userIds = [];
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      userIds = users.map((u) => u._id);
      filter.user = { $in: userIds };
    }

    const skipIndex = (page - 1) * limit;

    const profiles = await ResidentProfile.find(filter)
      .populate('user', 'name email phone avatar status isVerified role')
      .skip(skipIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await ResidentProfile.countDocuments(filter);

    return {
      profiles,
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  addFamilyMember: async (profileId, memberData) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    profile.familyMembers.push({
      name: memberData.name,
      phone: memberData.phone,
      age: memberData.age,
      relation: memberData.relation,
      isEmergencyContact: memberData.isEmergencyContact || false,
    });

    await profile.save();
    return profile.familyMembers;
  },

  updateFamilyMember: async (profileId, familyMemberId, memberData) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    const member = profile.familyMembers.id(familyMemberId);
    if (!member) {
      throw new AppError('Family member not found', 404);
    }

    if (memberData.name !== undefined) member.name = memberData.name;
    if (memberData.phone !== undefined) member.phone = memberData.phone;
    if (memberData.age !== undefined) member.age = memberData.age;
    if (memberData.relation !== undefined) member.relation = memberData.relation;
    if (memberData.isEmergencyContact !== undefined) {
      member.isEmergencyContact = memberData.isEmergencyContact;
    }

    await profile.save();
    return profile.familyMembers;
  },

  removeFamilyMember: async (profileId, familyMemberId) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    const member = profile.familyMembers.id(familyMemberId);
    if (!member) {
      throw new AppError('Family member not found', 404);
    }

    profile.familyMembers.pull(familyMemberId);
    await profile.save();
    return profile.familyMembers;
  },

  addVehicle: async (profileId, vehicleData) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    const licensePlate = vehicleData.licensePlate.trim().toUpperCase();

    const plateExists = await ResidentProfile.findOne({
      'vehicles.licensePlate': licensePlate,
      isDeleted: { $ne: true },
    });

    if (plateExists) {
      throw new AppError('This vehicle license plate is already registered', 400);
    }

    profile.vehicles.push({
      vehicleType: vehicleData.vehicleType,
      vehicleName: vehicleData.vehicleName,
      licensePlate,
    });

    await profile.save();
    return profile.vehicles;
  },

  updateVehicle: async (profileId, vehicleId, vehicleData) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    const vehicle = profile.vehicles.id(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicleData.licensePlate) {
      const licensePlate = vehicleData.licensePlate.trim().toUpperCase();

      const plateExists = await ResidentProfile.findOne({
        'vehicles.licensePlate': licensePlate,
        _id: { $ne: profileId },
        isDeleted: { $ne: true },
      });

      if (plateExists) {
        throw new AppError('This vehicle license plate is already registered by another resident', 400);
      }
      vehicle.licensePlate = licensePlate;
    }

    if (vehicleData.vehicleType !== undefined) vehicle.vehicleType = vehicleData.vehicleType;
    if (vehicleData.vehicleName !== undefined) vehicle.vehicleName = vehicleData.vehicleName;

    await profile.save();
    return profile.vehicles;
  },

  removeVehicle: async (profileId, vehicleId) => {
    const profile = await ResidentProfile.findById(profileId);
    if (!profile) {
      throw new AppError('Resident profile not found', 404);
    }

    const vehicle = profile.vehicles.id(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    profile.vehicles.pull(vehicleId);
    await profile.save();
    return profile.vehicles;
  },
};
