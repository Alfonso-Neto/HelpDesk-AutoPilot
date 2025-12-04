import 'dotenv/config';
import { HelpDeskAgent } from './agent/HelpDeskAgent.js';

const agent = new HelpDeskAgent();

console.log('=== HelpDesk AutoPilot ===\n');
agent.start();
