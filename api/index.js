const express = require('express');
const router = express.Router();
module.exports = router;

const SHARED = require('../shared');

const userBalances = {
    "user-1": {
        "BTC": 0.5,
        "ETH": 2
    },
    "user-2": {
        "BTC": 0.1,
    },
    "user-3": {
        "ETH": 5,
    },
}

const BITSTAMP_API = "https://www.bitstamp.net/api/v2/ticker";
const groups = {
    "BTC": {
        "USD": {
            "api": `${BITSTAMP_API}/btcusd`
        }
    },
    "ETH": {
        "USD": {
            "api": `${BITSTAMP_API}/ethusd`
        }
    },
}

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userBalance = userBalances[id];
        if (!userBalance) throw "Invalid user";

        let latest_price = {}, total_balance = {}
        for (let i in Object.keys(userBalance)) {
            const key = Object.keys(userBalance)[i];
            total_balance[key] = {
                "balance_in_unit": userBalance[key],
                "value": 0,
                "value_unit": "USD",
            };
            let bitstamp_api = "";
            if (groups[key]) bitstamp_api = groups[key]["USD"]["api"];
            latest_price[key] = await SHARED.GET(bitstamp_api);
            latest_price[key]["price_unit"] = "USD";
            latest_price[key]["balance"] = userBalance[key] * latest_price[key]["last"];
            total_balance[key]["value"] = latest_price[key]["balance"];
        }

        let total_in_usd = 0;
        for (let i in Object.keys(total_balance)) {
            const key = Object.keys(total_balance)[i];
            total_in_usd += total_balance[key]["value"];
        }
        total_balance["total"] = {
            "balance_in_unit": 0,
            "value": total_in_usd.toFixed(2),
            "value_unit": "USD",
        };

        res.status(200).json(total_balance);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});