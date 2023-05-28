import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    email: {type: String, required: false},
    phoneNumber: {type: String, required: false},
    date: {type: Date, required: true},

})

const employeeModel = mongoose.model('Employee', EmployeeSchema);

export default employeeModel;