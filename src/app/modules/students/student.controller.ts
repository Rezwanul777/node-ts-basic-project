import { Request, Response } from 'express';
import { studentServices } from './student.service';
import studentZodValidationSchema from './student.validation';




const createStudent = async (req: Request, res: Response) => {
  try {

    const { student: studentData } = req.body;
    // joi validate data
    // const{error,value}=studentValidationSchema.validate(studentData);
    const zodParsedData=studentZodValidationSchema.parse(studentData);
    const result = await studentServices.createStudentIntoDB(zodParsedData);
  //   if(error){
  //     res.status(500).json({
  //       success: false,
  //       message: 'Something went wrong',
  //       error: error.details,
  //   })
    
  // }
    
    res.status(200).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    })
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message ||'Something went wrong',
      error: err,
    });
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
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message ||'Something went wrong',
      error: err,
    });;
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
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message ||'Something went wrong',
      error: err,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;
    const result = await studentServices.deleteStudentfromDB(studentID);
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message ||'Something went wrong',
      error: err,
    });
  }
}

export const studentControllers = {
  createStudent,
  getAllstudents,
  getSinglestudent,
  deleteStudent
};
