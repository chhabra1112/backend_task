import mongoose from 'mongoose';

const jobSchema = mongoose.Schema({
    company:String,
    jp:String,
    jd:String,
    hr:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    
})

var Jobs = mongoose.model('Job', jobSchema);

export default Jobs;