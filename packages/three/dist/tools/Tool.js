export function toolAllowsProfile(tool, profile) {
    return (tool.profiles ?? ['full']).includes(profile);
}
