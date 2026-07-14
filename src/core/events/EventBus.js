/**
 * APEX OS Pub/Sub Event Bus
 * Reusable event system supporting task and employee status notifications.
 */
class EventBus {
  constructor() {
    this.listeners = {};
    this.history = [];
  }

  /**
   * Subscribe to an event topic
   * @param {string} eventName
   * @param {function} callback
   * @returns {function} unsubscribe function
   */
  subscribe(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    };
  }

  /**
   * Publish an event with payload data
   * @param {string} eventName
   * @param {object} payload
   */
  publish(eventName, payload = {}) {
    const eventObj = {
      id: "evt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      event: eventName,
      payload,
      timestamp: new Date().toLocaleTimeString()
    };

    // Store in history
    this.history.push(eventObj);
    if (this.history.length > 100) {
      this.history.shift(); // Cap history to last 100 events
    }

    if (!this.listeners[eventName]) return;

    this.listeners[eventName].forEach(callback => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`Error in event listener callback for event ${eventName}:`, err);
      }
    });
  }

  /**
   * Get complete event log history
   * @returns {Array} List of events
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Clear event history log
   */
  clearHistory() {
    this.history = [];
  }
}

// Single instance for global application scope
export const globalEventBus = new EventBus();
export default EventBus;
