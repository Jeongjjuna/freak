export const CATEGORY_GROUPS = {
  Engineering: [
    'Architecture',
    'Troubleshooting',
    'Performance',
    'Algorithm',
  ],

  Learning: [
    'API',
    'SpringBoot',
    'SpringBatch',
    'SpringSecurity',
    'JPA',
    'MySQL',
    'RabbitMQ',
    'Kafka',
    'Redis',
    'Linux',
    'Docker',
    'Git',
    'Kubernetes',
    'Security',
    'Testing',
  ],

  Archive: [
    'Books',
    'Activities',
    'Thoughts',
  ],
} as const

export type CategoryGroupName = keyof typeof CATEGORY_GROUPS
