export interface ResolvedSebConfig {
    sebConfigKey: string;
    sebConfigUrl: string;
    source: 'assessment' | 'tenant';
}
export interface SebConfigurableAssessment {
    sebConfigKey?: string | null;
    sebConfigFilePath?: string | null;
    requireSeb?: boolean;
}
export interface SebConfigurableTenant {
    defaultSebConfigKey?: string | null;
    defaultSebConfigFilePath?: string | null;
}
/**
 * Resolves the SEB configuration according to precedence:
 * 1. Assessment-specific configuration (takes precedence)
 * 2. Tenant default fallback configuration
 *
 * Returns the resolved configuration or null if neither exists/is valid.
 */
export declare function resolveSebConfiguration(assessment?: SebConfigurableAssessment | null, tenant?: SebConfigurableTenant | null): ResolvedSebConfig | null;
//# sourceMappingURL=resolve-seb-config.helper.d.ts.map