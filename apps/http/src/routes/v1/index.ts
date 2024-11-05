import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { userRouter } from './user';
import { PrismaClient } from '@repo/db'; // Import the Prisma client directly

const client = new PrismaClient(); 

export const router = Router();

router.post('/signup', async (req: Request, res: Response): Promise<any> => {
    console.log("inside signup")
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Missing email or password');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await client.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        return res.status(201).json(user);
    } catch (error) {
        console.log("error thrown", error);
        return res.status(400).json({ error: 'Something went wrong' });
    }
});



router.post('/signin',async (req: Request, res: Response): Promise<any>  => {
   const {email,password }=req.body;

    if(!email || !password){
        return res.status(400).json('Missing email or password');
    }
    
    const user=await client.user.findUnique({
        where:{
            email
        }
    })
    
    if(!user){
        return res.status(400).json({ error: 'User not found' });
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({ error: 'Incorrect password' });
    }
    
    const token=jwt.sign({userId:user.id},process.env.JWT_SECRET_KEY as string,{expiresIn:'5d'});

    return res
    .setHeader('Authorization', `Bearer ${token}`)
    .cookie('token', token, {
        httpOnly: true, 
        secure: true,   
        sameSite: 'strict',
      })
    .status(200)
    .json({ user: user.email });
});




router.use('/user',userRouter)

