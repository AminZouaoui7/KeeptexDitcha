const request = require('supertest');
const app = require('../server');
const { User, Attendance, sequelize } = require('../models');

let authToken;
let testUser;
let testEmployee;

beforeAll(async () => {
  // Create test users
  testUser = await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });

  testEmployee = await User.create({
    name: 'Test Employee',
    email: 'employee@test.com',
    password: 'password123',
    role: 'employee'
  });

  // Login to get auth token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'password123'
    });

  authToken = loginResponse.body.token;
});

afterAll(async () => {
  await Attendance.destroy({ where: {} });
  await User.destroy({ where: {} });
  await sequelize.close();
});

beforeEach(async () => {
  await Attendance.destroy({ where: {} });
});

describe('Attendance System', () => {
  describe('POST /api/attendance - Upsert attendance', () => {
    it('should create new attendance record', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'present'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('present');
    });

    it('should update existing attendance record', async () => {
      // Create initial record
      await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'present'
        });

      // Update the same record
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'absent'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('absent');
    });

    it('should normalize status input', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'PRÉSENT'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('present');
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should enforce unique constraint on (userId, date)', async () => {
      // First record
      await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'present'
        });

      // Second record should update, not create duplicate
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testEmployee.id,
          date: '2024-12-01',
          status: 'conge'
        });

      expect(response.status).toBe(200);
      
      // Verify only one record exists
      const count = await Attendance.count({
        where: { user_id: testEmployee.id, date: '2024-12-01' }
      });
      expect(count).toBe(1);
    });
  });

  describe('GET /api/employees/:id/stats - Employee stats', () => {
    beforeEach(async () => {
      // Create test attendance records
      await Attendance.bulkCreate([
        { user_id: testEmployee.id, date: '2024-12-01', status: 'present' },
        { user_id: testEmployee.id, date: '2024-12-02', status: 'present' },
        { user_id: testEmployee.id, date: '2024-12-03', status: 'absent' },
        { user_id: testEmployee.id, date: '2024-12-04', status: 'conge' },
        { user_id: testEmployee.id, date: '2024-12-05', status: 'present' }
      ]);
    });

    it('should return correct counts for date range', async () => {
      const response = await request(app)
        .get(`/api/employees/${testEmployee.id}/stats?from=2024-12-01&to=2024-12-05`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({
        presents: 3,
        absents: 1,
        conges: 1
      });
    });

    it('should return 0 counts when no attendance records', async () => {
      const response = await request(app)
        .get(`/api/employees/${testEmployee.id}/stats?from=2024-12-10&to=2024-12-15`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        presents: 0,
        absents: 0,
        conges: 0
      });
    });

    it('should validate date format', async () => {
      const response = await request(app)
        .get(`/api/employees/${testEmployee.id}/stats?from=invalid&to=2024-12-05`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/employees - Employees with stats', () => {
    beforeEach(async () => {
      // Create attendance records for multiple employees
      await Attendance.bulkCreate([
        { user_id: testEmployee.id, date: '2024-12-01', status: 'present' },
        { user_id: testEmployee.id, date: '2024-12-02', status: 'absent' },
        { user_id: testEmployee.id, date: '2024-12-03', status: 'conge' }
      ]);
    });

    it('should return all employees with aggregated counts', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const employee = response.body.data.find(e => e.id === testEmployee.id);
      expect(employee).toBeDefined();
      expect(employee.present_j).toBe(1);
      expect(employee.absent_j).toBe(1);
      expect(employee.conge_j).toBe(1);
    });

    it('should return 0 counts for employees with no attendance', async () => {
      // Create another employee without attendance
      const newEmployee = await User.create({
        name: 'New Employee',
        email: 'new@test.com',
        password: 'password123',
        role: 'employee'
      });

      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${authToken}`);

      const employee = response.body.data.find(e => e.id === newEmployee.id);
      expect(employee.present_j).toBe(0);
      expect(employee.absent_j).toBe(0);
      expect(employee.conge_j).toBe(0);

      await newEmployee.destroy();
    });
  });
});

module.exports = { authToken };