import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

const MyPreset = definePreset(Aura, {
  //Your customizations, see the following sections for examples
  semantic: {
    primary: {
      0: '#ffffff',
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
    }
  }
});

export const appConfig: ApplicationConfig = {

  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(
    withInterceptors([authInterceptor])
  ),
  provideRouter(routes),
  provideClientHydration(withEventReplay()),
  provideAnimationsAsync(),
  provideHttpClient(),
  providePrimeNG({
    translation: {
      accept: 'Aceptar',
      reject: 'Rechazar',
      //translations
    },
    ripple: true,
    theme: {
      preset: MyPreset,
      options: {
        darkModeSelector: '.my-app-dark',
        prefix: 'my',
      }
    },
  })
  ]
};
