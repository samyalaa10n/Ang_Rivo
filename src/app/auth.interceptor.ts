import { HttpInterceptorFn } from '@angular/common/http';
import { Tools } from './shared/service/Tools';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _tools = inject(Tools);

  const logInfo = localStorage.getItem('logInfo');
  
  const logInfo_obj=JSON.parse(logInfo??"{tokeN_GENERATE:''}");
  const clonedRequest = logInfo
    ?req.clone({
        setHeaders: {
          Authorization: `${logInfo_obj.tokeN_GENERATE}`,
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
        if(error?.error?.title ==="رجاء تسجيل الدخول أولًا")
          {
            localStorage.removeItem("logInfo");
            _tools._router.navigate(['Login']);
            _tools.hubConnection?.stop();
          }
        _tools.Toaster.showError(error?.error?.title || 'Unknown Error');
        if(error?.error?.detail)
        _tools.Toaster.showError(error?.error.detail || 'Unknown Error');
      },
    })
  );
};