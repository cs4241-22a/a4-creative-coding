import paper from "paper";
export function clientToServerPath(userPath) {
    return { path: userPath.path.exportJSON(), user: userPath.user };
}
export function serverToClientPath(s_userPath) {
    const newPath = new paper.Path();
    newPath.importJSON(s_userPath.path);
    return { path: newPath, user: s_userPath.user };
}
