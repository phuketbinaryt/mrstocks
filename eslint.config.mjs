import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: [
      'design_handoff_mrstocks/**',
      '.next/**',
      'node_modules/**',
      'drizzle/**',
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
