import { Router } from 'express';
import { protect } from '../middlewares/protect.js';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const checklistsRouter = Router();
checklistsRouter.use(protect);

//fdc
checklistsRouter.get('/fdc', async (req, res) => {
  const { str, end } = req.query;
  let query = {
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  };

  if (str && end) {
    query.where = {
      created_at: {
        gte: new Date(str),
        lte: new Date(end),
      },
    };
  }

  try {
    const checklists = await prisma.checklistFdc.findMany(query);
    res.status(200).json(checklists);
  } catch (error) {
    res.status(400).json({ message: 'Unable to retrieve fdc checklists: ' + error.message });
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
        fdc_phase1: parseFloat(createdChecklistFdc.fdc_phase1),
        fdc_phase2: parseFloat(createdChecklistFdc.fdc_phase2),
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

checklistsRouter.put('/fdc/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body

  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }
  
  //convesce to float
  const dataWithFloat =  {
    ...data ,
    fdc_phase1: parseFloat(data.fdc_phase1),
    fdc_phase2: parseFloat(data.fdc_phase2),
  }

    //delete some keys 
    delete dataWithFloat.created_at;
    delete dataWithFloat.id;
    delete dataWithFloat.updated_at;
    delete dataWithFloat.user;

  try {
    await prisma.checklistFdc.update({
      where: {
        id: Number(id),
      },
      data: dataWithFloat,
    });
    return res.status(201).json({message : 'Send Update fdc Checklists Complete'});
  } catch (error) {
    return res.status(400).json({ message: 'Update failed' + error });
  }
});

//checklist roomTemp
checklistsRouter.get('/roomtemp', async (req, res) => {
  const { str, end } = req.query;
  let query = {
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  };

  if (str && end) {
    query.where = {
      created_at: {
        gte: new Date(str),
        lte: new Date(end),
      },
    };
  }

  try {
    const checklists = await prisma.checklistRoomTemp.findMany(query);
    res.status(200).json(checklists); // Send the retrieved data
  } catch (error) {
    res.status(400).json({ message: 'Unable to retrieve room temperature checklists: ' + error.message });
  }
});

checklistsRouter.post('/roomtemp', async (req, res) => {
  const data = req.body;

  if(!data){
    return res.status(404).json({ message: 'Update failed : please check in put data' + error});
  }
  
  //change string to float
  for( let i in data) {
    if(i.includes("TempDetector") | i.includes("outside") | i.includes("tr_") ){
      data[`${i}`] = parseFloat(data[i])
    }
  }

  try {
    await prisma.checklistRoomTemp.create({
      data: data,
    });
    res.status(201).json({message : 'Send Roomtemp Checklists Complete'});
  } catch (error) {
    res.status(400).json({ message: 'Unable to create record' + error });
  }
});

checklistsRouter.put('/roomtemp/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body;

  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }
  
  //change string to float
  for( let i in data) {
    if(i.includes("TempDetector") | i.includes("outside") | i.includes("tr_") ){
      data[`${i}`] = parseFloat(data[i])
    }
  }

 //delete some keys 
 delete data.created_at;
 delete data.id;
 delete data.updated_at;
 delete data.user;

  try {
    await prisma.checklistRoomTemp.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
    return res.status(201).json({message : 'Send Update Roomtemp Checklists Complete'});
  } catch (error) {
    return res.status(400).json({ message: 'Update failed' + error });
  }
});

//checklist Transformer
checklistsRouter.get('/transformer', async (req, res) => {
  const { str, end } = req.query;
  let query = {
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  };

  if (str && end) {
    query.where = {
      created_at: {
        gte: new Date(str),
        lte: new Date(end),
      },
    };
  }
  try {
    const checklists = await prisma.checklistTransformer.findMany(query);

    res.status(200).json(checklists); // Send the retrieved data
  } catch (error) {
    res.status(400).json({ message: 'Unable to retrieve room temperature checklists: ' + error.message });
  }
});

checklistsRouter.post('/transformer', async (req, res) => {
  const data = req.body;
  
  if(!data){
    return res.status(404).json({ message: 'Update failed : please check in put data' + error});
  }

  //convesce to float

  const dataWithFloat =  {
    ...data ,
    all_offpeak : parseFloat(data.all_offpeak),
    all_onpeak : parseFloat(data.all_onpeak),
    i1 : parseFloat(data.i1),
    i2 : parseFloat(data.i2),
    i3 : parseFloat(data.i3),
    l1 : parseFloat(data.l1),
    l2 : parseFloat(data.l2),
    l3 : parseFloat(data.l3),
    meter : parseFloat(data.meter),
    meter_TOU : parseFloat(data.meter_TOU),
    offpeak : parseFloat(data.offpeak),
    onpeak : parseFloat(data.onpeak),
    pf : parseFloat(data.pf),
    tr_ch1 : parseFloat(data.tr_ch1),
    tr_ch2 : parseFloat(data.tr_ch2),
    tr_ch3 : parseFloat(data.tr_ch3),
    tr_room_hum : parseFloat(data.tr_room_hum),
    tr_room_temp : parseFloat(data.tr_room_temp),
  }

  try {
    await prisma.checklistTransformer.create({
      data: dataWithFloat,
    });
    res.status(201).json({message : 'Send transformer Checklists Complete'});
  } catch (error) {
    res.status(400).json({ message: 'Unable to create record' + error });
  }

});

checklistsRouter.put('/transformer/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body

  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }
  
  //convesce to float
  const dataWithFloat =  {
    ...data ,
    all_offpeak : parseFloat(data.all_offpeak),
    all_onpeak : parseFloat(data.all_onpeak),
    i1 : parseFloat(data.i1),
    i2 : parseFloat(data.i2),
    i3 : parseFloat(data.i3),
    l1 : parseFloat(data.l1),
    l2 : parseFloat(data.l2),
    l3 : parseFloat(data.l3),
    meter : parseFloat(data.meter),
    meter_TOU : parseFloat(data.meter_TOU),
    offpeak : parseFloat(data.offpeak),
    onpeak : parseFloat(data.onpeak),
    pf : parseFloat(data.pf),
    tr_ch1 : parseFloat(data.tr_ch1),
    tr_ch2 : parseFloat(data.tr_ch2),
    tr_ch3 : parseFloat(data.tr_ch3),
    tr_room_hum : parseFloat(data.tr_room_hum),
    tr_room_temp : parseFloat(data.tr_room_temp),
  }

    //delete some keys 
    delete dataWithFloat.created_at;
    delete dataWithFloat.id;
    delete dataWithFloat.updated_at;
    delete dataWithFloat.user;

  try {
    await prisma.checklistTransformer.update({
      where: {
        id: Number(id),
      },
      data: dataWithFloat,
    });
    return res.status(201).json({message : 'Send Update transformer Checklists Complete'});
  } catch (error) {
    return res.status(400).json({ message: 'Update failed' + error });
  }
  
});

//checklist phase1
checklistsRouter.get('/phase1', async (req, res) => {
  const { str, end } = req.query;
  let query = {
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  };

  if (str && end) {
    query.where = {
      created_at: {
        gte: new Date(str),
        lte: new Date(end),
      },
    };
  }
  try {
    const checklists = await prisma.checklistPhase1.findMany(query);

    res.status(200).json(checklists); // Send the retrieved data
  } catch (error) {
    res.status(400).json({ message: 'Unable to retrieve Phase1 checklists: ' + error.message });
  }
});

checklistsRouter.post('/phase1', async (req, res) => {
  const data = req.body;
  
  if(!data){
    return res.status(404).json({ message: 'Update failed : please check in put data' + error});
  }

  // Convert to float
  for (let key in data) {
    const value = parseFloat(data[key]);
    if (!isNaN(value)) {
      data[key] = value;
    }
  }

  try {
    await prisma.checklistPhase1.create({
      data: {
        ...data,
        vesda_barlevel : parseInt(data.vesda_barlevel)
      },
    });
    res.status(201).json({message : 'Send transformer Checklists Complete'});
  } catch (error) {
    res.status(400).json({ message: 'Unable to create record' + error });
  }

});

checklistsRouter.put('/phase1/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body

  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }
  
  // Convert to float
  for (let key in data) {
    const value = parseFloat(data[key]);
    if (!isNaN(value)) {
      data[key] = value;
    }
  }

    //delete some keys 
    delete data.created_at;
    delete data.id;
    delete data.updated_at;
    delete data.user;

    

  try {
    await prisma.checklistPhase1.update({
      where: {
        id: Number(id),
      },
      data: {
        ...data,
        vesda_barlevel : parseInt(data.vesda_barlevel)
      },
    });
    return res.status(201).json({message : 'Send Update transformer Checklists Complete'});
  } catch (error) {
    return res.status(400).json({ message: 'Update failed' + error });
  }
  
});

//checklist phase2
checklistsRouter.get('/phase2', async (req, res) => {
  const { str, end } = req.query;
  let query = {
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  };

  if (str && end) {
    query.where = {
      created_at: {
        gte: new Date(str),
        lte: new Date(end),
      },
    };
  }
  try {
    const checklists = await prisma.checklistPhase2.findMany(query);

    res.status(200).json(checklists); // Send the retrieved data
  } catch (error) {
    res.status(400).json({ message: 'Unable to retrieve Phase2 checklists: ' + error.message });
  }
});

checklistsRouter.post('/phase2', async (req, res) => {
  const data = req.body;
  
  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }

  //convesce to float
  for( let i in data) {
    if(parseFloat(data[i])){
      data[`${i}`] = parseFloat(data[i])
    }
  }

  try {
    await prisma.checklistPhase2.create({
      data: data,
    });
    res.status(201).json({message : 'Send Phase2 Checklists Complete'});
  } catch (error) {
    res.status(400).json({ message: 'Unable to create record' + error });
  }

});

checklistsRouter.put('/phase2/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body
  
  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }
  
  // Convert to float
  for (let key in data) {
    const value = parseFloat(data[key]);
    if (!isNaN(value)) {
      data[key] = value;
    }
  }

    //delete some keys 
    delete data.created_at;
    delete data.id;
    delete data.updated_at;
    delete data.user;

    console.log(data)

  try {
    await prisma.checklistPhase2.update({
      where: {
        id: Number(id),
      },
      data: {
        ...data,
        vesda_barlevel : parseInt(data.vesda_barlevel)
      },
    });
    return res.status(201).json({message : 'Send Update transformer Checklists Complete'});
  } catch (error) {
    return res.status(400).json({ message: 'Update failed' + error });
  }
  
});

checklistsRouter.delete('/phase2/:id', async (req, res) => {
  try {

      // Execute the query
      await prisma.checklistPhase2.delete({
        where: {
          id: Number(req.params.id),
        }
      })

      // Return a success response
      return res.json({ message: 'All records deleted from ChecklistPhase2.' });
  } catch (error) {
      console.error('Error deleting records from ChecklistPhase2:', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

//checklist Generator
checklistsRouter.get('/generator', async (req, res) => {
  const { str, end } = req.query;
  let query = {
    include: {
      user: {
        select: {
          first_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  };

  if (str && end) {
    query.where = {
      created_at: {
        gte: new Date(str),
        lte: new Date(end),
      },
    };
  }
  try {
    const checklists = await prisma.checklistGenerator.findMany(query);

    res.status(200).json(checklists); // Send the retrieved data
  } catch (error) {
    res.status(400).json({ message: 'Unable to retrieve checklistGenerator: ' + error.message });
  }
});

checklistsRouter.post('/generator', async (req, res) => {
  const data = req.body;
  
  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }

  // Convert to float
  for (let key in data) {
    const value = parseFloat(data[key]);
    if (!isNaN(value) && key !== "time_start") {
      data[key] = value;
    }
  }

  try {
    await prisma.checklistGenerator.create({
      data: data,
    });
    res.status(201).json({message : 'Send checklistGenerator Complete'});
  } catch (error) {
    res.status(400).json({ message: 'Unable to create record' + error });
  }

});

checklistsRouter.put('/generator/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body
  
  if(!data){
    return res.status(404).json({ message: 'Update failed : please check input data' + error});
  }
  
  // Convert to float
  for (let key in data) {
    const value = parseFloat(data[key]);
    if (!isNaN(value) && key !== "time_start") {
      data[key] = value;
    }
  }
    //delete some keys 
    delete data.created_at;
    delete data.id;
    delete data.updated_at;
    delete data.user;

  try {
    await prisma.checklistGenerator.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
    return res.status(201).json({message : 'Send Update checklistGenerator Complete'});
  } catch (error) {
    return res.status(400).json({ message: 'Update failed' + error });
  }
  
});

checklistsRouter.delete('/generator/:id', async (req, res) => {
  try {

      // Execute the query
      await prisma.checklistGenerator.delete({
        where: {
          id: Number(req.params.id),
        }
      })

      // Return a success response
      return res.json({ message: 'All records deleted from checklistGenerator.' });
  } catch (error) {
      console.error('Error deleting records from checklistGenerator:', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default checklistsRouter;
