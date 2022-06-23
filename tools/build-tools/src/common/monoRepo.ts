/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { Package, Packages } from "./npmPackage";
import * as path from "path";
import { execWithErrorAsync, rimrafWithErrorAsync, existsSync, readJsonSync } from "./utils";

export enum MonoRepoKind {
    Client = "Client",
    Server = "Server",
    Azure = "Azure",
}

/**
 * A type guard used to determine if a string is a MonoRepoKind.
 */
export function isMonoRepoKind(str: unknown): str is MonoRepoKind {
    return typeof str === "string" && sentenceCase(str) in MonoRepoKind;
}

function sentenceCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * An iterator that returns only the Enum values of MonoRepoKind.
 *
 * TODO: Is there a better approach? for-of Object.values returns both strings and the enum values.
 */
export function* supportedMonoRepoValues(): IterableIterator<MonoRepoKind> {
    yield MonoRepoKind.Client;
    yield MonoRepoKind.Server;
    yield MonoRepoKind.Azure;
}

export class MonoRepo {
    public readonly packages: Package[] = [];
    public readonly version: string;
    constructor(public readonly kind: MonoRepoKind, public readonly repoPath: string, ignoredDirs?: string[]) {
        const lernaPath = path.join(repoPath, "lerna.json");
        if (!existsSync(lernaPath)) {
            throw new Error(`ERROR: lerna.json not found in ${repoPath}`);
        }
        const lerna = readJsonSync(lernaPath);
        for (const dir of lerna.packages as string[]) {
            // TODO: other glob pattern?
            const loadDir = dir.endsWith("/**") ? dir.substr(0, dir.length - 3) : dir;
            this.packages.push(...Packages.loadDir(path.join(this.repoPath, loadDir), MonoRepoKind[kind], ignoredDirs, this));
        }
        this.version = lerna.version;
    }

    public static isSame(a: MonoRepo | undefined, b: MonoRepo | undefined) {
        return a !== undefined && a === b;
    }

    public getNodeModulePath() {
        return path.join(this.repoPath, "node_modules");
    }

    public async install() {
        console.log(`${MonoRepoKind[this.kind]}: Installing - npm i`);
        const installScript = "npm i";
        return execWithErrorAsync(installScript, { cwd: this.repoPath }, this.repoPath);
    }
    public async uninstall() {
        return rimrafWithErrorAsync(this.getNodeModulePath(), this.repoPath);
    }
}
