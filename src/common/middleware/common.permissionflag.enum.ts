export enum PermissionFlag {
    FREE_PERMISSION = 1,
    PAID_PERMISSION = 2,
    ANOTHER_PAID_PERMISSION = 4,
    ADMIN_PERMISSION = 8,
    ALL_PERMISSIONS = 2147483647,
}

// Since this is an example project, we kept the flag names fairly generic.