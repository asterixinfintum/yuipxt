import User from '../../models/user';
import UserWallet from '../models/wallet';

async function createuserwallet(userid) {
    const platformuser = await User.findOne({ _id: userid });

    if (!platformuser) {
        throw new Error('no such user');
    }

    const user_spotwallet = await UserWallet.findOne({ owner: userid, wallettype: 'spot' });
    const user_marginwallet = await UserWallet.findOne({ owner: userid, wallettype: 'margin' });

    if (!user_spotwallet) {
        const spotwallet = new UserWallet({
            owner: platformuser._id,
            wallettype: 'spot'
        });

        // Save the new spotwallet to the database
        await spotwallet.save();

        console.log(spotwallet);
    }

    if (!user_marginwallet) {
        const marginwallet = new UserWallet({
            owner: platformuser._id,
            wallettype: 'margin'
        });

        // Save the new marginwallet to the database
        await marginwallet.save();

        console.log(marginwallet);
    }
}

export default createuserwallet;