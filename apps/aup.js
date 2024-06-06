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

aupRouter.get("/new-members-weekly", async (req, res) => {
    try {
        let resultNewMembersWeekly = await pool.query(`
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
            FROM members m    
            INNER JOIN company c ON m.comp_id = c.comp_id
            INNER JOIN teams t ON c.team_id = t.team_id
            WHERE date_of_sign BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE
            ORDER BY team_id
        `);

        let resultNewCompanyWeekly = await pool.query(`
            SELECT c.* , t.teamname
            FROM company c
            INNER JOIN teams t ON c.team_id = t.team_id
            WHERE created_at >= current_date - interval '6 days' AND created_at <= current_date + interval '1 day';
        `);

        let resultAvgRoomtemp = await pool.query(`
            SELECT t.tr_ch1, t.tr_ch2, t.tr_ch3 , t.outside_temp , t.outside_hum , t.tr_room_temp , t.tr_room_hum
            FROM checklistroomtemp t
            ORDER BY created_at DESC
            LIMIT 2;
        `);

        let resultAvgFdc = await pool.query(`
            SELECT fdc.fdc_phase1 , fdc.fdc_phase2
            FROM checklistfdc fdc
            ORDER BY created_at DESC
            LIMIT 2;
        `);

        let resultAvgPhase1 = await pool.query(`
            SELECT p1.main_meter, p1.atsphase1_meter, p1.emdb_meter, p1.airdb_meter
            FROM checklistphase1 p1
            ORDER BY created_at DESC
            LIMIT 2;
        `);

        let resultAvgPhase2 = await pool.query(`
            SELECT p2.main_meter, p2.atsphase2_meter, p2.emdb_meter, p2.airdb_meter
            FROM checklistphase2 p2
            ORDER BY created_at DESC
            LIMIT 2;
        `);

        return res.json({
            data: {
                newMembers: resultNewMembersWeekly.rows,
                newCompany: resultNewCompanyWeekly.rows,
                avgTranformer : resultAvgRoomtemp.rows,
                newfdc : resultAvgFdc.rows,
                avgPhase1 : resultAvgPhase1.rows,
                avgPhase2 : resultAvgPhase2.rows,
            }
        });
    } catch (error) {
        console.error("Error in API endpoint /new-members-weekly:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


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

    if(!param) {
        return res.json({
            message: 'Update failed. This request does not have param ID.',
        });
    }

    if (!data) {
        return res.json({
            message: 'Update failed. This request does not have data.',
        });
    }

    try {

        delete data.member_id
        delete data.teamname
        delete data.team_id
        delete data.comp_name_eng
        delete data.comp_name_thai

        const columns = Object.keys(data);
        const values = Object.values(data);

        const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(',');

        const query = `UPDATE members SET ${setClause} WHERE member_id = $${columns.length + 1}`;
        values.push(param)

        await pool.query(query,values);

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