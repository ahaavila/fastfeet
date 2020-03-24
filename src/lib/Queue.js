import Bee from 'bee-queue';

import PackageMail from '../app/jobs/PackageMail';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [PackageMail, CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // inicio a fila
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Método para adicionar um novo job na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Vai ficar processando os jobs em tempo real
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
