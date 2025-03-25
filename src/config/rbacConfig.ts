const permittedActions: Record<string, string[]> = {
	admin: ["create", "read", "update", "delete"],
	moderator: ["create", "read"],
	user: ["read"]
}

export default permittedActions;
