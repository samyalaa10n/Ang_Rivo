import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn|CanActivateChildFn = (route, state) => {
  const _router = inject(Router);
  if (localStorage.getItem("logInfo") == null) {
    _router.navigate(['Login'])
    return false;
  }
  return true;
};
