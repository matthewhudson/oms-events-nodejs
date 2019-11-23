const request = require('request')
// A simple manager which tracks all event subscriptions
class EventManager {
  constructor () {
    this._events = {}
    this._nrSentEvents = 0
  }

  subscribe (id, endpoint, eventName, data) {
    data = data || {}
    console.log(`[subscribe] id:'${id}', endpoint:'${endpoint}', ` + `name:'${eventName}', data: `, data)
    if (this._events[eventName] === undefined) {
      this._events[eventName] = {}
    }
    // check that the id is new
    if (this._events[eventName][id] !== undefined) {
      return false
    }
    this._events[eventName][id] = {
      endpoint,
      data
    }
    return true
  }

  unsubscribe (id, eventName) {
    console.log(`[unsubscribe] id:'${id}', name:'${eventName}'`)
    // check that the id belongs to a listener
    if (this._events[eventName] === undefined) {
      return false
    }
    if (this._events[eventName][id] === undefined) {
      return false
    }
    delete this._events[eventName][id]
    return true
  }

  publish (eventName, data) {
    console.log(`[publish] '${eventName}' payload: `, data)
    if (this._events[eventName] === undefined) {
      return false
    }
    Object.values(this._events[eventName]).forEach(node => {
      // filter for user (optional)
      if (node.data.user !== undefined && data.user !== undefined) {
        if (node.data.user == data.user) {
          this._sendEvent(node, eventName, data)
        }
      } else {
        // no filtering
        this._sendEvent(node, eventName, data)
      }
    })
    return true
  }

  /*
    Send events as CloudEvent JSON.
    See also: https://github.com/cloudevents/spec/blob/master/json-format.md
   */
  _sendEvent (node, eventName, eventData) {
    return request.post(node.endpoint, {
      json: {
        eventType: eventName,
        type: 'com.microservices.node.template',
        specversion: '0.2',
        source: '/my-source',
        id: `NODE-TEMPLATE-${this._nrSentEvents++}`,
        time: new Date().toISOString(),
        datacontenttype: 'application/json',
        data: eventData
      }
    })
  }
}

module.exports = { EventManager }
