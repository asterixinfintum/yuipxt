import express from 'express';

import authenticateToken from '../../../utils/authenticateToken';

import User from '../../../models/user';
import { Error } from 'mongoose';

const admindashboardcontroller = express.Router();

admindashboardcontroller.post('/user/dashboard/marginwalletstate', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { marginwalletstate } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.marginwalletstate = marginwalletstate

                console.log(useritem.tailoreddashboard);
                await useritem.save();

                res.status(201).send({ message: 'updated' });
            } else {
                res.status(404).send({ error: 'error' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/spotwalletstate', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { spotwalletstate } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.spotwalletstate = spotwalletstate;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            } else {
                res.status(404).send({ error: 'error' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/autotrademarketpercentage', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { autotrademarketpercentage } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.autotrademarketpercentage = autotrademarketpercentage;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/autotrademarketstate', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { autotrademarketstate } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.autotrademarketstate = autotrademarketstate;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/autotrademarketfigure', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { autotrademarketfigure } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.autotrademarketfigure = autotrademarketfigure;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/myprofitpercentfromyesterday', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { myprofitpercentfromyesterday } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.myprofitpercentfromyesterday = myprofitpercentfromyesterday;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/myprofitpercent', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { myprofitpercent } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.myprofitpercent = myprofitpercent;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/profitsstate', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { profitsstate } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.profitsstate = profitsstate;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/myprofitvalue', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { myprofitvalue } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.myprofitvalue = myprofitvalue;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/tradeaccountmargin', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { tradeaccountmargin } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.tradeaccountmargin = tradeaccountmargin;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }
        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/tradeaccountdebt', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { tradeaccountdebt } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.tradeaccountdebt = tradeaccountdebt;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }
        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/tradeaccountequity', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { tradeaccountequity } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.tradeaccountequity = tradeaccountequity;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }
        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/updatetopassets', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;
            const { topassets } = req.body;

            const useritem = await User.findOne({ _id: userid });

            if (useritem) {
                useritem.tailoreddashboard.topassets = topassets;

                await useritem.save();

                res.status(201).send({ message: 'updated' });
            }

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

admindashboardcontroller.post('/user/dashboard/addmessage', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const { userid } = req.query;

            const message = req.body.message;
            const useritem = await User.findOne({ _id: userid });
            const notifications = [...useritem.notifications, {
                label: message,
                description: message
            }];

            const options = { new: true, upsert: true };

            const update = {
                $set: {
                    notifications
                }
            };

            await User.findOneAndUpdate({ _id: userid }, update, options);

            res.status(201).send({ message: 'user notifications updated' });
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'error adding message' });
        }
    }
});

export default admindashboardcontroller;