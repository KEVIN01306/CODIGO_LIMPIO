/**
 * Resolves the SEB configuration according to precedence:
 * 1. Assessment-specific configuration (takes precedence)
 * 2. Tenant default fallback configuration
 *
 * Returns the resolved configuration or null if neither exists/is valid.
 */
export function resolveSebConfiguration(assessment, tenant) {
    // 1. Check Assessment-specific configuration
    const assessmentKey = assessment?.sebConfigKey?.trim();
    const assessmentUrl = assessment?.sebConfigFilePath?.trim();
    if (assessmentKey && assessmentUrl) {
        return {
            sebConfigKey: assessmentKey,
            sebConfigUrl: assessmentUrl,
            source: 'assessment',
        };
    }
    // 2. Check Tenant default fallback configuration
    const tenantKey = tenant?.defaultSebConfigKey?.trim();
    const tenantUrl = tenant?.defaultSebConfigFilePath?.trim();
    if (tenantKey && tenantUrl) {
        return {
            sebConfigKey: tenantKey,
            sebConfigUrl: tenantUrl,
            source: 'tenant',
        };
    }
    return null;
}
//# sourceMappingURL=resolve-seb-config.helper.js.map