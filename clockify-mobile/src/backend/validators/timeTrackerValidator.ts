export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class TimeTrackerValidator {
  static validateCreateEntry(payload: any): ValidationResult {
    const errors: string[] = [];

    if (!payload || typeof payload !== "object") {
      return { isValid: false, errors: ["Invalid payload object"] };
    }

    if (payload.startTime && isNaN(Date.parse(payload.startTime))) {
      errors.push("Invalid startTime: must be a valid ISO date string");
    }

    if (payload.endTime && isNaN(Date.parse(payload.endTime))) {
      errors.push("Invalid endTime: must be a valid ISO date string");
    }

    if (payload.startTime && payload.endTime) {
      if (new Date(payload.startTime).getTime() > new Date(payload.endTime).getTime()) {
        errors.push("startTime cannot be later than endTime");
      }
    }

    if (payload.durationSeconds !== undefined) {
      if (typeof payload.durationSeconds !== "number" || payload.durationSeconds < 0) {
        errors.push("durationSeconds must be a positive number");
      }
    }

    if (payload.description && typeof payload.description !== "string") {
      errors.push("description must be a string");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUpdateEntry(payload: any): ValidationResult {
    const errors: string[] = [];

    if (!payload || typeof payload !== "object") {
      return { isValid: false, errors: ["Invalid payload object"] };
    }

    if (payload.startTime && isNaN(Date.parse(payload.startTime))) {
      errors.push("Invalid startTime: must be a valid ISO date string");
    }

    if (payload.endTime && isNaN(Date.parse(payload.endTime))) {
      errors.push("Invalid endTime: must be a valid ISO date string");
    }

    if (payload.startTime && payload.endTime) {
      if (new Date(payload.startTime).getTime() > new Date(payload.endTime).getTime()) {
        errors.push("startTime cannot be later than endTime");
      }
    }

    if (payload.durationSeconds !== undefined) {
      if (typeof payload.durationSeconds !== "number" || payload.durationSeconds < 0) {
        errors.push("durationSeconds must be a positive number");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
