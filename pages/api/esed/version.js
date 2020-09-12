module.exports = async (req, res) => {
    res.json({ version: process.env.SCRIPT_VERSION })
    if (req.query.name) {
        const user = await User.findOne({ tg: req.query.tg })
        if (user) {
            if (!user.name || (user.name != req.query.name)) {
                await User.updateOne({ tg: req.query.tg }, { name: req.query.name })
            }
        }
    }
}