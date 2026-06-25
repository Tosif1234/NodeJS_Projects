import express from 'express';
import {
  createProfile,
  getProfile,
  listResidents,
  updateProfile,
  deleteProfile,
  getFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  getVehicles,
  addVehicle,
  updateVehicle,
  removeVehicle,
} from '../controllers/residentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { uploadProfileImage } from '../middleware/uploadMiddleware.js';
import {
  createProfileValidator,
  updateProfileValidator,
  familyMemberValidator,
  vehicleValidator,
} from '../validators/residentValidator.js';
import { PERMISSIONS, ROLES } from '../constants/roles.js';


const router = express.Router();

router.use(protect);

router.get('/', requirePermission(PERMISSIONS.RESIDENT_VIEW_ALL), listResidents);
router.post('/', requirePermission(PERMISSIONS.RESIDENT_CREATE), createProfileValidator, createProfile);

router.get('/:id', getProfile);
router.put('/:id', uploadProfileImage.single('profileImage'), updateProfileValidator, updateProfile);
router.delete('/:id', requireRole(ROLES.ADMIN), deleteProfile);

router.get('/:id/family', getFamilyMembers);
router.post('/:id/family', familyMemberValidator, addFamilyMember);
router.put('/:id/family/:familyId', familyMemberValidator, updateFamilyMember);
router.delete('/:id/family/:familyId', removeFamilyMember);

router.get('/:id/vehicles', getVehicles);
router.post('/:id/vehicles', vehicleValidator, addVehicle);
router.put('/:id/vehicles/:vehicleId', vehicleValidator, updateVehicle);
router.delete('/:id/vehicles/:vehicleId', removeVehicle);

export default router;
