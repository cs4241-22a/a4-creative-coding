
import paper from "paper";

export interface UserPath {
    path: paper.Path;
    user: string;
}

export interface sUserPath {
    path: string;
    user: string;
}

export function clientToServerPath(userPath: UserPath): sUserPath {
    return { path: userPath.path.exportJSON(), user: userPath.user} ;
}

export function serverToClientPath(s_userPath: sUserPath): UserPath {
    const newPath = new paper.Path();
    newPath.importJSON(s_userPath.path);
    return { path: newPath, user: s_userPath.user};
}