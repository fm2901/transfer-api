import express from 'express'
const router = express.Router()
import { queryTransfers, getTransfersForUser } from '../services/clickhouse.js'

/**
 * @swagger
 * /api/transfers:
 *   get:
 *     summary: Получить переводы или сводную информацию
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: summary
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/transfers', async (req, res) => {
    const { name, from, to, summary } = req.query;
    if (!name || !from || !to) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    const result = await queryTransfers({ name, from, to, summary: summary === 'true' });
    res.json(result);
});

/**
 * @swagger
 * /api/check:
 *   get:
 *     summary: Проверка условий пользователя
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Результат проверки
 */
router.get('/check', async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const transfers = await getTransfersForUser(name);
    const result = checkUserTransfers(transfers);

    res.json(result);
});

/**
 * Проверка условий:
 * 1. ≥ 6 переводов за год
 * 2. Интервалы ≥ 90 дней
 * 3. Последний перевод ≤ 60 дней
 */
function checkUserTransfers(transfers) {
    const response = {
        passed: true,
        reasons: []
    };

    if (transfers.length < 6) {
        response.passed = false;
        response.reasons.push('Менее 6 переводов за последний год');
    }

    const sorted = transfers.sort((a, b) => new Date(a.date) - new Date(b.date));
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1].date);
        const curr = new Date(sorted[i].date);
        const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diffDays > 90) {
            response.passed = false;
            response.reasons.push('Интервалы между переводами более 90 дней');
            break;
        }
    }

    const last = new Date(sorted[sorted.length - 1]?.date);
    const now = new Date();
    const diffLast = (now - last) / (1000 * 60 * 60 * 24);
    if (diffLast > 60) {
        response.passed = false;
        response.reasons.push('Последний перевод был более 60 дней назад');
    }

    return response;
}

export default router;
