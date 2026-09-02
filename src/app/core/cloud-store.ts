import {computed, Injectable, signal} from '@angular/core';

import {
    balance as seedBalance,
    buckets as seedBuckets,
    bucketTypePrices,
    cpuSeries,
    cpuSeriesVms,
    CURRENT_ACTOR,
    DISK_PRICE_PER_GB,
    EGRESS_PRICE,
    events as seedEvents,
    pastSpend,
    payments as seedPayments,
    presets,
    projects,
    users as seedUsers,
    vms as seedVms,
} from './cloud-data';
import type {
    AuditEvent,
    Bucket,
    CloudUser,
    NewBucket,
    NewVm,
    Payment,
    Project,
    ProjectId,
    Severity,
    Vm,
    VmPreset,
} from './models';

const TRANSITION_MS = 1200;

@Injectable({providedIn: 'root'})
export class CloudStore {
    readonly project = signal<ProjectId>('infra');

    readonly balance = signal(seedBalance);
    readonly vms = signal<readonly Vm[]>(seedVms);
    readonly buckets = signal<readonly Bucket[]>(seedBuckets);
    readonly users = signal<readonly CloudUser[]>(seedUsers);
    readonly payments = signal<readonly Payment[]>(seedPayments);
    readonly events = signal<readonly AuditEvent[]>(seedEvents);

    readonly projects: readonly Project[] = projects;
    readonly presets: readonly VmPreset[] = presets;

    readonly currentProject = computed<Project>(
        () => this.projects.find((p) => p.id === this.project()) ?? this.projects[0],
    );

    readonly projectVms = computed(() => this.vms().filter((vm) => vm.projectId === this.project()));
    readonly projectBuckets = computed(() => this.buckets().filter((b) => b.projectId === this.project()));

    readonly runningCount = computed(() => this.projectVms().filter((vm) => vm.status === 'running').length);
    readonly stoppedCount = computed(() => this.projectVms().filter((vm) => vm.status === 'stopped').length);
    readonly errorCount = computed(() => this.projectVms().filter((vm) => vm.status === 'error').length);

    readonly quotaUsage = computed(() => {
        const {quotas} = this.currentProject();
        const vms = this.projectVms();

        return {
            vcpu: this.sum(vms, (vm) => this.preset(vm.presetId).vcpu, quotas.vcpu),
            ramGb: this.sum(vms, (vm) => this.preset(vm.presetId).ramGb, quotas.ramGb),
            diskGb: this.sum(vms, (vm) => vm.diskGb, quotas.diskGb),
            publicIp: this.sum(vms, (vm) => (vm.ipPublic ? 1 : 0), quotas.publicIp),
        };
    });

    readonly vmCost = computed(() =>
        this.projectVms().reduce((total, vm) => total + this.vmMonthlyCost(vm), 0),
    );

    readonly storageCost = computed(() =>
        Math.round(
            this.projectBuckets().reduce((total, b) => total + b.usedGb * bucketTypePrices[b.type], 0),
        ),
    );

    readonly monthForecast = computed(() => Math.round(this.vmCost() + this.storageCost() + EGRESS_PRICE));

    readonly spendSeries = computed(() => [
        ...pastSpend,
        {month: 'сен', amount: Math.round(this.monthForecast())},
    ]);

    readonly busiestVm = computed(() => {
        const name = cpuSeriesVms[this.project()];

        return this.projectVms().find((vm) => vm.name === name) ?? null;
    });

    readonly cpuHistory = computed(() => cpuSeries[this.project()]);

    readonly recentEvents = computed(() => this.events().slice(0, 6));
    readonly unreadSignals = computed(() =>
        this.events().filter((e) => e.severity !== 'info').slice(0, 8),
    );

    preset(presetId: string): VmPreset {
        return this.presets.find((p) => p.id === presetId) ?? this.presets[0];
    }

    vmMonthlyCost(vm: Vm): number {
        const compute = vm.status === 'running' || vm.status === 'starting' ? this.preset(vm.presetId).pricePerMonth : 0;

        return compute + vm.diskGb * DISK_PRICE_PER_GB;
    }

    bucketMonthlyCost(bucket: Bucket): number {
        return Math.round(bucket.usedGb * bucketTypePrices[bucket.type]);
    }

    bucketTypePrice(type: Bucket['type']): number {
        return bucketTypePrices[type];
    }

    switchProject(id: ProjectId): void {
        this.project.set(id);
    }

    startVm(id: string): void {
        this.transitionVm(id, 'starting', 'running', 'ВМ запущена');
    }

    stopVm(id: string): void {
        this.transitionVm(id, 'stopping', 'stopped', 'ВМ остановлена');
    }

    restartVm(id: string): void {
        this.transitionVm(id, 'restarting', 'running', 'ВМ перезапущена');
    }

    deleteVm(id: string): void {
        const vm = this.vms().find((candidate) => candidate.id === id);

        if (!vm) {
            return;
        }

        this.vms.update((vms) => vms.filter((candidate) => candidate.id !== id));
        this.log('warning', 'ВМ удалена', `${vm.id} · ${vm.name}`);
    }

    createVm(input: NewVm): void {
        const id = `vm-${crypto.randomUUID().slice(0, 4)}`;
        const internal = `10.10.${10 + Math.floor(Math.random() * 9)}.${20 + Math.floor(Math.random() * 200)}`;

        const vm: Vm = {
            ...input,
            id,
            status: 'starting',
            ipInternal: internal,
            ipPublic: null,
            cpu: 0,
            ram: 0,
            stack: '—',
            createdAt: new Date().toISOString().slice(0, 10),
        };

        this.vms.update((vms) => [vm, ...vms]);
        this.log('info', 'Создана ВМ', `${id} · ${vm.name}`);

        setTimeout(() => {
            this.vms.update((vms) =>
                vms.map((candidate) =>
                    candidate.id === id
                        ? {...candidate, status: 'running', cpu: 4, ram: 12, ipPublic: '84.201.129.77'}
                        : candidate,
                ),
            );
        }, TRANSITION_MS);
    }

    createBucket(input: NewBucket): void {
        const bucket: Bucket = {
            ...input,
            id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
            usedGb: 0,
        };

        this.buckets.update((buckets) => [bucket, ...buckets]);
        this.log('info', 'Создан бакет', `${bucket.id} · ${bucket.name}`);
    }

    deleteBucket(id: string): void {
        const bucket = this.buckets().find((candidate) => candidate.id === id);

        if (!bucket) {
            return;
        }

        this.buckets.update((buckets) => buckets.filter((candidate) => candidate.id !== id));
        this.log('warning', 'Бакет удалён', `${bucket.id} · ${bucket.name}`);
    }

    inviteUser(email: string, role: CloudUser['role']): void {
        const user: CloudUser = {
            id: `u-${Math.floor(10 + Math.random() * 89)}`,
            email,
            name: email.split('@')[0],
            role,
            lastActiveAt: new Date().toISOString().slice(0, 16),
            invited: true,
        };

        this.users.update((users) => [...users, user]);
        this.log('info', `Приглашение пользователя с ролью ${role}`, email);
    }

    removeUser(id: string): void {
        const user = this.users().find((candidate) => candidate.id === id);

        if (!user) {
            return;
        }

        this.users.update((users) => users.filter((candidate) => candidate.id !== id));
        this.log('warning', 'Доступ отозван', user.email);
    }

    topUp(amount: number, method = 'карта'): void {
        this.balance.update((balance) => balance + amount);
        this.payments.update((payments) => [
            {
                id: `pay-${Math.floor(1000 + Math.random() * 9000)}`,
                at: new Date().toISOString().slice(0, 10),
                amount,
                description: `Пополнение лицевого счёта (${method})`,
            },
            ...payments,
        ]);
        this.log('info', 'Пополнение лицевого счёта', `${amount.toLocaleString('ru-RU')} ₽`);
    }

    private transitionVm(id: string, transient: Vm['status'], final: Vm['status'], action: string): void {
        const vm = this.vms().find((candidate) => candidate.id === id);

        if (!vm) {
            return;
        }

        this.patchVm(id, {status: transient});

        setTimeout(() => {
            this.patchVm(id, {
                status: final,
                cpu: final === 'running' ? 3 : 0,
                ram: final === 'running' ? 9 : 0,
            });
            this.log('info', action, `${vm.id} · ${vm.name}`);
        }, TRANSITION_MS);
    }

    private patchVm(id: string, patch: Partial<Vm>): void {
        this.vms.update((vms) => vms.map((vm) => (vm.id === id ? {...vm, ...patch} : vm)));
    }

    private log(severity: Severity, action: string, target: string): void {
        this.events.update((events) => [
            {
                id: `ev-${Math.floor(1000 + Math.random() * 9000)}`,
                at: new Date().toISOString().slice(0, 16),
                severity,
                action,
                target,
                actor: CURRENT_ACTOR,
            },
            ...events,
        ]);
    }

    private sum(vms: readonly Vm[], pick: (vm: Vm) => number, quota: number): {used: number; quota: number} {
        return {used: vms.reduce((total, vm) => total + pick(vm), 0), quota};
    }
}
