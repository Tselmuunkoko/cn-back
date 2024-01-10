import express from 'express';
import {login, update, authenticateToken, signMsg} from './controller';

export const service = express.Router();

service.post('/auth', login);
service.post('/update', authenticateToken, update);
service.post('/sign', signMsg);