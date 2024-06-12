import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const user = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  if(!user){
    return res.status(401).json({
      message: "resgister faild this not request data",
    });
  }

  try {

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await pool.query(
      `insert into users ( username, password, firstname, lastname, level, created_at, updated_at)
      values ($1, $2, $3, $4, $5 , $6 ,$7)`,
      [
        user.username,
        user.password,
        user.firstname,
        user.lastname,
        user.level,
        user.created_at,
        user.updated_at,
      ]
    );
  
    return res.status(200).json({
      message: "User has been created successfully",
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }

});

authRouter.post("/login", async (req, res) => {
  const user = await pool.query(`select * from users where username='${req.body.username}'`)
  
  if (!user.rows[0]) {
    return res.status(404).json({
      message: "user not found",
    });
  }

    let passWordNotValid = await bcrypt.compare(
      req.body.password,
      user.rows[0].password
    );

    if (!passWordNotValid) {
      return res.status(404).json({
        message: "username or password not match",
      });
    }

    const token = jwt.sign({
      id: user.rows[0].user_id,
      firstName: user.rows[0].firstname,
      lastName: user.rows[0].lastname,
      UserName: user.rows[0].username,
      level: user.rows[0].level
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

authRouter.put("/update", async (req, res) => {
  const user = {
    ...req.body,
    updated_at: new Date(),
  };

  if(!user){
    return res.status(401).json({
      message: "update faild this not request data",
    });
  }

  try {
    await pool.query(
      `insert into users ( username,firstname, lastname, level, updated_at)
      values ($1, $2, $3, $4, $5 , $6 ,$7)`,
      [
        user.username,
        user.firstname,
        user.lastname,
        user.level,
        user.updated_at,
      ]
    );
  
    return res.status(200).json({
      message: "User has been created successfully",
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }

});

authRouter.get("/users" , async (req , res)=> {
  const keyword = req.query.keyword
  let users = []

  try {
    if(keyword){
      users = await pool.query(`SELECT * 
      FROM users 
      WHERE username ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1
      ORDER BY level DESC
      ` ,[`%${keyword}%`])
    }else{
      users = await pool.query(`SELECT * FROM users ORDER BY level DESC`)
    }
    return res.status(200).json({
      data : users.rows
    });
  } catch (error) {
    return res.status(404).json({
      message : error
    });
  }

})


export default authRouter;