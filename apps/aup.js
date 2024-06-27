import { Router } from "express";
import { PrismaClient } from '@prisma/client'
import {protect} from "../middlewares/protect.js"

const prisma = new PrismaClient()
const aupRouter = Router();
// aupRouter.use(protect)


aupRouter.get("/", async (req, res) => {
  const keyword = req.query.keyword;

  try {
    let members;

    if (keyword) {
      // Search members by keyword
      members = await prisma.members.findMany({
        where: {
          OR: [
            { first_name: { contains: keyword, mode: 'insensitive' } },
            { last_name: { contains: keyword, mode: 'insensitive' } },
            { address: { contains: keyword, mode: 'insensitive' } },
            { company: { comp_name_eng: { contains: keyword, mode: 'insensitive' } } },
            { company: { comp_name_thai: { contains: keyword, mode: 'insensitive' } } },
            { company: { team: { team_name: { contains: keyword, mode: 'insensitive' } } } },
          ],
        },
        include: {
          company: {
            include: {
              team: true,
            },
          },
        },
      });
    } else {
      // Fetch all members with company and team details
      members = await prisma.members.findMany({
        include: {
          company: {
            include: {
              team: true,
            },
          },
        },
      });
    }

    return res.json({
      data: members,
    });

  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } 
});


aupRouter.get("/company", async (req, res) => {
    try {
      const teamsWithCompanies = await prisma.teams.findMany({
        select: {
          team_id: true,
          team_name: true,
          companies: {
            select: {
              comp_id: true,
              comp_name_eng: true,
              comp_name_thai: true,
            },
          },
        },
      });
  
      return res.json({
        data: teamsWithCompanies,
      });
  
    } catch (error) {
      console.error("Fetch team and company info error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  });
  
  aupRouter.get("/new-members-weekly", async (req, res) => {
    try {
      // Fetch new members weekly
      const resultNewMembersWeekly = await prisma.members.findMany({
        where: {
          date_of_sign: {
            gte: new Date(new Date().setDate(new Date().getDate() - 6)), // Date of sign within the last 7 days
            lte: new Date(), // Today's date
          },
        },
        include: {
          company: {
            select: {
              comp_id: true,
              comp_name_eng: true,
              comp_name_thai: true,
              team: {
                select: {
                  teamname: true,
                  team_id: true,
                },
              },
            },
          },
        },
        orderBy: {
          team_id: 'asc',
        },
      });
  
      // Fetch new companies created weekly
      const resultNewCompanyWeekly = await prisma.company.findMany({
        where: {
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 6)), // Companies created within the last 7 days
            lte: new Date(), // Today's date
          },
        },
        include: {
          team: {
            select: {
              teamname: true,
            },
          },
        },
      });
  
      // Fetch average transformer room temperature
      const resultAvgRoomtemp = await prisma.checklistRoomTemp.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 2,
      });
  
      // Fetch average FDC data
      const resultAvgFdc = await prisma.checklistFdc.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 2,
      });
  
      // Fetch average Phase 1 data
      const resultAvgPhase1 = await prisma.checklistPhase1.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 2,
      });
  
      // Fetch average Phase 2 data
      const resultAvgPhase2 = await prisma.checklistPhase2.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 2,
      });
  
      return res.json({
        data: {
          newMembers: resultNewMembersWeekly,
          newCompany: resultNewCompanyWeekly,
          avgTranformer: resultAvgRoomtemp,
          newfdc: resultAvgFdc,
          avgPhase1: resultAvgPhase1,
          avgPhase2: resultAvgPhase2,
        },
      });
  
    } catch (error) {
      console.error("Error in API endpoint /new-members-weekly:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  });
  

// create members
aupRouter.post("/", async (req, res) => {

    const newMember = req.body;

    if(!newMember){
        return res.status(404).json({
            message: 'insert filed this reqeust is not have data.',
        });
    }

    try {
            // Create new member
            const createdMember = await prisma.members.create({
                data: {
                comp_id: Number(newMember.comp_id),
                first_name: newMember.first_name,
                last_name: newMember.last_name,
                address: newMember.address,
                date_of_Sign: new Date(newMember.date_of_sign),
                card_id: newMember.card_id,
                },
            });
            return res.status(201).json({
                message: "Member created successfully",
                member: createdMember,
            });

    } catch (error) {
        return res.status(500).json({
          message: "Create member error:" + error,
        });
    }
});

//update members
aupRouter.put("/:id", async (req, res) => {
  const memberId = Number(req.params.id);
  const updatedMember = req.body;

  try {
    // Check if member exists
    const existingMember = await prisma.members.findUnique({
      where: {
        member_id: memberId,
      },
    });

    if (!existingMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Update member
    const updatedMemberData = await prisma.members.update({
      where: {
        member_id: memberId,
      },
      data: {
        comp_id: Number(updatedMember.comp_id),
        first_name: updatedMember.first_name,
        last_name: updatedMember.last_name,
        address: updatedMember.address,
        date_of_Sign: new Date(updatedMember.date_of_Sign),
        card_id: updatedMember.card_id,
      },
    });

    return res.status(200).json({
      message: "Member updated successfully",
      member: updatedMemberData,
    });

  } catch (error) {
    console.error("Update member error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


//delete members
aupRouter.delete("/:id", async (req, res) => {
  const memberId = parseInt(req.params.id);

  try {
    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: {
        member_id: memberId,
      },
    });

    if (!existingMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Delete member
    await prisma.member.delete({
      where: {
        member_id: memberId,
      },
    });

    return res.status(200).json({
      message: "Member deleted successfully",
    });

  } catch (error) {
    console.error("Delete member error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});



export default aupRouter;