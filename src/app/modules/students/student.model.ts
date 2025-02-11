
import * as validator from 'validator';
import { Schema, model } from 'mongoose';

import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
 
} from './student.interface';

import bcrypt from 'bcrypt';
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
    validate:{
      validator:function(value:string) {
        const firstNameStr=value.charAt(0).toUpperCase()+value.slice(1)
        return firstNameStr==value
      },
      message:'{VALUE} is not capitalized formate'
    }
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
    validate:{
      validator:(value:string)=>validator.isAlpha(value),
      message:'{VALUE} is not alphabetic'
    }
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, 'Father Name is required'],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No is required'],
  },
});


const localGuradianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
});

const studentSchema = new Schema<TStudent,StudentModel>({
  
    id: { type: String, required: [true, 'ID is required'], unique: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      maxlength: [20, 'Password can not be more than 20 characters'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate:{
        validator:(value:string)=>validator.isEmail(value),
        message:'{VALUE} is not a valid email format'
      }
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloogGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuradianSchema,
      required: [true, 'Local guardian information is required'],
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: {
        values: ['active', 'blocked'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
    isDeleted:{
      type: Boolean,
      default: false,
    }
},{
  toJSON:{
    virtuals:true
  }
}

);

// virtual Mongoose database -- it helps no need to store database. it works from database fields.
studentSchema.virtual('fullName').get(function(){
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
}) 

// create pre save mongoose Middlewarw/hook

studentSchema.pre('save', async function (next) {
  //console.log(this, 'pre hook : we will save  data');
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user=this // here this is used for reference, that means before saving indatabase it will do hashing then it will save into Db
  // hashing password save into DB
user.password=await bcrypt.hash(user.password,Number(config.bcrypt_salt_rounds))
 next()
 
});

// post save middleware / hook
studentSchema.post('save', function (doc,next) {
  // after saving password
  doc.password="";
  next()
 
});

// QueryMiiddleware / hook

studentSchema.pre('find', function(next){
  this.find({isDeleted:{$ne:true}})  // here this is used for reference, that means that before execution getalldata queries this find is executed then service data find will executue for filtering data.then we get filter data from database.
  next()
})
studentSchema.pre('findOne',function(next){
  this.find({isDeleted:{$ne:true}})  
  next()
})

// aggregration used for filtering data
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// craeting static Method
studentSchema.statics.isUserExists=async function(id: string){
  const existingUser= await Student.findOne({id});
  return existingUser
}

// creating a custome instance method

//create a custome instance method

// studentSchema.methods.isUserExists=async function(id: string){
//   const existingUser= await Student.findOne({id});
//   return existingUser
// }

export const Student = model<TStudent,StudentModel>('Student', studentSchema);
