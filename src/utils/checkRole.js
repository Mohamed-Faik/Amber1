/**
 * Check if user has admin privileges (ADMIN, MODERATOR, or SUPPORT)
 */
export function isAdmin(user) {
	return user?.role === "ADMIN";
}

/**
 * Check if user has moderator privileges (ADMIN or MODERATOR)
 */
export function isModerator(user) {
	return user?.role === "ADMIN" || user?.role === "MODERATOR";
}

/**
 * Check if user has support privileges (ADMIN, MODERATOR, or SUPPORT)
 */
export function isSupport(user) {
	return user?.role === "ADMIN" || user?.role === "MODERATOR" || user?.role === "SUPPORT";
}

/**
 * Check if user has any admin-level access
 */
export function hasAdminAccess(user) {
	return isSupport(user);
}

