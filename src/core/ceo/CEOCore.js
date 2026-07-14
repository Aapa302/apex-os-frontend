import { globalEventBus } from "../events/EventBus";
import { globalEmployeeRegistry } from "../employees/EmployeeRegistry";
import { TaskStatus, TaskPriority, TaskModel } from "../models/Task";

/**
 * AI CEO Core Engine
 * Coordinates dispatching, decision-queuing, active plans, and future communication boundaries.
 */
export class CEOCore {
  constructor() {
    this.eventBus = globalEventBus;
    this.employeeRegistry = globalEmployeeRegistry;
    this.tasks = [];
    this.decisionQueue = [];
    this.planningQueue = [];
    this.systemHealth = 100;
  }

  /**
   * Queue a decision candidate for CEO review
   * @param {string} title
   * @param {string} desc
   */
  queueDecision(title, desc) {
    const dec = {
      id: "DEC-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      title,
      desc,
      status: "Awaiting Review",
      timestamp: new Date().toLocaleTimeString()
    };
    this.decisionQueue.push(dec);
    this.eventBus.publish("DecisionQueued", dec);
    return dec;
  }

  /**
   * Queue a strategy plan candidate
   * @param {string} goal
   */
  queuePlan(goal) {
    const plan = {
      id: "PLAN-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      goal,
      status: "Drafting",
      timestamp: new Date().toLocaleTimeString()
    };
    this.planningQueue.push(plan);
    this.eventBus.publish("PlanQueued", plan);
    return plan;
  }

  /**
   * Fetch cumulative global system states
   */
  getGlobalState() {
    const activeTasks = this.tasks.filter(t => t.status === TaskStatus.RUNNING).length;
    const completedTasks = this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const activeEmployees = this.employeeRegistry.list().filter(e => e.status === "Active").length;

    return {
      activeEmployees,
      activeTasks,
      completedTasks,
      systemHealth: this.systemHealth,
      queueCount: this.tasks.length,
      decisionQueueCount: this.decisionQueue.length,
      planningQueueCount: this.planningQueue.length
    };
  }
}

export const globalCEOCore = new CEOCore();
export default CEOCore;
