export type VmStatus = 'running' | 'stopped' | 'starting' | 'stopping' | 'restarting' | 'error';

export type Region = 'msk-1' | 'spb-1';

export type BucketType = 'ssd' | 'standard' | 'cold';

export type UserRole = 'owner' | 'admin' | 'developer' | 'billing' | 'reader';

export type Severity = 'info' | 'warning' | 'error';

export type ProjectId = 'infra' | 'analytics';

export interface Project {
    readonly id: ProjectId;
    readonly name: string;
    readonly description: string;
    readonly quotas: Readonly<Record<'vcpu' | 'ramGb' | 'diskGb' | 'publicIp', number>>;
}

export interface VmPreset {
    readonly id: string;
    readonly name: string;
    readonly vcpu: number;
    readonly ramGb: number;
    readonly pricePerMonth: number;
}

export interface Vm {
    readonly id: string;
    readonly name: string;
    readonly projectId: ProjectId;
    readonly status: VmStatus;
    readonly region: Region;
    readonly presetId: string;
    readonly ipInternal: string;
    readonly ipPublic: string | null;
    readonly diskGb: number;
    readonly cpu: number;
    readonly ram: number;
    readonly stack: string;
    readonly createdAt: string;
}

export interface Bucket {
    readonly id: string;
    readonly name: string;
    readonly projectId: ProjectId;
    readonly type: BucketType;
    readonly usedGb: number;
    readonly quotaGb: number;
}

export interface Payment {
    readonly id: string;
    readonly at: string;
    readonly amount: number;
    readonly description: string;
}

export interface CloudUser {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly role: UserRole;
    readonly lastActiveAt: string;
    readonly invited: boolean;
}

export interface AuditEvent {
    readonly id: string;
    readonly at: string;
    readonly severity: Severity;
    readonly action: string;
    readonly target: string;
    readonly actor: string;
}

export interface NewVm {
    readonly name: string;
    readonly projectId: ProjectId;
    readonly region: Region;
    readonly presetId: string;
    readonly diskGb: number;
}

export interface NewBucket {
    readonly name: string;
    readonly projectId: ProjectId;
    readonly type: BucketType;
    readonly quotaGb: number;
}
