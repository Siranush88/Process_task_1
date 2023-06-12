import process, { stdin, stdout } from 'process';
import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs';


function getProcessStatistics(command, args = [], timeout = 'infinite') {
    setTimeout(() => {
        if (os.freemem()) {
            const child = spawn(command, args);

            const processStart = new Date().toISOString().replaceAll(':', '.');

            const dateNow = Date.now();
            const end = performance.now();

            let processDuration = (dateNow - end) / 1000;
            processDuration = processDuration.toString();
            class Statistics {
                constructor(start, duration, success, commandSuccess, error) {
                    this.start = processStart,
                    this.duration = processDuration,
                    this.success = typeof child.pid === "number" ? true : false,
                    this.commandSuccess = this.success ? true : false,
                    this.error = 'error.'
                }
            }

            const statistics = new Statistics();
     
            const startPath = `logs/${statistics.start}${command}.json`;
            const durationPath = `logs/${statistics.duration}${command}.json`;
            const successPath = `logs/${statistics.success.toString()}${command}.json`;
            const commandFailPath = `logs/${statistics.commandSuccess}${command}.json`;
            const errorPath = `logs/${statistics.error}${command}.json`;

            if (statistics.success) {
                    fs.writeFile(startPath, statistics.start, () => {
                        console.log('start is created');
                    });
                    fs.writeFile(durationPath, statistics.duration, () => {
                        console.log('duration is created')
                    });
                    fs.writeFile(successPath, statistics.success.toString(), () => {
                        console.log('success is created')
                    });
            } else {      
                child.stderr.on('data', (data) => {
                    console.error("Command error");
                })        
                fs.writeFileSync(commandFailPath, 'error');
            }
        } else {
            fs.writeFile(errorPath, statistics.error.toString(), () => {
                console.error("Child process can't be created")
            });
        }
    }, timeout)
}

getProcessStatistics('node', ['-v']);