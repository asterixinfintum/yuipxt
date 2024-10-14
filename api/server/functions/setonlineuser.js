import User from '../models/user';
import jwt from 'jsonwebtoken';

async function setonlineuser(token) {
    if (!token) {
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.secretKeyJWT);

        const onlineuser = await User.findOne({ _id: decoded._id });
        if (!onlineuser) {
            return; // or throw an error if appropriate
        }

        onlineuser.online = true;
        await onlineuser.save();
        return onlineuser;

    } catch (error) {
        console.log(error);
        // Optionally rethrow the error or handle it as appropriate
    }
}

export default setonlineuser;