/**
 * AI Employee Registry Model
 * Coordinates metadata, capabilities, status and workloads of registered agent employees.
 */

export class EmployeeRegistry {
  constructor() {
    this.employees = new Map();
  }

  /**
   * Register a new AI Agent Employee
   * @param {object} employeeData
   */
  register(employeeData) {
    const {
      id,
      name,
      role,
      status = "Idle",
      capabilities = [],
      currentTask = "None",
      health = 100,
      lastActivity = "Just now"
    } = employeeData;

    if (!id) throw new Error("Employee ID is required for registration.");

    const registryObj = {
      id,
      name,
      role,
      status,
      capabilities,
      currentTask,
      health,
      lastActivity,
      updatedAt: new Date().toISOString()
    };

    this.employees.set(id, registryObj);
    return registryObj;
  }

  /**
   * Unregister / remove an employee
   * @param {string} id
   */
  unregister(id) {
    return this.employees.delete(id);
  }

  /**
   * Fetch a registered employee
   * @param {string} id
   */
  get(id) {
    return this.employees.get(id);
  }

  /**
   * Update specific attributes of an employee
   * @param {string} id
   * @param {object} attributes
   */
  update(id, attributes) {
    if (!this.employees.has(id)) return null;

    const current = this.employees.get(id);
    const updated = {
      ...current,
      ...attributes,
      updatedAt: new Date().toISOString()
    };

    this.employees.set(id, updated);
    return updated;
  }

  /**
   * Fetch all registered employees as a list
   * @returns {Array} List of employees
   */
  list() {
    return Array.from(this.employees.values());
  }

  /**
   * Clear complete registry
   */
  clear() {
    this.employees.clear();
  }
}

export const globalEmployeeRegistry = new EmployeeRegistry();
export default EmployeeRegistry;
