'use strict'

const AWS = require('aws-sdk')
const { Consumer } = require('sqs-consumer')
const Hp = require('hemera-plugin')

/**
 *
 * @param {Hemera} hemera
 * @param {*} opts
 * @param {*} done
 */
function hemeraSQS (hemera, opts, done) {
  const topic = 'sqs'

  if (opts.configPath) {
    AWS.config.loadFromPath(opts.configPath)
  }

  // Create an SQS service object
  const sqs = new AWS.SQS(opts.sqs)

  /**
   *  QUEUES
   */

  hemera.add(
    {
      topic,
      cmd: 'listQueues'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.listQueues(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve({ queueUrls: data.QueueUrls })
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'createQueue'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.createQueue(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve({ queueUrl: data.QueueUrl })
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'getQueueUrl'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.getQueueUrl(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve({ queueUrl: data.QueueUrl })
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'deleteQueue'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.deleteQueue(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve(data)
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'setQueueAttributes'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.setQueueAttributes(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve({ queueUrls: data.QueueUrls })
        })
      })
    }
  )

  /**
   * MESSAGING
   */

  hemera.add(
    {
      topic,
      cmd: 'sendMessage'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.sendMessage(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve({ id: data.MessageId })
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'receiveMessage'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.receiveMessage(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve(data)
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'deleteMessage'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.deleteMessage(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve(data)
        })
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'changeMessageVisibility'
    },
    async (req) => {
      return new Promise((resolve, reject) => {
        sqs.changeMessageVisibility(req.params, (err, data) => {
          if (err) {
            this.log.error(err)
            return reject(new Error(err))
          }
          return resolve(data)
        })
      })
    }
  )

  hemera.decorate('sqs', sqs)

  hemera.decorate('sqsListenQueue', (req) => {
    const { queueUrl, handleMessage } = req
    const app = Consumer.create({
      queueUrl,
      handleMessage,
      sqs
    })

    app.start()
    return app
  })

  done()
}

const plugin = Hp(hemeraSQS, {
  hemera: '>=5.0.0',
  // eslint-disable-next-line global-require
  name: require('./package.json').name,
  options: {
    sqs: {
      apiVersion: '2012-11-05'
    }
  }
})

module.exports = plugin
