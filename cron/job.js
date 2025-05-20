import cron from 'node-cron';
import {fetchDataFromExternalDB} from "../services/fetchExternal.js";
import {insertTransfers} from '../services/clickhouse.js'
import { CRON_TIME } from '../config.js'

cron.schedule(CRON_TIME, async () => {
    console.log('[CRON] Fetching data from external DB...');
    const data = await fetchDataFromExternalDB();
    await insertTransfers(data);
    console.log('[CRON] Data inserted into ClickHouse.');
});
