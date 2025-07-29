import { HttpInterceptorFn } from '@angular/common/http';
import { Tools } from './shared/service/Tools.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _tools = inject(Tools);

  // لو logInfo عبارة عن JSON فيه token
  const token = JSON.parse(localStorage.getItem("logInfo") || '{}').TOKEN;

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(cloned).pipe(
      tap({
        next: () => {},
        error: (error: any) => {
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
