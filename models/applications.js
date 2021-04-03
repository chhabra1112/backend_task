import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema({
    seeker:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    job_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
    
})

var Applications = mongoose.model('Application', applicationSchema);

export default Applications;