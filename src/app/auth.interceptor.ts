import { HttpInterceptorFn } from '@angular/common/http';
import { Tools } from './shared/service/Tools.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _tools = inject(Tools);
  const _router = inject(Router);

  // لو logInfo عبارة عن JSON فيه token
  const token = JSON.parse(localStorage.getItem("logInfo") || '{}').TOKEN;

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`).set('connectionId', _tools.Network.hubConnection?.connectionId || ''),
    });

    return next(cloned).pipe(
      tap({
        error: (error: any) => {
          if (error?.status == 401) {
            localStorage.removeItem("logInfo")
            _tools.Toaster.showError(error?.error.message);
            _router.navigate(['Login'])
            return
          }
          const title = error?.error?.title || 'Unknown Error';
          const detail = error?.error?.detail;
          _tools.Toaster.showError(title);
          if (detail) _tools.Toaster.showError(detail);
        },
      })
    );
  }

  return next(req);
};
