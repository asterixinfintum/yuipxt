import User from '../models/user';

async function setofflineuser(userid) {
    if (!userid) {
        return;
    }

    try {
        const offlineuser = await User.findOne({ _id: userid });

        if (!offlineuser) {
            return; // or throw an error if appropriate
        }

        offlineuser.online = false;
        await offlineuser.save();
        return offlineuser;

    } catch (error) {
        console.log(error);
    }
}

export default setofflineuser;