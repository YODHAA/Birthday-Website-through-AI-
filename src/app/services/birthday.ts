import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Birthday, UserProfile, NotificationLog } from '../models/birthday';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {
  private http = inject(HttpClient);

  readonly user = signal<UserProfile | null>(null);
  readonly birthdays = signal<Birthday[]>([]);
  readonly logs = signal<NotificationLog[]>([]);
  readonly activeTab = signal<'dashboard' | 'calendar' | 'notifications' | 'settings'>('dashboard');
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('ALL');

  constructor() {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const [userRes, birthdaysRes, logsRes] = await Promise.all([
        firstValueFrom(this.http.get<UserProfile>('/api/user')),
        firstValueFrom(this.http.get<Birthday[]>('/api/birthdays')),
        firstValueFrom(this.http.get<NotificationLog[]>('/api/logs'))
      ]);
      this.user.set(userRes);
      this.birthdays.set(birthdaysRes);
      this.logs.set(logsRes);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  }

  async updateUser(profile: Partial<UserProfile>) {
    try {
      const updated = await firstValueFrom(this.http.put<UserProfile>('/api/user', profile));
      this.user.set(updated);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  }

  async addBirthday(payload: Omit<Birthday, 'id' | 'userId' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const created = await firstValueFrom(this.http.post<Birthday>('/api/birthdays', payload));
      this.birthdays.update(list => [...list, created]);
      await this.refreshLogs();
      return { success: true };
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const errorMsg = errorObj?.error?.error || 'Failed to add birthday';
      return { success: false, error: errorMsg };
    }
  }

  async updateBirthday(id: string, payload: Partial<Birthday>): Promise<boolean> {
    try {
      const updated = await firstValueFrom(this.http.put<Birthday>(`/api/birthdays/${id}`, payload));
      this.birthdays.update(list => list.map(b => b.id === id ? updated : b));
      return true;
    } catch (err) {
      console.error('Error updating birthday:', err);
      return false;
    }
  }

  async deleteBirthday(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`/api/birthdays/${id}`));
      this.birthdays.update(list => list.filter(b => b.id !== id));
      await this.refreshLogs();
      return true;
    } catch (err) {
      console.error('Error deleting birthday:', err);
      return false;
    }
  }

  async refreshLogs() {
    try {
      const logsRes = await firstValueFrom(this.http.get<NotificationLog[]>('/api/logs'));
      this.logs.set(logsRes);
    } catch (err) {
      console.error('Error refreshing logs:', err);
    }
  }

  async simulateTick() {
    try {
      await firstValueFrom(this.http.post('/api/logs/simulate', {}));
      await this.refreshLogs();
    } catch (err) {
      console.error('Error simulating tick:', err);
    }
  }

  async exportData() {
    try {
      const data = await firstValueFrom(this.http.get<unknown>('/api/export'));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keepdate-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  }

  async importData(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString) as { birthdays?: Birthday[]; user?: Partial<UserProfile> };
      const res = await firstValueFrom(this.http.post<{ success: boolean; count: number }>('/api/import', parsed));
      if (res.success) {
        await this.loadInitialData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error importing data:', err);
      return false;
    }
  }
}
