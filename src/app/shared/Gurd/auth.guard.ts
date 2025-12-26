import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn|CanActivateChildFn = (route, state) => {
  const _router = inject(Router);
  const _ActiveRouter = inject(ActivatedRoute);

  if (localStorage.getItem("logInfo") == null) {
    _router.navigate(['Home'])
    return false;
  }

  return true;
};
