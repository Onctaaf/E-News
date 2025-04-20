// src/utils/Scheduler.ts
import { schedule } from 'node-cron';

export class Scheduler {
    static scheduleDailyTask(task: () => void) {
        schedule('0 0 * * *', task, {
            scheduled: true,
            timezone: 'America/Los_Angeles'
        });
    }
}