import {NextFunction, Request, Response } from 'express';
import { db } from './connection';
import { User } from './entities';
import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from 'eth-sig-util';
import jwt from 'jsonwebtoken';
const userRepository = db.getRepository(User)

// verify user msg using ethereum utils
function verify(user: User, msg: string, publicKey:string) {
    const msgBufferHex = bufferToHex(Buffer.from(user?.sign, 'utf8'));
    const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: msg,
    });
    return address.toLowerCase() === publicKey.toLowerCase();
}
// create new user
async function createUser(publicKey:string) {
    const newUser = new User();
    newUser.sign = 'signature';
    newUser.publicKey = publicKey;
    await userRepository.save(newUser);
    return newUser.sign;
}
// authentication middleware function
function authenticateToken(req: Request, res:Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    // authorize user and add user to the request
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403)
        req.body.publicKey = user;
        next()
    })
}

async function login(req: Request, res: Response) {
    // check if user exist. If doesn't then create it and send signature
    const user = await userRepository.findOneBy({
        publicKey: req.body.publicKey
    })
    if(user) {
        return res.json({msg: user.sign})
    } else {
        const result = await createUser(req.body.publicKey);
        return res.json({msg: result});
    }
}
// verify the user's msg
async function signMsg(req: Request, res: Response) {
    const user = await userRepository.findOneBy({
        publicKey: req.body.publicKey
    })
    if(user && verify(user, req.body.msg, req.body.publicKey)) {
        return res.json({accessToken: jwt.sign(req.body.publicKey, process.env.TOKEN_SECRET as string)});
    }
    return res.status(400).send({message: 'Failed kk'});
}

// get user profile
async function get(req: Request, res: Response) {
    var user = await userRepository.findOneBy({
        publicKey: req.body.publicKey 
    })
    if (user) {
        return res.json({phone: user.phone, email: user.email});
    }
    return res.status(400).send({message: 'Failed kk'});
}

// update phone and email
async function update(req: Request, res: Response) {
    var user = await userRepository.findOneBy({
        publicKey: req.body.publicKey
    })
    const {email, phone} = req.body;
    if (user) {
        if (email) {
            user.email = email;
        }
        if (phone) {
            user.phone = phone;
        }
        user = await userRepository.save(user);
        return res.json({phone: user.phone, email: user.email});
    }
    return res.status(400).send({message: 'Failed kk'}); 
}

export {login, update, authenticateToken, signMsg, get};