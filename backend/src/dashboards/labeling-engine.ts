export type SystemLabel = 'green' | 'yellow' | 'red' | 'grey' | 'no_data';
export type InterventionLevel = 'level_1' | 'level_2' | 'level_3' | 'none';
export type RecommendedActionCode =
  | 'REMIND_STUDY_HABIT'
  | 'FOLLOW_UP_CLOSELY'
  | 'REVIEW_LEARNING_PATH'
  | 'WAIT_FOR_DATA'
  | 'NONE';

export interface DashboardThresholds {
  attendanceMin: number;
  homeworkMin: number;
  greyMax: number;
  redMax: number;
}

export const DEFAULT_DASHBOARD_THRESHOLDS: DashboardThresholds = {
  attendanceMin: 90,
  homeworkMin: 90,
  greyMax: 45,
  redMax: 60,
};

export interface StudentClassificationInput {
  registrationStatus: string;
  attendancePct: number | null;
  homeworkPct: number | null;
  testAverage: number | null;
  flagAttendanceDrop: boolean;
  flagHomeworkDrop: boolean;
}

export type ClassificationIssueCode =
  | 'TEST_BELOW_GREY_THRESHOLD'
  | 'TEST_BELOW_RED_THRESHOLD'
  | 'ATTENDANCE_BELOW_THRESHOLD'
  | 'HOMEWORK_BELOW_THRESHOLD'
  | 'ATTENDANCE_DROPPING'
  | 'HOMEWORK_DROPPING'
  | 'MISSING_TEST_DATA'
  | 'MISSING_ATTENDANCE_DATA'
  | 'MISSING_HOMEWORK_DATA';

export interface ClassificationIssue {
  code: ClassificationIssueCode;
  metric: 'testAverage' | 'attendancePct' | 'homeworkPct';
  actual: number | null;
  threshold: number | null;
}

export interface StudentClassification {
  label: SystemLabel;
  interventionLevel: InterventionLevel;
  issues: ClassificationIssue[];
  recommendedAction: {
    code: RecommendedActionCode;
    title: string;
    priority: 0 | 1 | 2 | 3;
    messageTemplateKey: string | null;
  };
}

const ACTIONS: Record<
  InterventionLevel | 'wait',
  StudentClassification['recommendedAction']
> = {
  level_1: {
    code: 'REMIND_STUDY_HABIT',
    title: 'Nhắc chăm học',
    priority: 1,
    messageTemplateKey: 'habit_reminder',
  },
  level_2: {
    code: 'FOLLOW_UP_CLOSELY',
    title: 'Cần theo sát',
    priority: 2,
    messageTemplateKey: 'red_followup',
  },
  level_3: {
    code: 'REVIEW_LEARNING_PATH',
    title: 'Bàn lại lộ trình',
    priority: 3,
    messageTemplateKey: 'relearn_advice',
  },
  none: {
    code: 'NONE',
    title: 'Không cần can thiệp',
    priority: 0,
    messageTemplateKey: null,
  },
  wait: {
    code: 'WAIT_FOR_DATA',
    title: 'Chờ dữ liệu',
    priority: 0,
    messageTemplateKey: null,
  },
};

export function classifyStudent(
  input: StudentClassificationInput,
  thresholds: DashboardThresholds,
): StudentClassification {
  const issues: ClassificationIssue[] = [];

  if (input.testAverage === null) {
    issues.push({
      code: 'MISSING_TEST_DATA',
      metric: 'testAverage',
      actual: null,
      threshold: null,
    });
  } else if (input.testAverage < thresholds.greyMax) {
    issues.push({
      code: 'TEST_BELOW_GREY_THRESHOLD',
      metric: 'testAverage',
      actual: input.testAverage,
      threshold: thresholds.greyMax,
    });
  } else if (input.testAverage < thresholds.redMax) {
    issues.push({
      code: 'TEST_BELOW_RED_THRESHOLD',
      metric: 'testAverage',
      actual: input.testAverage,
      threshold: thresholds.redMax,
    });
  }

  if (input.attendancePct === null) {
    issues.push({
      code: 'MISSING_ATTENDANCE_DATA',
      metric: 'attendancePct',
      actual: null,
      threshold: null,
    });
  } else if (input.attendancePct < thresholds.attendanceMin) {
    issues.push({
      code: 'ATTENDANCE_BELOW_THRESHOLD',
      metric: 'attendancePct',
      actual: input.attendancePct,
      threshold: thresholds.attendanceMin,
    });
  }
  if (input.flagAttendanceDrop) {
    issues.push({
      code: 'ATTENDANCE_DROPPING',
      metric: 'attendancePct',
      actual: input.attendancePct,
      threshold: thresholds.attendanceMin,
    });
  }

  if (input.homeworkPct === null) {
    issues.push({
      code: 'MISSING_HOMEWORK_DATA',
      metric: 'homeworkPct',
      actual: null,
      threshold: null,
    });
  } else if (input.homeworkPct < thresholds.homeworkMin) {
    issues.push({
      code: 'HOMEWORK_BELOW_THRESHOLD',
      metric: 'homeworkPct',
      actual: input.homeworkPct,
      threshold: thresholds.homeworkMin,
    });
  }
  if (input.flagHomeworkDrop) {
    issues.push({
      code: 'HOMEWORK_DROPPING',
      metric: 'homeworkPct',
      actual: input.homeworkPct,
      threshold: thresholds.homeworkMin,
    });
  }

  const isActive = input.registrationStatus === 'on_going';
  const habitIssue = issues.some((issue) =>
    [
      'ATTENDANCE_BELOW_THRESHOLD',
      'HOMEWORK_BELOW_THRESHOLD',
      'ATTENDANCE_DROPPING',
      'HOMEWORK_DROPPING',
    ].includes(issue.code),
  );

  let label: SystemLabel = 'no_data';
  let interventionLevel: InterventionLevel = 'none';

  if (input.testAverage !== null && input.testAverage < thresholds.greyMax) {
    label = 'grey';
    interventionLevel = isActive ? 'level_3' : 'none';
  } else if (
    input.testAverage !== null &&
    input.testAverage < thresholds.redMax
  ) {
    label = 'red';
    interventionLevel = isActive ? 'level_2' : 'none';
  } else if (habitIssue) {
    label = 'yellow';
    interventionLevel = isActive ? 'level_1' : 'none';
  } else if (
    input.testAverage !== null &&
    input.attendancePct !== null &&
    input.homeworkPct !== null
  ) {
    label = 'green';
  }

  const actionKey = !isActive
    ? 'none'
    : interventionLevel !== 'none'
      ? interventionLevel
      : label === 'no_data'
        ? 'wait'
        : 'none';

  return {
    label,
    interventionLevel,
    issues,
    recommendedAction: ACTIONS[actionKey],
  };
}
