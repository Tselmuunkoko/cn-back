import express from 'express';
import {login, update, authenticateToken, signMsg, get} from './controller';

export const service = express.Router();

service.post('/auth', login);
service.post('/update', authenticateToken, update);
service.post('/sign', signMsg);
service.post('/user', authenticateToken, get);