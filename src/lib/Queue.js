import Bee from 'bee-queue';

import PackageMail from '../app/jobs/PackageMail';
import redisConfig from '../config/redis';

const jobs = [PackageMail];

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

      bee.process(handle);
    });
  }
}

export default new Queue();
