import { Router } from "express";
import { pool } from "../utils/db.js";
import {protect} from "../middlewares/protect.js"

const companyRouter = Router();
companyRouter.use(protect)

companyRouter.get("/", async (req, res) => {
    let keyword = req.query.keyword
    
    let query = `
    SELECT
        c.comp_id,
        c.comp_name_thai,
        c.comp_name_eng,
        t.teamname,
        t.team_id
    FROM
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

companyRouter.post("/", async (req, res) => {

    const data = {
        ...req.body,
        created_at : new Date() ,
    }

    if(!data){
        return res.status(404).json({
            message: 'insert filed this reqeust is not have data.',
        });
    }

    try {
        let result = await pool.query(
            `INSERT INTO company (comp_name_eng, comp_name_thai, team_id, created_at)
            values ($1, $2, $3, $4)`,
            [
                data.companyEng,
                data.companyThai,
                data.team,
                data.created_at,
            ]
            );
            return res.json({
                message: result,
            });
    } catch (error) {
        return res.status(404).json({
            message: error.detail ,
        });
    }
});

companyRouter.put("/:id", async (req, res) => {
    let param = Number(req.params.id);

    const data = {
        ...req.body,
        updated_at : new Date(),
    }

    if (!data) {
        return res.json({
            message: 'Update failed. This request does not have data.',
        });
    }

    try {
        await pool.query(
            `UPDATE company 
            SET comp_name_eng = $1, 
                comp_name_thai = $2, 
                team_id = $3 ,
                updated_at = $4
            WHERE comp_id = $5`,
            [
                data.companyEng,
                data.companyThai,
                data.team,
                data.updated_at,
                param 
            ]
        );

        return res.json({
            message: "Company has been updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error can not update company",
            error: error.message
        });
    }
});



export default companyRouter;