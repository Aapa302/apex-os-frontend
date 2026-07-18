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
      lastActivity = "Just now",
      title,
      icon,
      color,
      dept
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
      title,
      icon,
      color,
      dept,
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

export const REAL_EMPLOYEES = [
  { id: "cto", name: "Alex Chen", role: "Chief Technology Officer", title: "Chief Technology Officer", icon: "💻", color: "#6366f1", dept: "Technology" },
  { id: "engineer", name: "Sarah Kim", role: "Sr. Software Engineer", title: "Sr. Software Engineer", icon: "⚙️", color: "#22d3a5", dept: "Technology" },
  { id: "pm", name: "Marcus J.", role: "Product Manager", title: "Product Manager", icon: "📋", color: "#f5a623", dept: "Product" },
  { id: "marketing", name: "Priya S.", role: "Marketing Manager", title: "Marketing Manager", icon: "📣", color: "#e040fb", dept: "Marketing" },
  { id: "hr", name: "David Park", role: "HR Manager", title: "HR Manager", icon: "👥", color: "#14b8a6", dept: "People" },
  { id: "finance", name: "Emma W.", role: "Finance Manager", title: "Finance Manager", icon: "💰", color: "#84cc16", dept: "Finance" },
  { id: "sales", name: "James R.", role: "Sales Manager", title: "Sales Manager", icon: "🎯", color: "#f97316", dept: "Revenue" },
  { id: "support", name: "Aisha P.", role: "Customer Support Lead", title: "Customer Support Lead", icon: "💬", color: "#a78bfa", dept: "Operations" },
  { id: "designer", name: "Lena M.", role: "UI/UX Designer", title: "UI/UX Designer", icon: "🎨", color: "#f43f5e", dept: "Design" },
  { id: "analyst", name: "Ryan T.", role: "Data Analyst", title: "Data Analyst", icon: "📊", color: "#0ea5e9", dept: "Analytics" },
  { id: "researcher", name: "Dr. Mei Lin", role: "Research Engineer", title: "Research Engineer", icon: "🔬", color: "#06b6d4", dept: "Research" }
];

export const globalEmployeeRegistry = new EmployeeRegistry();

// Seed global employee registry with default employees
REAL_EMPLOYEES.forEach(emp => {
  globalEmployeeRegistry.register({
    ...emp,
    status: "Idle",
    currentTask: "None",
    lastActivity: "No recent activity"
  });
});

export default EmployeeRegistry;
