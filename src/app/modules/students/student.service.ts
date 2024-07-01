import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  if(await Student.isUserExists(studentData.id)){
    throw new Error('User already exists');
   }
   const result = await Student.create(studentData); // built in stattic Method
 
 //staic method

 
  //const student = new Student(studentData);// create a new instance method

 // whether user exist or not
 
//  if(await student.isUserExists(studentData.id)){
//    throw new Error('User already exists'); // custom error handling method
//  }

  //const result = await student.save(); // built in instance method

  return result;
};

const getAllStudentfromDB = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentfromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id } }]); // using aggregate
  return result;

};
const deleteStudentfromDB = async (id: string) => {
  const result = await Student.updateOne({ id },{isDeleted:true});
  return result;
};

export const studentServices = {
  createStudentIntoDB,
  getAllStudentfromDB,
  getSingleStudentfromDB,
  deleteStudentfromDB
};
