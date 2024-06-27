import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const checklistsRouter = Router();
checklistsRouter.use(protect);

checklistsRouter.get('/:checklistName', async (req, res) => {
    try {
      const checklistName = req.params.checklistName;
      const { str, end } = req.query;
  
      // Validate checklistName to ensure it's a safe identifier
      if (!checklistName || !/^[a-zA-Z0-9_]+$/.test(checklistName)) {
        return res.status(400).json({ message: 'Invalid checklist name.' });
      }
  
      // Define query parameters
      const queryArgs = {
        include: {
          user: {
            select: {
              firstname: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      };
  
      // Validate dates
      if (str && end) {
        const startDate = new Date(str);
        const endDate = new Date(end);
  
        if (isNaN(startDate) || isNaN(endDate)) {
          return res.status(400).json({ message: 'Invalid date format.' });
        }
  
        queryArgs.where = {
          AND: [
            { created_at: { gte: startDate } },
            { created_at: { lte: endDate } },
          ],
        };
      }
  
      // Construct the Prisma query dynamically
      const result = await prisma[`checklist${checklistName}`].findMany(queryArgs);
  
      // Return the results
      return res.json(result);
  
    } catch (error) {
      console.error('Error fetching checklist data:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
});

checklistsRouter.post('/fdc', async (req, res) => {
    
  try {
    const createdChecklistFdc  = {
      ...req.body,
    };

    // Validate formData
    if (!createdChecklistFdc) {
      return res.status(400).json({ message: 'Request body does not contain data.' });
    }

    // Insert data using Prisma
    await prisma.checklistFdc.create({
      data: {
        fdc_phase1: Number(createdChecklistFdc.fdc_phase1),
        fdc_phase2: Number(createdChecklistFdc.fdc_phase2),
        user_id : createdChecklistFdc.user_id
      },
    });
    res.status(201).json({
      data : createdChecklistFdc , 
      message : "Send checklistFDC Complete"
    });

  } catch (error) {
    console.error('Error creating checklistfdc:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


checklistsRouter.put('/', async (req, res) => {
    try {
      const { id, name, formData } = req.body;
  
      // Validate inputs
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing table name.' });
      }
  
      if (!formData || typeof formData !== 'object') {
        return res.status(400).json({ message: 'Invalid or missing form data.' });
      }
  
      if (!id) {
        return res.status(400).json({ message: 'Missing checklist ID for update.' });
      }
  
      // Ensure formData does not contain unwanted fields
      delete formData.id;
      delete formData.firstname;
      delete formData.created_at;
  
      // Add updated_at field
      formData.updated_at = new Date();
  
      // Update data using Prisma
      await prisma[name].update({
        where: {
          id: Number(id),
        },
        data: formData,
      });
  
      return res.json({ message: 'Checklist data updated successfully.' });
  
    } catch (error) {
      console.error('Error updating checklist data:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    } finally {
      await prisma.$disconnect();
    }
  });


export default checklistsRouter;
