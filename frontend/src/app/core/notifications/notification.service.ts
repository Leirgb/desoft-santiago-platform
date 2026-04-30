import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import type { SweetAlertIcon } from 'sweetalert2';

export type ConfirmButtonTone = 'primary' | 'danger';

export interface ConfirmDialogOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
  confirmButtonTone?: ConfirmButtonTone;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  async confirmAction(options: ConfirmDialogOptions = {}): Promise<boolean> {
    const confirmButtonClass =
      options.confirmButtonTone === 'danger'
        ? 'ds-swal-button ds-swal-button--danger'
        : 'ds-swal-button ds-swal-button--primary';

    const result = await Swal.fire({
      target: 'body',
      heightAuto: false,
      returnFocus: false,
      title: options.title ?? '¿Confirmas esta acción?',
      text: options.text ?? 'Revisa la información antes de continuar.',
      icon: options.icon ?? 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? 'Sí, continuar',
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      buttonsStyling: false,
      customClass: {
        container: 'ds-swal-container',
        popup: 'ds-swal-popup',
        title: 'ds-swal-title',
        htmlContainer: 'ds-swal-text',
        icon: 'ds-swal-icon',
        actions: 'ds-swal-actions',
        confirmButton: confirmButtonClass,
        cancelButton: 'ds-swal-button ds-swal-button--secondary',
      },
    });

    return result.isConfirmed;
  }

  confirmDelete(options: ConfirmDialogOptions = {}): Promise<boolean> {
    return this.confirmAction({
      title: options.title ?? '¿Estás seguro?',
      text: options.text ?? 'No podrás revertir esta acción.',
      icon: options.icon ?? 'warning',
      confirmButtonText: options.confirmButtonText ?? 'Sí, eliminar',
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
      confirmButtonTone: 'danger',
    });
  }

  confirmSaveChanges(options: ConfirmDialogOptions = {}): Promise<boolean> {
    return this.confirmAction({
      title: options.title ?? 'Guardar cambios',
      text: options.text ?? 'Se actualizará la información registrada.',
      icon: options.icon ?? 'question',
      confirmButtonText: options.confirmButtonText ?? 'Sí, guardar cambios',
      cancelButtonText: options.cancelButtonText ?? 'Seguir editando',
      confirmButtonTone: 'primary',
    });
  }

  confirmDiscardChanges(options: ConfirmDialogOptions = {}): Promise<boolean> {
    return this.confirmAction({
      title: options.title ?? 'Descartar cambios',
      text: options.text ?? 'Tienes cambios sin guardar. Si continúas, se perderán.',
      icon: options.icon ?? 'warning',
      confirmButtonText: options.confirmButtonText ?? 'Salir sin guardar',
      cancelButtonText: options.cancelButtonText ?? 'Seguir editando',
      confirmButtonTone: 'danger',
    });
  }

  confirmLogout(): Promise<boolean> {
    return this.confirmAction({
      title: 'Cerrar sesión',
      text: 'Saldrás de DesoftSantiago ProjectOps y volverás al login.',
      icon: 'question',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Continuar trabajando',
      confirmButtonTone: 'primary',
    });
  }

  async success(title: string, text?: string): Promise<void> {
    await this.alert('success', title, text);
  }

  async error(title: string, text?: string): Promise<void> {
    await this.alert('error', title, text);
  }

  async info(title: string, text?: string): Promise<void> {
    await this.alert('info', title, text);
  }

  toastSuccess(title: string): void {
    this.toast('success', title, 2400);
  }

  toastError(title: string): void {
    this.toast('error', title, 2800);
  }

  toastInfo(title: string): void {
    this.toast('info', title, 2600);
  }

  formInvalid(message = 'Revisa los campos obligatorios del formulario.'): void {
    this.toastError(message);
  }

  private toast(icon: SweetAlertIcon, title: string, timer: number): void {
    void Swal.fire({
      target: 'body',
      toast: true,
      backdrop: false,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      customClass: {
        container: 'ds-swal-container ds-swal-toast-container',
        popup: 'ds-swal-toast',
      },
    });
  }

  private async alert(icon: SweetAlertIcon, title: string, text?: string): Promise<void> {
    await Swal.fire({
      target: 'body',
      heightAuto: false,
      returnFocus: false,
      icon,
      title,
      text,
      confirmButtonText: 'Aceptar',
      buttonsStyling: false,
      customClass: {
        container: 'ds-swal-container',
        popup: 'ds-swal-popup',
        title: 'ds-swal-title',
        htmlContainer: 'ds-swal-text',
        confirmButton: 'ds-swal-button ds-swal-button--primary',
      },
    });
  }
}
