// src/environments/environment.ts
export const environment = {
  production: false,
  backUrl: '${ENV_BACKEND_URI}', // URL de développement
  // backUrl: 'https://127.0.0.1:5050', // URL de développement
  frontUrl: '${FRONT_URI}',
  // frontUrl: 'https://localhost:4200',
  googleKey: '${GOOGLE_API_KEY}'
  // googleKey: 'AIzaSyBMreuA5LC2BJ2f-HFPPhYISSIu0mSS2Gs'
};
