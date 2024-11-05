import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { userRouter } from './user';
import { PrismaClient } from '@repo/db'; // Import the Prisma client directly

const client = new PrismaClient(); 

export const router = Router();

router.post('/signup', async (req: Request, res: Response): Promise<any> => {
    console.log("inside signup")
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json('Missing username or password');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await client.user.create({
            data: {
                username,
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
   const {username,password }=req.body;

    if(!username || !password){
        return res.status(400).json('Missing username or password');
    }
    
    const user=await client.user.findUnique({
        where:{
            username
        }
    })
    
    if(!user){
        return res.status(400).json({ error: 'User not found' });
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({ error: 'Incorrect password' });
    }
    
    const token=jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{expiresIn:'5d'});

    return res
    .setHeader('Authorization', `Bearer ${token}`)
    .status(200)
    .json({ user: user.username });
});




router.use('/user',userRouter)

