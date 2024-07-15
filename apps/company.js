import { Router } from "express";
import {protect} from "../middlewares/protect.js"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const companyRouter = Router();
companyRouter.use(protect)

companyRouter.post('/teams', async (req, res) => {
  const { teamname } = req.body;

  try {
    const newTeam = await prisma.teams.create({
      data: {
        team_name : teamname,
      },
    });

    res.json({
      message: 'Team created successfully',
      data: newTeam,
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

companyRouter.get("/", async (req, res) => {
  
  const keyword = req.query.keyword;

  try {
    let companies;

    if (keyword) {
      companies = await prisma.company.findMany({
        where: {
          OR: [
            { comp_name_thai: { contains: keyword, mode: 'insensitive' } },
            { comp_name_eng: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        include: {
          team: true, // Include related team data
        },
        orderBy: {
          team: {
            team_id: 'asc', // Order by team_id
          },
        },
      });
    } else {
      companies = await prisma.company.findMany({
        include: {
          team: true, // Include related team data
        },
        orderBy: {
          team: {
            team_id: 'asc', // Order by team_id
          },
        },
      });
    }

    return res.json({
      data: companies,
    });

  } catch (error) {
    console.error('Error fetching company data:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});


companyRouter.post("/", async (req, res) => {
    const data = {
      ...req.body,
    };
  
    if (!data) {
      return res.status(400).json({
        message: 'Insert failed: Request body does not contain data.',
      });
    }
  
    try {
      const result = await prisma.company.create({
        data: {
          comp_name_eng: data.companyEng,
          comp_name_thai: data.companyThai,
          team_id: Number(data.team),
        },
      });
  
      return res.json({
        message: 'Company data inserted successfully.',
        data: result,
      });
  
    } catch (error) {
      console.error('Error inserting company data:', error);
      return res.status(500).json({
        message: 'Insert failed: Internal server error.',
        error: error.message,
      });
    }
});

companyRouter.put("/:id", async (req, res) => {
  const companyId = Number(req.params.id);

  const data = {
    ...req.body,
  };

  if (!data) {
    return res.status(400).json({
      message: 'Update failed. Request body does not contain data.',
    });
  }

  try {
    const updatedCompany = await prisma.company.update({
      where: {
        comp_id: companyId,
      },
      data: {
        comp_name_eng: data.companyEng,
        comp_name_thai: data.companyThai,
        team_id: Number(data.team),
        updated_at: data.updated_at,
      },
    });

    return res.json({
      message: 'Company updated successfully.',
      data: updatedCompany,
    });

  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({
      message: 'Update failed. Internal server error.',
      error: error.message,
    });
  }
});



export default companyRouter;