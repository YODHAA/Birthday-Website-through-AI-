export type Category = 'FAMILY' | 'FRIENDS' | 'COLLEAGUES' | 'OTHER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone: string;
  defaultReminderTime: string;
  defaultOffsets: number[];
  leapYearRule: 'FEB_28' | 'MAR_1';
  notificationsEnabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface Birthday {
  id: string;
  userId: string;
  name: string;
  birthMonth: number; // 1-12
  birthDay: number; // 1-31
  birthYear: number | null;
  category: Category;
  notes: string;
  reminderOffsets: number[];
  isMuted: boolean;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  birthdayName: string;
  channel: string;
  scheduledTime: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'CANCELED';
  message: string;
}
