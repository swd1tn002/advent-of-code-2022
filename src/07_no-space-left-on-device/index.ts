import path from 'path';
import { readFileSync } from 'fs';
import { min, sum } from '../utils/arrays';
import { splitStringMatrix } from '../utils/strings';

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

/* "You browse around the filesystem to assess the situation and
 * save the resulting terminal output (your puzzle input)."
 */
let terminal = splitStringMatrix(puzzleInput, '$ ', '\n').filter(line => line[0].length > 0);

class Directory {
    readonly subDirectories: { [key: string]: Directory } = {};
    readonly files: { [key: string]: number } = {};
    readonly name: string;
    readonly parent: Directory; // parent directory, or `this` for root directory

    constructor(name: string, parent: Directory | null = null) {
        this.name = name;
        this.parent = parent ?? this;
    }

    /** "The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly." */
    getSize(): number {
        let directories = this.traverseDirectories();
        let sizes = directories.map(dir => Object.values(dir.files)).flat();
        return sum(sizes);
    }

    /** Traverses up the directory tree until root is found and returned. */
    getRoot(): Directory {
        if (this.parent === this) {
            return this;
        }
        return this.parent.getRoot();
    }

    /** Traverses the directory structure from given starting point and returns all in an array. */
    traverseDirectories(): Directory[] {
        let directories: Directory[] = [this];
        for (let subDir of Object.values(this.subDirectories)) {
            directories.push(...subDir.traverseDirectories());
        }
        return directories;
    }
}

/**
 * "Within the terminal output, lines that begin with $ are commands you executed,
 * very much like some modern computers"
 *
 * @returns the context directory after the command being executed
 */
function applyCommand(context: Directory, [line, ...output]: string[]): Directory {
    let [command, param] = line.split(' ');
    switch (command) {
        case 'cd':
            return cd(context, param);
        case 'ls':
            return ls(context, output);
        default:
            throw new Error(`Unknown command ${line}`);
    }
}

/**
 * "cd means change directory. This changes which directory is the current
 * directory, but the specific result depends on the argument"
 *
 * @returns the context directory after the command being executed
 */
function cd(context: Directory, target: string): Directory {
    switch (target) {
        case '/':
            return context.getRoot();
        case '..':
            return context.parent;
        default:
            return context.subDirectories[target];
    }
}

/**
 * "ls means list. It prints out all of the files and directories
 * immediately contained by the current directory"
 *
 * For example:
 * $ ls
 * dir a
 * dir d
 * 14848514 b.txt
 * 8504156 c.dat
 *
 * @returns the context directory after the command being executed
 */
function ls(context: Directory, lsOutput: string[]): Directory {
    for (let line of lsOutput) {
        let [prefix, name] = line.split(' ');
        if (prefix === 'dir') {
            context.subDirectories[name] = new Directory(name, context);
        } else {
            context.files[name] = Number(prefix);
        }
    }
    return context;
}

function main() {
    // "The outermost directory is called /."
    let root = new Directory('/');
    let current = root;

    /* "Within the terminal output, lines that begin with $ are commands
     * you executed, very much like some modern computers" */
    for (let chunk of terminal) {
        current = applyCommand(current, chunk);
    }

    let allDirectories = root.traverseDirectories();

    /*
     * "To begin, find all of the directories with a total size of at most 100000,
     * then calculate the sum of their total sizes."
     */
    const sizeLimit = 100_000;
    let directorySizes = allDirectories.map(dir => dir.getSize());
    let smallDirectories = directorySizes.filter(size => size <= sizeLimit);

    console.log('Part 1: the total size of small directories is', sum(smallDirectories)); // 1743217

    /*
     * Part 2: "The total disk space available to the filesystem is 70 000 000. To run the
     * update, you need unused space of at least 30 000 000. You need to find a directory you
     * can delete that will free up enough space to run the update."
     */
    let totalSpace = 70_000_000;
    let usedSpace = root.getSize();
    let freeSpace = totalSpace - usedSpace;

    let neededSpace = 30_000_000;
    let minSizeToDelete = neededSpace - freeSpace;

    /*
     * "Find the smallest directory that, if deleted, would free up enough space on the filesystem
     * to run the update. What is the total size of that directory?"
     */
    let deletionCandidates = directorySizes.filter(s => s >= minSizeToDelete);

    console.log('Part 2: the smallest directory to free up enough space has size', min(deletionCandidates)); // 8319096
}

main();
