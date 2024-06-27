import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const authRouter = Router();

//register
authRouter.post("/register", async (req, res) => {
  const user = {
    ...req.body,
  };

  if(!user){
    return res.status(401).json({
      message: "resgister faild this not request data",
    });
  }

  try {

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await prisma.users.create({
      data: {
        ...user
      },
    });
  
    return res.status(201).json({
      message: "User has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not create user' + error,
    });
  }

});

//login
authRouter.post("/login", async (req, res) => {

  const { username , password } = req.body

  const user = await prisma.users.findUnique({
    where: {
      username,
    },
  });
  
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

    let passWordNotValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passWordNotValid) {
      return res.status(404).json({
        message: "username or password not match",
      });
    }

    const token = jwt.sign({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      UserName: user.username,
      level: user.level
    },
      process.env.SECRET_KEY,
    {
      expiresIn: "20000000",
    }
    );

    return res.status(200).json({
      message: "login succesfully",
      token
    });
});

//update
authRouter.put("/:id", async (req, res) => {

  const user_id = Number(req.params.id)

  const user = {
    ...req.body,
  };

  console.log(user_id)
  console.log(user)


  if(!user){
    return res.status(401).json({
      message: "update faild this not request data",
    });
  }

    // Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: {
      user_id: user_id,
    },
  });  

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await prisma.users.update({
      where: {
        user_id: user_id,
      },
      data: {
        username: user.username,
        password : user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        level: user.level,
      },
    });
  
    return res.status(200).json({
      message: "User has been updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update user error:" + error,
    });
  }

});

authRouter.get("/users", async (req, res) => {
  const keyword = req.query.keyword;
  
  try {
    let users;

    if (keyword) {
      // Search users by keyword
      users = await prisma.users.findMany({
        where: {
          OR: [
            { username: { contains: keyword, mode: 'insensitive' } },
            { first_name: { contains: keyword, mode: 'insensitive' } },
            { last_name: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          level: 'desc',
        },
      });
    } else {
      // Fetch all users ordered by level descending
      users = await prisma.user.findMany({
        orderBy: {
          level: 'desc',
        },
      });
    }

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
  


export default authRouter;