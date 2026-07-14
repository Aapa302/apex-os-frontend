/**
 * Standard Task States and Priority Levels for AI CEO Core Foundation
 */

export const TaskStatus = {
  PENDING: "Pending",
  RUNNING: "Running",
  WAITING: "Waiting",
  COMPLETED: "Completed",
  FAILED: "Failed"
};

export const TaskPriority = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low"
};

export class TaskModel {
  /**
   * Create a standard AI task structure
   * @param {object} params
   */
  constructor({
    id = null,
    title = "",
    desc = "",
    priority = TaskPriority.MEDIUM,
    assignee = null,
    status = TaskStatus.PENDING,
    progress = 0,
    eta = "Pending",
    logs = []
  } = {}) {
    this.id = id || "TASK-" + Date.now().toString().slice(-4);
    this.title = title;
    this.desc = desc;
    this.priority = priority;
    this.assignee = assignee;
    this.status = status;
    this.progress = Math.min(100, Math.max(0, progress));
    this.eta = eta;
    this.logs = logs;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Transition state to running status
   */
  start() {
    this.status = TaskStatus.RUNNING;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Transition state to completed status
   */
  complete() {
    this.status = TaskStatus.COMPLETED;
    this.progress = 100;
    this.eta = "0m";
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Transition state to failed status
   */
  fail(reason = "") {
    this.status = TaskStatus.FAILED;
    this.updatedAt = new Date().toISOString();
    if (reason) {
      this.logs.push(`[${new Date().toLocaleTimeString()}] Fail Reason: ${reason}`);
    }
  }

  /**
   * Update task progress percentages
   * @param {number} prg
   */
  updateProgress(prg) {
    this.progress = Math.min(100, Math.max(0, prg));
    this.updatedAt = new Date().toISOString();
  }
}
