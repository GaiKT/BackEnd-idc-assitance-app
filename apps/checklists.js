import { Router } from 'express';
import { pool } from '../utils/db.js';
import { protect } from '../middlewares/protect.js';

const checklistsRouter = Router();
checklistsRouter.use(protect);

checklistsRouter.get("/reccord", async (req, res)=>{
    let checklistName = req.query.checklistName
    let query = `
    SELECT c.* , u.firstname
    FROM checklist${checklistName} c
    INNER JOIN users u ON c.user_id = u.user_id
    ORDER BY updated_at DESC;
    `;

        try {
            const roomTempData = await pool.query(query);
            return res.json({
                data: roomTempData.rows,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
})

checklistsRouter.get("/", async (req, res) => {
    let keyword = req.query.keyword
    
    let query = `
    SELECT
        c.comp_id,
        c.comp_name_thai,
        c.comp_name_eng,
        t.teamname,
        t.team_id
    FROMcd
        company c    
    INNER JOIN teams t ON c.team_id = t.team_id`;

    if (keyword) {
        query += `
            WHERE
            c.comp_name_thai ILIKE $1 OR
            c.comp_name_eng ILIKE $1 OR
            t.teamname ILIKE $1`;
    }

    query += " ORDER BY t.team_id";

    try {
        const companyData = await pool.query(query, keyword ? [`%${keyword}%`] : []);
        return res.json({
            data: companyData.rows,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
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
        const formData = {
            ...req.body.formData,
            updated_at: new Date(),
        };

        if (!formData) {
            return res.status(400).json({ message: 'Request body does not contain data.' });
        }

        const columns = Object.keys(formData);
        const values = Object.values(formData);

        // Constructing SET clause for the update query
        const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(',');

        const query = `UPDATE ${req.body.name} SET ${setClause}`;

        await pool.query(query, values);

        return res.json({ message: 'Checklist data updated successfully.' });
    } catch (error) {
        console.error('Error updating checklist data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


export default checklistsRouter;
