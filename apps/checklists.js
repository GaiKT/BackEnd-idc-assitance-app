import { Router } from 'express';
import { pool } from '../utils/db.js';
import { protect } from '../middlewares/protect.js';

const checklistsRouter = Router();
checklistsRouter.use(protect);

checklistsRouter.post('/', async (req, res) => {
    try {
        const formData = {
            ...req.body.formData,
            created_at : new Date(),
            updated_at : new Date(),
        };
        if (!formData) {
            return res.status(400).json({ message: 'Request body does not contain data.' });
        }

        const columns = Object.keys(formData);
        const values = Object.values(formData);
        const placeholders = values.map((value, index) => `$${index + 1}`).join(',');

        const query = `INSERT INTO ${req.body.name} (${columns.join(',')}) VALUES (${placeholders})`;

        console.log(query)

        await pool.query(query, values);

        return res.json({ message: 'Checklist data inserted successfully.'});
    } catch (error) {
        console.error('Error inserting checklist data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

export default checklistsRouter;
