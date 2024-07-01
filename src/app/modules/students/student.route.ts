import express from 'express';
import { studentControllers } from './student.controller';

const router = express.Router();

router.post('/create-student', studentControllers.createStudent);
router.get('/', studentControllers.getAllstudents);
router.get('/:studentID', studentControllers.getSinglestudent);
router.delete('/:studentID', studentControllers.deleteStudent);

export const StudentRoutes = router;
