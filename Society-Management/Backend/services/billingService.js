import MaintenanceBill from '../models/MaintenanceBill.js';
import User from '../models/User.js';
import ResidentProfile from '../models/ResidentProfile.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import { logEvent } from '../utils/auditLogger.js';

export const billingService = {
  getBillById: async (billId) => {
    const bill = await MaintenanceBill.findById(billId).populate('resident', 'name email phone');
    if (!bill) {
      throw new AppError('Maintenance bill not found', 404);
    }
    return bill;
  },

  generateBill: async (billData, adminUserId) => {
    const {
      resident,
      month,
      year,
      maintenanceCharges,
      waterCharges,
      parkingCharges,
      electricityCommonCharges,
      penalties = 0,
      otherCharges = 0,
      dueDate,
    } = billData;

    const user = await User.findById(resident);
    if (!user || user.role !== 'Resident') {
      throw new AppError('Selected user is not registered as a Resident', 400);
    }

    const billExists = await MaintenanceBill.findOne({
      resident,
      month,
      year,
      isDeleted: { $ne: true },
    });
    if (billExists) {
      throw new AppError(`A maintenance bill already exists for this resident for ${month}/${year}`, 400);
    }

    const amount =
      maintenanceCharges +
      waterCharges +
      parkingCharges +
      electricityCommonCharges +
      penalties +
      otherCharges;

    const datePart = `${year}${month.toString().padStart(2, '0')}`;
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${datePart}-${randPart}`;

    const bill = await MaintenanceBill.create({
      resident,
      invoiceNumber,
      month,
      year,
      maintenanceCharges,
      waterCharges,
      parkingCharges,
      electricityCommonCharges,
      penalties,
      otherCharges,
      amount,
      dueDate: new Date(dueDate),
      status: 'Pending',
      createdBy: adminUserId,
    });

    await Notification.create({
      recipient: resident,
      title: 'New Maintenance Bill Generated',
      message: `Your maintenance bill for ${month}/${year} has been generated. Amount: $${amount.toFixed(2)}. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      type: 'Bill',
    });

    return bill;
  },

  generateBillsBulk: async (bulkData, adminUserId) => {
    const {
      month,
      year,
      maintenanceCharges,
      waterCharges,
      parkingCharges,
      electricityCommonCharges,
      otherCharges = 0,
      dueDate,
    } = bulkData;

    const residents = await User.find({ role: 'Resident', status: 'Approved' });
    if (residents.length === 0) {
      throw new AppError('No active residents found to generate bills for', 400);
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const resi of residents) {
      const billExists = await MaintenanceBill.findOne({
        resident: resi._id,
        month,
        year,
        isDeleted: { $ne: true },
      });

      if (billExists) {
        skippedCount++;
        continue;
      }

      const datePart = `${year}${month.toString().padStart(2, '0')}`;
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const invoiceNumber = `INV-${datePart}-${randPart}`;

      const amount = maintenanceCharges + waterCharges + parkingCharges + electricityCommonCharges + otherCharges;

      await MaintenanceBill.create({
        resident: resi._id,
        invoiceNumber,
        month,
        year,
        maintenanceCharges,
        waterCharges,
        parkingCharges,
        electricityCommonCharges,
        otherCharges,
        amount,
        dueDate: new Date(dueDate),
        status: 'Pending',
        createdBy: adminUserId,
      });

      await Notification.create({
        recipient: resi._id,
        title: 'New Maintenance Bill',
        message: `Your maintenance bill for ${month}/${year} has been generated. Total: $${amount.toFixed(2)}. Due: ${new Date(dueDate).toLocaleDateString()}`,
        type: 'Bill',
      });

      createdCount++;
    }

    return {
      success: true,
      createdCount,
      skippedCount,
    };
  },

  recordBillPayment: async (billId, paymentDetailsData, staffUserId, auditMeta = {}) => {
    const paidAmount = paymentDetailsData.paidAmount !== undefined 
      ? paymentDetailsData.paidAmount 
      : paymentDetailsData.amountPaid;
    const paymentMethod = paymentDetailsData.paymentDetails?.paymentMethod || paymentDetailsData.paymentMethod;
    const transactionId = paymentDetailsData.paymentDetails?.transactionId || paymentDetailsData.transactionId;

    const bill = await MaintenanceBill.findById(billId);
    if (!bill) {
      throw new AppError('Maintenance bill not found', 404);
    }

    if (bill.status === 'Paid') {
      throw new AppError('This bill is already fully paid', 400);
    }

    bill.paidAmount += paidAmount;

    if (bill.paidAmount >= bill.amount) {
      bill.status = 'Paid';
    } else {
      bill.status = 'Partially Paid';
    }

    bill.paymentDetails = {
      transactionId,
      paymentMethod,
      paidAt: new Date(),
    };

    bill.updatedBy = staffUserId;
    await bill.save();

    await Notification.create({
      recipient: bill.resident,
      title: 'Payment Received',
      message: `We received a payment of $${paidAmount.toFixed(2)} for your ${bill.month}/${bill.year} maintenance bill. Current Status: ${bill.status}`,
      type: 'Bill',
    });

    await logEvent({
      action: 'Password Change', 
      user: staffUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Payment of $${paidAmount} recorded for bill ${bill.invoiceNumber}. New Status: ${bill.status}`,
    });

    return bill;
  },

  updateBill: async (billId, updateData, adminUserId, auditMeta = {}) => {
    const bill = await MaintenanceBill.findById(billId);
    if (!bill) {
      throw new AppError('Maintenance bill not found', 404);
    }

        const {
      maintenanceCharges,
      waterCharges,
      parkingCharges,
      electricityCommonCharges,
      otherCharges,
      penalties,
      dueDate
    } = updateData;

    if (maintenanceCharges !== undefined) bill.maintenanceCharges = maintenanceCharges;
    if (waterCharges !== undefined) bill.waterCharges = waterCharges;
    if (parkingCharges !== undefined) bill.parkingCharges = parkingCharges;
    if (electricityCommonCharges !== undefined) bill.electricityCommonCharges = electricityCommonCharges;
    if (otherCharges !== undefined) bill.otherCharges = otherCharges;
    if (penalties !== undefined) bill.penalties = penalties;
    if (dueDate) bill.dueDate = new Date(dueDate);

    bill.amount = bill.maintenanceCharges + bill.waterCharges + bill.parkingCharges + 
                  bill.electricityCommonCharges + bill.otherCharges + bill.penalties;

    if (bill.paidAmount >= bill.amount) {
      bill.status = 'Paid';
    } else if (bill.paidAmount > 0) {
      bill.status = 'Partially Paid';
    } else if (bill.dueDate < new Date()) {
      bill.status = 'Overdue';
    } else {
      bill.status = 'Pending';
    }

    bill.updatedBy = adminUserId;
    await bill.save();

    await logEvent({
      action: 'Password Change', 
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Updated maintenance bill ${bill.invoiceNumber}`
    });

    return bill;
  },

  deleteBill: async (billId, adminUserId, auditMeta = {}) => {
    const bill = await MaintenanceBill.findById(billId);
    if (!bill) {
      throw new AppError('Maintenance bill not found', 404);
    }

    bill.isDeleted = true;
    bill.updatedBy = adminUserId;
    await bill.save();

    await logEvent({
      action: 'Password Change',
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Deleted maintenance bill ${bill.invoiceNumber}`
    });

    return true;
  },

  runLateFeeCheck: async (penaltyRules = {}, adminUserId, auditMeta = {}) => {
    const { flatPenaltyAmount = 100 } = penaltyRules;

    const overdueBills = await MaintenanceBill.find({
      dueDate: { $lt: new Date() },
      status: { $in: ['Pending', 'Partially Paid'] },
    });

    let updatedCount = 0;

    for (const bill of overdueBills) {
      bill.status = 'Overdue';
      bill.penalties += flatPenaltyAmount;
      bill.amount += flatPenaltyAmount;
      bill.updatedBy = adminUserId;
      await bill.save();

      await Notification.create({
        recipient: bill.resident,
        title: 'Bill Overdue Alert',
        message: `Your maintenance bill ${bill.invoiceNumber} is overdue. A late fee penalty of $${flatPenaltyAmount} has been applied.`,
        type: 'Bill',
      });

      updatedCount++;
    }

    if (updatedCount > 0) {
      await logEvent({
        action: 'User Creation', 
        user: adminUserId,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        status: 'Success',
        details: `Late fee check completed. Applied $${flatPenaltyAmount} penalty to ${updatedCount} overdue bills.`,
      });
    }

    return { updatedCount };
  },

  getResidentBills: async (residentUserId) => {
    const bills = await MaintenanceBill.find({ resident: residentUserId }).sort({ year: -1, month: -1 });

    const totalPending = bills.reduce((acc, b) => {
      if (b.status !== 'Paid') {
        return acc + (b.amount - b.paidAmount);
      }
      return acc;
    }, 0);

    return {
      bills,
      totalPendingAmount: totalPending,
    };
  },

  getAdminBillingDashboard: async (query) => {
    const { status, month, year, search } = query;

    const filter = { isDeleted: { $ne: true } };
    if (status) filter.status = status;
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (search) {
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { resident: { $in: userIds } }
      ];
    }

    const bills = await MaintenanceBill.find(filter)
      .populate('resident', 'name email phone')
      .sort({ createdAt: -1 });

    const analytics = await MaintenanceBill.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$paidAmount' },
          totalBilled: { $sum: '$amount' },
          pendingAmount: {
            $sum: {
              $cond: [{ $ne: ['$status', 'Paid'] }, { $subtract: ['$amount', '$paidAmount'] }, 0],
            },
          },
          overdueCount: { $sum: { $cond: [{ $eq: ['$status', 'Overdue'] }, 1, 0] } },
        },
      },
    ]);

    const stats = analytics[0] || {
      totalRevenue: 0,
      totalBilled: 0,
      pendingAmount: 0,
      overdueCount: 0,
    };

    return {
      bills,
      statistics: {
        totalRevenue: stats.totalRevenue,
        totalBilled: stats.totalBilled,
        pendingAmount: stats.pendingAmount,
        overdueCount: stats.overdueCount,
        collectionRatePercent: stats.totalBilled > 0 ? (stats.totalRevenue / stats.totalBilled) * 100 : 0,
      },
    };
  },
};
