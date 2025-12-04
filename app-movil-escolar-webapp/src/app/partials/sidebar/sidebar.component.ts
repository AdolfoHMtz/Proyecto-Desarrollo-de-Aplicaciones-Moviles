import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  mobileOpen = false;
  isMobileView = window.innerWidth < 900;
  userRole: string = '';

  constructor(
    private router: Router,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    this.userRole = this.facadeService.getUserGroup();
    console.log('User role in sidebar:', this.userRole);
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth < 900;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar() {
    this.mobileOpen = false;
  }

  logout() {
    this.facadeService.logout().subscribe(
      (response) => {
        console.log('Logout successful');
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      (error) => {
        console.error('Logout error:', error);
        // Fallback: clear local data and navigate anyway
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // Helper methods to check user roles
  isAdmin(): boolean {
    return this.userRole === 'administrador';
  }

  isTeacher(): boolean {
    return this.userRole === 'maestro';
  }

  isStudent(): boolean {
    return this.userRole === 'alumno';
  }

  // Check if user can see admin-only items
  canSeeAdminItems(): boolean {
    return this.isAdmin();
  }

  // Check if user can see teacher-level items
  canSeeTeacherItems(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  // Check if user can see all items (admin, teacher, student)
  canSeeStudentItems(): boolean {
    return this.isAdmin() || this.isTeacher() || this.isStudent();
  }

  // Check if user can see Inicio (admin and teacher only, not student)
  canSeeHomeItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  canSeeRegisterItem(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  // dropdown
  eventosExpanded: boolean = false;
  toggleEventos() {
    this.eventosExpanded = !this.eventosExpanded;
  }
}
