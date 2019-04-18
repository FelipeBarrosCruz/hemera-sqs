'use strict'

const AWS = require('aws-sdk')
const Hp = require('hemera-plugin')

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
      sqs.listQueues(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return { queueUrls: data.QueueUrls }
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'createQueue'
    },
    async (req) => {
      sqs.createQueue(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return { queueUrl: data.QueueUrl }
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'getQueueUrl'
    },
    async (req) => {
      sqs.getQueueUrl(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return { queueUrl: data.QueueUrl }
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'deleteQueue'
    },
    async (req) => {
      sqs.deleteQueue(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return data
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'setQueueAttributes'
    },
    async (req) => {
      sqs.setQueueAttributes(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return { queueUrls: data.QueueUrls }
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
      sqs.sendMessage(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return { id: data.MessageId }
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'receiveMessage'
    },
    async (req) => {
      sqs.receiveMessage(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return data
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'deleteMessage'
    },
    async (req) => {
      sqs.deleteMessage(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return data
      })
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'changeMessageVisibility'
    },
    async (req) => {
      sqs.changeMessageVisibility(req.params, (err, data) => {
        if (err) {
          this.log.error(err)
          return new Error(err)
        }
        return data
      })
    }
  )

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
