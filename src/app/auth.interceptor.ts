import { HttpInterceptorFn } from '@angular/common/http';
import { Tools } from './shared/service/Tools';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _tools = inject(Tools);

  const logInfo = localStorage.getItem('logInfo');
  const clonedRequest = logInfo
    ?req.clone({
        setHeaders: {
          Authorization: `${logInfo}`,
        },
      })
    : req;

  return next(clonedRequest).pipe(
    tap({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
        _tools.Toaster.showError(error?.error || 'Unknown Error');
        if(error?.error?.detail)
        _tools.Toaster.showError(error?.error.detail || 'Unknown Error');
      },
    })
  );
};