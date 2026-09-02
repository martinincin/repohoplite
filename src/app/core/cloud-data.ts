import type {AuditEvent, Bucket, CloudUser, Payment, Project, ProjectId, Vm, VmPreset} from './models';

export const DISK_PRICE_PER_GB = 12;
export const EGRESS_PRICE = 1240;
export const CURRENT_ACTOR = 'martin@remixskill.io';

export const projects: readonly Project[] = [
    {
        id: 'infra',
        name: 'Инфраструктура',
        description: 'Продуктовый контур и CI',
        quotas: {vcpu: 96, ramGb: 240, diskGb: 3072, publicIp: 8},
    },
    {
        id: 'analytics',
        name: 'Аналитика',
        description: 'ETL, витрины и окружения ML',
        quotas: {vcpu: 24, ramGb: 48, diskGb: 512, publicIp: 4},
    },
];

export const presets: readonly VmPreset[] = [
    {id: 's2c4', name: 'Standard 2·4', vcpu: 2, ramGb: 4, pricePerMonth: 1950},
    {id: 's4c8', name: 'Standard 4·8', vcpu: 4, ramGb: 8, pricePerMonth: 3700},
    {id: 'g8c16', name: 'General 8·16', vcpu: 8, ramGb: 16, pricePerMonth: 7100},
    {id: 'm16c32', name: 'Memory 16·32', vcpu: 16, ramGb: 32, pricePerMonth: 13900},
];

export const vms: readonly Vm[] = [
    {id: 'vm-9f21', name: 'api-gateway-prod', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 's4c8', ipInternal: '10.10.1.10', ipPublic: '84.201.128.10', diskGb: 60, cpu: 41, ram: 58, stack: 'nginx 1.25', createdAt: '2025-02-14'},
    {id: 'vm-4a02', name: 'web-frontend-prod-1', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 's2c4', ipInternal: '10.10.1.11', ipPublic: '84.201.128.11', diskGb: 30, cpu: 23, ram: 31, stack: 'nginx 1.25', createdAt: '2025-02-14'},
    {id: 'vm-4a03', name: 'web-frontend-prod-2', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 's2c4', ipInternal: '10.10.1.12', ipPublic: '84.201.128.12', diskGb: 30, cpu: 19, ram: 28, stack: 'nginx 1.25', createdAt: '2025-02-14'},
    {id: 'vm-4a04', name: 'web-frontend-prod-3', projectId: 'infra', status: 'stopped', region: 'msk-1', presetId: 's2c4', ipInternal: '10.10.1.13', ipPublic: null, diskGb: 30, cpu: 0, ram: 0, stack: 'nginx 1.25', createdAt: '2025-02-14'},
    {id: 'vm-77b1', name: 'pg-primary', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 'm16c32', ipInternal: '10.10.3.11', ipPublic: null, diskGb: 240, cpu: 47, ram: 83, stack: 'postgresql 16.2', createdAt: '2025-01-09'},
    {id: 'vm-77b2', name: 'pg-replica-1', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 'g8c16', ipInternal: '10.10.3.12', ipPublic: null, diskGb: 240, cpu: 22, ram: 64, stack: 'postgresql 16.2', createdAt: '2025-01-09'},
    {id: 'vm-77b3', name: 'pg-replica-2', projectId: 'infra', status: 'running', region: 'spb-1', presetId: 'g8c16', ipInternal: '10.20.3.12', ipPublic: null, diskGb: 240, cpu: 18, ram: 61, stack: 'postgresql 16.2', createdAt: '2025-01-09'},
    {id: 'vm-2e08', name: 'redis-cache', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 's4c8', ipInternal: '10.10.2.5', ipPublic: null, diskGb: 20, cpu: 12, ram: 74, stack: 'redis 7.2', createdAt: '2025-03-02'},
    {id: 'vm-c410', name: 'clickhouse-1', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 'g8c16', ipInternal: '10.10.4.7', ipPublic: null, diskGb: 300, cpu: 55, ram: 71, stack: 'clickhouse 24.3', createdAt: '2025-05-21'},
    {id: 'vm-b603', name: 'monitoring', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 's4c8', ipInternal: '10.10.5.2', ipPublic: null, diskGb: 80, cpu: 33, ram: 49, stack: 'prometheus · grafana', createdAt: '2025-04-11'},
    {id: 'vm-d911', name: 'ci-runner-1', projectId: 'infra', status: 'running', region: 'msk-1', presetId: 'g8c16', ipInternal: '10.10.6.3', ipPublic: '84.201.128.30', diskGb: 120, cpu: 67, ram: 52, stack: 'gitlab-runner 16', createdAt: '2025-06-30'},
    {id: 'vm-d912', name: 'ci-runner-2', projectId: 'infra', status: 'stopped', region: 'msk-1', presetId: 'g8c16', ipInternal: '10.10.6.4', ipPublic: null, diskGb: 120, cpu: 0, ram: 0, stack: 'gitlab-runner 16', createdAt: '2025-06-30'},
    {id: 'vm-3f07', name: 'backup-vault', projectId: 'infra', status: 'running', region: 'spb-1', presetId: 's4c8', ipInternal: '10.20.7.9', ipPublic: null, diskGb: 500, cpu: 8, ram: 35, stack: 'restic 0.16', createdAt: '2025-01-09'},
    {id: 'vm-e844', name: 'staging-sandbox', projectId: 'infra', status: 'error', region: 'spb-1', presetId: 's2c4', ipInternal: '10.20.8.4', ipPublic: '84.201.131.9', diskGb: 40, cpu: 0, ram: 0, stack: 'docker compose', createdAt: '2025-08-02'},
    {id: 'vm-a105', name: 'analytics-etl-1', projectId: 'analytics', status: 'running', region: 'msk-1', presetId: 's4c8', ipInternal: '10.10.9.6', ipPublic: null, diskGb: 90, cpu: 44, ram: 63, stack: 'airflow 2.9', createdAt: '2025-07-18'},
    {id: 'vm-a106', name: 'analytics-jupyter', projectId: 'analytics', status: 'running', region: 'msk-1', presetId: 'g8c16', ipInternal: '10.10.9.7', ipPublic: null, diskGb: 150, cpu: 31, ram: 76, stack: 'jupyterhub 4.1', createdAt: '2025-07-18'},
    {id: 'vm-a107', name: 'analytics-mart-sync', projectId: 'analytics', status: 'running', region: 'msk-1', presetId: 's2c4', ipInternal: '10.10.9.8', ipPublic: null, diskGb: 30, cpu: 9, ram: 22, stack: 'dbt 1.8', createdAt: '2025-07-18'},
];

export const bucketTypePrices: Readonly<Record<Bucket['type'], number>> = {
    ssd: 9.8,
    standard: 3.2,
    cold: 1.1,
};

export const buckets: readonly Bucket[] = [
    {id: 'bk-2011', name: 'polus-prod-assets', projectId: 'infra', type: 'standard', usedGb: 412, quotaGb: 512},
    {id: 'bk-1187', name: 'polus-backups', projectId: 'infra', type: 'cold', usedGb: 1840, quotaGb: 2048},
    {id: 'bk-3390', name: 'clickhouse-data', projectId: 'infra', type: 'ssd', usedGb: 930, quotaGb: 1024},
    {id: 'bk-0044', name: 'pg-wal-archive', projectId: 'infra', type: 'ssd', usedGb: 88, quotaGb: 128},
    {id: 'bk-2765', name: 'ci-artifacts', projectId: 'infra', type: 'standard', usedGb: 640, quotaGb: 1024},
    {id: 'bk-0812', name: 'staging-uploads', projectId: 'infra', type: 'standard', usedGb: 12, quotaGb: 64},
    {id: 'bk-0933', name: 'partner-exports', projectId: 'infra', type: 'standard', usedGb: 96, quotaGb: 256},
    {id: 'bk-4402', name: 'ml-datasets', projectId: 'analytics', type: 'cold', usedGb: 5300, quotaGb: 8192},
];

export const users: readonly CloudUser[] = [
    {id: 'u-01', email: 'martin@remixskill.io', name: 'Мартин Ильин', role: 'owner', lastActiveAt: '2026-09-02T17:40', invited: false},
    {id: 'u-02', email: 'anna.k@remixskill.io', name: 'Анна Ковалёва', role: 'admin', lastActiveAt: '2026-09-02T16:12', invited: false},
    {id: 'u-03', email: 'd.orlov@remixskill.io', name: 'Дмитрий Орлов', role: 'developer', lastActiveAt: '2026-09-01T21:03', invited: false},
    {id: 'u-04', email: 'm.sokolova@remixskill.io', name: 'Мария Соколова', role: 'billing', lastActiveAt: '2026-08-29T11:47', invited: false},
    {id: 'u-05', email: 's.larin@remixskill.io', name: 'Сергей Ларин', role: 'reader', lastActiveAt: '2026-08-29T10:02', invited: true},
];

export const payments: readonly Payment[] = [
    {id: 'pay-0051', at: '2026-08-26', amount: 150000, description: 'Пополнение лицевого счёта (карта)'},
    {id: 'pay-0050', at: '2026-08-25', amount: -101214, description: 'Начисление за август'},
    {id: 'pay-0049', at: '2026-07-25', amount: -99400, description: 'Начисление за июль'},
    {id: 'pay-0048', at: '2026-07-12', amount: 150000, description: 'Пополнение лицевого счёта (карта)'},
    {id: 'pay-0047', at: '2026-06-25', amount: -98100, description: 'Начисление за июнь'},
    {id: 'pay-0046', at: '2026-06-03', amount: 150000, description: 'Пополнение лицевого счёта (карта)'},
];

export const balance = 118340;

/** Списания за прошлые месяцы, тыс ₽ → используется в графике биллинга. */
export const pastSpend: readonly {readonly month: string; readonly amount: number}[] = [
    {month: 'окт', amount: 89400},
    {month: 'ноя', amount: 90200},
    {month: 'дек', amount: 92800},
    {month: 'янв', amount: 93100},
    {month: 'фев', amount: 94600},
    {month: 'мар', amount: 95200},
    {month: 'апр', amount: 96400},
    {month: 'май', amount: 97800},
    {month: 'июн', amount: 98100},
    {month: 'июл', amount: 99400},
    {month: 'авг', amount: 101214},
];

/** CPU, %, за последние 24 часа — самые нагруженные ВМ каждого проекта. */
export const cpuSeries: Readonly<Record<ProjectId, readonly number[]>> = {
    infra: [62, 58, 64, 71, 69, 75, 80, 78, 82, 77, 73, 68, 66, 70, 74, 79, 81, 76, 72, 69, 67, 71, 74, 67],
    analytics: [28, 31, 26, 34, 38, 41, 36, 29, 27, 33, 39, 44, 42, 37, 31, 30, 35, 40, 38, 33, 29, 32, 36, 31],
};

export const cpuSeriesVms: Readonly<Record<ProjectId, string>> = {
    infra: 'ci-runner-1',
    analytics: 'analytics-jupyter',
};

export const events: readonly AuditEvent[] = [
    {id: 'ev-1042', at: '2026-09-02T09:12', severity: 'warning', action: 'Квота внешних IP: использовано 5 из 8', target: 'проект Инфраструктура', actor: 'system'},
    {id: 'ev-1041', at: '2026-09-01T18:40', severity: 'info', action: 'ВМ остановлена', target: 'vm-d912 · ci-runner-2', actor: 'anna.k@remixskill.io'},
    {id: 'ev-1040', at: '2026-09-01T09:05', severity: 'info', action: 'Вход в консоль с нового устройства (95.161.218.4)', target: 'martin@remixskill.io', actor: 'martin@remixskill.io'},
    {id: 'ev-1039', at: '2026-08-31T14:22', severity: 'error', action: 'Сбой запуска: нет свободных vCPU в зоне', target: 'vm-e844 · staging-sandbox', actor: 'system'},
    {id: 'ev-1038', at: '2026-08-30T12:31', severity: 'info', action: 'Создан бакет', target: 'bk-0933 · partner-exports', actor: 'anna.k@remixskill.io'},
    {id: 'ev-1037', at: '2026-08-29T10:02', severity: 'info', action: 'Приглашение пользователя с ролью reader', target: 's.larin@remixskill.io', actor: 'martin@remixskill.io'},
    {id: 'ev-1036', at: '2026-08-28T08:00', severity: 'warning', action: 'Прогноз: остатка хватит на 1.2 месяца при текущем потреблении', target: 'лицевой счёт', actor: 'system'},
    {id: 'ev-1035', at: '2026-08-26T15:19', severity: 'info', action: 'Пополнение лицевого счёта', target: '150 000 ₽', actor: 'martin@remixskill.io'},
    {id: 'ev-1034', at: '2026-08-25T00:05', severity: 'info', action: 'Начисление за август', target: '101 214 ₽', actor: 'system'},
    {id: 'ev-1033', at: '2026-08-24T19:48', severity: 'info', action: 'ВМ остановлена для экономии', target: 'vm-4a04 · web-frontend-prod-3', actor: 'anna.k@remixskill.io'},
    {id: 'ev-1032', at: '2026-08-23T03:10', severity: 'error', action: 'Резервное копирование выполнено частично: 3 из 7 копий', target: 'vm-77b1 · pg-primary', actor: 'system'},
    {id: 'ev-1031', at: '2026-08-22T11:26', severity: 'info', action: 'Создан ключ доступа', target: 'ci-runner', actor: 'd.orlov@remixskill.io'},
];
