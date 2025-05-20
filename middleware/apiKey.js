import ipRangeCheck from 'ip-range-check';
import { getApiKeyAccess } from '../services/clickhouse.js';


export default async function (req, res, next) {
    const key = req.headers['x-api-key'];
    const ip = req.ip.replace(/^.*:/, ''); // IPv6 fallback

    console.log(`key = ${key}`)
    console.log(req.connection.remoteAddress)

    if (!key) return res.status(401).json({ error: 'Missing API key' });

    const allowedIPs = await getApiKeyAccess(key);

    if (!allowedIPs || allowedIPs.length === 0) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    const isAllowed = ipRangeCheck(ip, allowedIPs);
    if (!isAllowed) {
        return res.status(403).json({ error: 'IP not allowed for this API key' });
    }

    next();
};
