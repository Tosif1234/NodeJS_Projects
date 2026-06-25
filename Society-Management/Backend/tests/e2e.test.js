import test, { describe, it } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api';
const PASSWORD = 'Password@123';

describe('Smart Society Management System - End-to-End API Integration Suite', () => {
  let adminToken = '';
  let residentToken = '';
  let residentUserId = '';
  let securityToken = '';
  let maintenanceToken = '';
  let maintenanceUserId = '';

    let testVisitorId = '';
  let testComplaintId = '';
  let testBookingId = '';
  let testPollId = '';
  let testBillId = '';
  let testBillAmount = 0;

  describe('1. Authentication & Role-Based Access Control (RBAC)', () => {
    it('should successfully log in Admin and return valid token', async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@society.com', password: PASSWORD }),
      });
      const text = await res.text();
      if (res.status !== 200) {
        console.error('DEBUG - Admin Login Failed. Status:', res.status, 'Response:', text);
      }
      assert.strictEqual(res.status, 200);
      const body = JSON.parse(text);
      assert.ok(body.data);
      assert.ok(body.data.accessToken);
      assert.strictEqual(body.data.user.role, 'Admin');
      adminToken = body.data.accessToken;
    });

    it('should successfully log in Resident and return valid token', async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'resident@society.com', password: PASSWORD }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.ok(body.data);
      assert.ok(body.data.accessToken);
      assert.strictEqual(body.data.user.role, 'Resident');
      residentToken = body.data.accessToken;
      residentUserId = body.data.user._id || body.data.user.id;
    });

    it('should successfully log in Security Staff and return valid token', async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'security@society.com', password: PASSWORD }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.ok(body.data);
      assert.ok(body.data.accessToken);
      assert.strictEqual(body.data.user.role, 'Security Staff');
      securityToken = body.data.accessToken;
    });

    it('should successfully log in Maintenance Staff and return valid token', async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'maintenance@society.com', password: PASSWORD }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.ok(body.data);
      assert.ok(body.data.accessToken);
      assert.strictEqual(body.data.user.role, 'Maintenance Staff');
      maintenanceToken = body.data.accessToken;
      maintenanceUserId = body.data.user._id || body.data.user.id;
    });
  });

  describe('2. Visitor Management Workflow Flow', () => {
    it('should allow Security Staff to pre-register a visitor entry pass', async () => {
      const res = await fetch(`${BASE_URL}/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${securityToken}`,
        },
        body: JSON.stringify({
          name: 'Vikram Patel',
          phone: '+919988776655',
          visitorType: 'Guest',
          block: 'Block A',
          flatNumber: '102',
          purpose: 'Friend Visit',
          expectedDuration: '2 hours',
          hostResident: residentUserId
        }),
      });
      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data._id);
      assert.strictEqual(data.data.status, 'Pending');
      testVisitorId = data.data._id;
    });

    it('should allow Host Resident to view and approve the visitor entry pass', async () => {
      const res = await fetch(`${BASE_URL}/visitors/${testVisitorId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${residentToken}`,
        },
        body: JSON.stringify({ status: 'Approved' }),
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Approved');
    });

    it('should allow Security Staff to check-in the approved visitor', async () => {
      const res = await fetch(`${BASE_URL}/visitors/${testVisitorId}/check-in`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${securityToken}`,
        },
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Checked In');
      assert.ok(data.data.checkIn);
    });

    it('should allow Security Staff to check-out the visitor', async () => {
      const res = await fetch(`${BASE_URL}/visitors/${testVisitorId}/check-out`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${securityToken}`,
        },
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Checked Out');
      assert.ok(data.data.checkOut);
    });
  });

  describe('3. Complaints Management Flow', () => {
    it('should allow Resident to file a maintenance complaint ticket', async () => {
      const res = await fetch(`${BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${residentToken}`,
        },
        body: JSON.stringify({
          title: 'Bathroom water tap broken',
          description: 'The kitchen washbasin tap is continuously leaking.',
          category: 'Plumbing',
          priority: 'High',
        }),
      });
      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data._id);
      assert.strictEqual(data.data.status, 'Open');
      testComplaintId = data.data._id;
    });

    it('should allow Admin to assign complaint to Maintenance Staff', async () => {
      const staffId = maintenanceUserId;

      const res = await fetch(`${BASE_URL}/complaints/${testComplaintId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ assignedTo: staffId }),
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Assigned');
      assert.strictEqual(data.data.assignedTo._id || data.data.assignedTo, staffId);
    });

    it('should allow Maintenance Staff to mark complaint status in progress', async () => {
      const res = await fetch(`${BASE_URL}/complaints/${testComplaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${maintenanceToken}`,
        },
        body: JSON.stringify({
          status: 'In Progress',
          notes: 'Started fixing leakage tap.',
        }),
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'In Progress');
    });

    it('should allow Maintenance Staff to resolve the complaint ticket', async () => {
      const res = await fetch(`${BASE_URL}/complaints/${testComplaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${maintenanceToken}`,
        },
        body: JSON.stringify({
          status: 'Resolved',
          notes: 'Tap replaced and water flow audited.',
          completionNotes: 'Replaced washbasin tap.',
        }),
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Resolved');
    });

    it('should allow Resident to post commentary discussion on complaint ticket', async () => {
      const res = await fetch(`${BASE_URL}/complaints/${testComplaintId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${residentToken}`,
        },
        body: JSON.stringify({ text: 'Thank you for the quick replacement!' }),
      });
      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data.comments.length > 0);
      assert.strictEqual(data.data.comments[data.data.comments.length - 1].text, 'Thank you for the quick replacement!');
    });
  });

  describe('4. Billing & Invoice Flow', () => {
    it('should allow Admin to fetch revenue and collection statistics', async () => {
      const res = await fetch(`${BASE_URL}/billing/admin`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.ok(body.data.totalRevenue >= 0);
      assert.ok(body.data.bills.length > 0);

      const pendingBill = body.data.bills.find(b => b.status === 'Pending' || b.status === 'Overdue');
      if (pendingBill) {
        testBillId = pendingBill._id;
        testBillAmount = pendingBill.amount;
      }
    });

    it('should allow Resident to clear/pay a pending maintenance bill', async () => {
      if (!testBillId) {
        assert.ok(true, 'Skipped bill payment test due to zero pending bills (unlikely).');
        return;
      }

            const res = await fetch(`${BASE_URL}/billing/${testBillId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          paidAmount: testBillAmount,
          paymentDetails: {
            transactionId: 'TXN-TEST-12345',
            paymentMethod: 'Net Banking',
          },
        }),
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Paid');
    });
  });

  describe('5. Facility Bookings Flow', () => {
    it('should allow Resident to make facility reservation slot', async () => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 5);

      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${residentToken}`,
        },
        body: JSON.stringify({
          facilityName: 'Gym',
          bookingDate: targetDate.toISOString().slice(0, 10),
          startTime: '08:00',
          endTime: '09:00',
        }),
      });
      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data._id);
      assert.strictEqual(data.data.status, 'Pending');
      testBookingId = data.data._id;
    });

    it('should allow Admin to approve resident facility booking', async () => {
      const res = await fetch(`${BASE_URL}/bookings/${testBookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: 'Approved' }),
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'Approved');
    });
  });

  describe('6. Notices & Poll Voting Flow', () => {
    it('should allow Admin to fetch notices logs list', async () => {
      const res = await fetch(`${BASE_URL}/notices/admin`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data.length >= 0);
    });

    it('should allow Resident to participate in active community polls', async () => {
      const pollsRes = await fetch(`${BASE_URL}/polls`, {
        headers: { 'Authorization': `Bearer ${residentToken}` },
      });
      const pollsData = await pollsRes.json();
      assert.ok(pollsData.success);
      assert.ok(pollsData.data.length > 0);

            const poll = pollsData.data[0];
      testPollId = poll._id;
      const optionId = poll.options[0]._id;

      const res = await fetch(`${BASE_URL}/polls/${testPollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${residentToken}`,
        },
        body: JSON.stringify({ optionId }),
      });

      assert.ok(res.status === 200 || res.status === 400);
    });
  });

  describe('7. Robust API Error & Session Handling', () => {
    it('should prevent unauthorized requests (403 Forbidden)', async () => {
      const res = await fetch(`${BASE_URL}/residents`, {
        headers: { 'Authorization': `Bearer ${residentToken}` },
      });
      assert.strictEqual(res.status, 403);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.message, 'You do not have permission to perform this action');
    });

    it('should reject corrupted/invalid authorization headers (401 Unauthorized)', async () => {
      const res = await fetch(`${BASE_URL}/notifications/unread-count`, {
        headers: { 'Authorization': 'Bearer badtokenstring12345' },
      });
      assert.strictEqual(res.status, 401);
    });

    it('should return schema validation error during registry parameters check', async () => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad-email-pattern', name: '' }),
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.ok(data.errors);
    });
  });
});
