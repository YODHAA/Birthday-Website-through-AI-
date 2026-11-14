import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthdayService } from './services/birthday';
import { Sidebar } from './components/sidebar';
import { Dashboard } from './components/dashboard';
import { Calendar } from './components/calendar';
import { NotificationsLog } from './components/notifications-log';
import { Settings } from './components/settings';
import { BirthdayModal } from './components/birthday-modal';
import { DeleteModal } from './components/delete-modal';
import { Birthday } from './models/birthday';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    CommonModule,
    Sidebar,
    Dashboard,
    Calendar,
    NotificationsLog,
    Settings,
    BirthdayModal,
    DeleteModal
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly birthdayService = inject(BirthdayService);

  readonly showAddModal = signal<boolean>(false);
  readonly birthdayToEdit = signal<Birthday | null>(null);
  readonly birthdayToDelete = signal<Birthday | null>(null);

  openAddModal() {
    this.birthdayToEdit.set(null);
    this.showAddModal.set(true);
  }

  openEditModal(b: Birthday) {
    this.birthdayToEdit.set(b);
    this.showAddModal.set(true);
  }

  openDeleteModal(b: Birthday) {
    this.birthdayToDelete.set(b);
  }
}
