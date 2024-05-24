import { Router } from 'express';
import { pool } from '../utils/db.js';
import { protect } from '../middlewares/protect.js';

const checklistsRouter = Router();
checklistsRouter.use(protect);

checklistsRouter.get('/:checklistName', async (req, res) => {
    try {
        const checklistName = req.params.checklistName;
        const { str, end } = req.query;
        let result ;

        // Validate checklistName to ensure it's a safe identifier
        if (!checklistName || !/^[a-zA-Z0-9_]+$/.test(checklistName)) {
            return res.status(400).json({ message: 'Invalid checklist name.' });
        }

        // Validate dates
        if (!str || !end) {
            const query = `
            SELECT c.*, u.firstname
            FROM checklist${checklistName} c
            INNER JOIN users u ON c.user_id = u.user_id
            ORDER BY c.created_at DESC;`;

            result = await pool.query(query);
        }else{
            const query = `
            SELECT c.*, u.firstname
            FROM checklist${checklistName} c
            INNER JOIN users u ON c.user_id = u.user_id
            WHERE c.created_at BETWEEN $1 AND $2
            ORDER BY c.created_at DESC;`;

            const startDate = new Date(str);
            const endDate = new Date(end);

            if (isNaN(startDate) || isNaN(endDate)) {
                return res.status(400).json({ message: 'Invalid date format.' });
            }

            result = await pool.query(query, [startDate, endDate]);
        }
        

        // Return the results
        return res.json(result.rows);
        
    } catch (error) {
        console.error('Error fetching checklist data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


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

        await pool.query(query, values);

        return res.json({ message: 'Checklist data inserted successfully.'});
    } catch (error) {
        console.error('Error inserting checklist data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

checklistsRouter.put('/', async (req, res) => {
    try {
        const  id  = Number(req.body.formData.id);
        const { name, formData } = req.body;

        delete formData.id
        delete formData.firstname
        delete formData.created_at
        formData.updated_at = new Date ()

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing table name.' });
        }

        if (!formData || typeof formData !== 'object') {
            return res.status(400).json({ message: 'Invalid or missing form data.' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Missing checklist ID for update.' });
        }

        const columns = Object.keys(formData);
        const values = Object.values(formData);

        // Constructing SET clause for the update query
        const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(',');

        const query = `UPDATE ${name} SET ${setClause} WHERE id = $${columns.length + 1}`;
        values.push(id);

        await pool.query(query, values);

        return res.json({ message: 'Checklist data updated successfully.' });
    } catch (error) {
        console.error('Error updating checklist data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


export default checklistsRouter;
