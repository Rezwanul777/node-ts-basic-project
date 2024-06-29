import { Request, Response } from 'express';
import { studentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const result = await studentServices.createStudentIntoDB(studentData);
    res.status(200).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllstudents = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllStudentfromDB();
    res.status(200).json({
      success: true,
      message: 'Students get successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSinglestudent = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;
    const result = await studentServices.getSingleStudentfromDB(studentID);
    res.status(200).json({
      success: true,
      message: 'Students get successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const studentControllers = {
  createStudent,
  getAllstudents,
  getSinglestudent,
};
