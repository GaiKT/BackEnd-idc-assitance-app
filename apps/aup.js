import { Router } from "express";
import { pool } from "../utils/db.js";
import {protect} from "../middlewares/protect.js"

const aupRouter = Router();
aupRouter.use(protect)

aupRouter.get("/", async (req, res) => {
    let keyword = req.query.keyword
    
    if(keyword){
        try {
            const memberData = await pool.query(`
            SELECT
                m.member_id,
                m.comp_id,
                m.first_name,
                m.last_name,
                m.address,
                m.date_of_sign,
                m.created_at,
                m.card_id,
                c.comp_name_eng,
                c.comp_name_thai,
                t.teamname,
                t.team_id
            FROM
                members m    
            INNER JOIN company c ON m.comp_id = c.comp_id
            INNER JOIN teams t ON c.team_id = t.team_id
            WHERE
                m.first_name ILIKE $1 OR
                m.last_name ILIKE $1 OR
                m.address ILIKE $1 OR
                c.comp_name_eng ILIKE $1 OR
                c.comp_name_thai ILIKE $1 OR
                t.teamname ILIKE $1;`, [`%${keyword}%`]
            );
            return res.json({
            data: memberData.rows,
            });
        } catch (error) {
            return res.json({
                message : error,
            });
        }

    }else{
        try {
            const memberData = await pool.query(`
            SELECT
                m.member_id,
                m.comp_id,
                m.first_name,
                m.last_name,
                m.address,
                m.date_of_sign,
                m.created_at,
                m.card_id,
                c.comp_name_eng,
                c.comp_name_thai,
                t.teamname,
                t.team_id
            FROM
                members m
            INNER JOIN
                company c ON m.comp_id = c.comp_id
            INNER JOIN
                teams t ON c.team_id = t.team_id;`);
            return res.json({
            data: memberData.rows,
            });
        } catch (error) {
            return res.json({
                message : error,
            });
        }
    }
});

aupRouter.get("/company",async(req,res)=>{
    try {
        const result = await pool.query(`
        SELECT
            teams.team_id,
            teams.teamname,
            COALESCE(
                ARRAY_AGG(
                    json_build_object(
                        'comp_id', company.comp_id,
                        'comp_name_eng', company.comp_name_eng,
                        'comp_name_thai', company.comp_name_thai
                    )
                ),
                '{}'::json[]
            ) AS company_info
        FROM
            teams
        LEFT JOIN
            company ON teams.team_id = company.team_id
        GROUP BY
            teams.team_id, teams.teamname;
        `) 

        return res.json({
            data : result.rows,
          });
    } catch (error) {
        return res.json({
            message : error,
          });
    }
})

aupRouter.post("/", async (req, res) => {

    const data = {
        ...req.body,
        created_at: new Date()
    }

    if(!data){
        return res.status(404).json({
            message: 'insert filed this reqeust is not have data.',
        });
    }

    try {
        let result = await pool.query(
            `INSERT INTO members (comp_id, first_name, last_name, address, date_of_sign, created_at, card_id)
            values ($1, $2, $3, $4, $5 , $6 ,$7)`,
            [
                data.company,
                data.firstName,
                data.lastName,
                data.address,
                data.dateOfSign,
                data.created_at,
                data.cardid,
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

aupRouter.put("/:id", async (req, res) => {
    let param = Number(req.params.id);

    const data = {
        ...req.body,
        updated_at: new Date()
    }

    console.log(param)

    if (!data) {
        return res.json({
            message: 'Update failed. This request does not have data.',
        });
    }

    try {
        await pool.query(
            `UPDATE members 
            SET comp_id = $1, 
                first_name = $2, 
                last_name = $3, 
                address = $4, 
                date_of_sign = $5, 
                updated_at = $6, 
                card_id = $7
            WHERE member_id = $8`,
            [
                data.company,
                data.firstName,
                data.lastName,
                data.address,
                data.dateOfSign,
                data.updated_at,
                data.cardid,
                param 
            ]
        );

        return res.json({
            message: "Member has been updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error updating member",
            error: error.message
        });
    }
});



export default aupRouter;