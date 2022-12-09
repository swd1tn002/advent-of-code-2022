import { readFileSync } from "fs";
import { sortNumbers, sum } from "../utils/arrays";
import { splitStringMatrix } from '../utils/strings';

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');

/* "You browse around the filesystem to assess the situation and
 * save the resulting terminal output (your puzzle input)."
 */
let terminal = splitStringMatrix(puzzleInput, '$ ', '\n').filter(line => line[0].length > 0);

/* "The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files).
 * The outermost directory is called /."
 */
class File {
    size: number;
    name: string;

    constructor(size: number, name: string) {
        this.size = size;
        this.name = name;
    }
}

class Directory {
    subDirectories: Map<String, Directory> = new Map<String, Directory>();
    files: Map<String, File> = new Map<String, File>();
    name: string;
    parent: Directory;

    constructor(name: string, parent: Directory | null = null) {
        this.name = name;
        this.parent = parent ?? this;
    }

    /**
     * "The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly."
     */
    getSize(): number {
        let size = 0;
        for (let [name, subdir] of this.subDirectories) {
            size += subdir.getSize();
        }
        for (let [name, file] of this.files) {
            size += file.size;
        }
        return size;
    }
}

/**
 * "Within the terminal output, lines that begin with $ are commands you executed,
 * very much like some modern computers"
 */
function applyCommand([line, ...output]: string[]) {
    let [command, param] = line.split(' ');
    switch (command) {
        case 'cd':
            switch (param) {
                case '/':
                    current = root;
                    break;
                case '..':
                    current = current.parent;
                    break;
                default:
                    current = current.subDirectories.get(param) as Directory;
                    break;
            }
            break;
        case 'ls':
            applyLsOutput(current, output);
            break;
        default:
            throw new Error(`Unknown command ${line}`);
    }
}

/**
 * "ls means list. It prints out all of the files and directories
 * immediately contained by the current directory"
 */
function applyLsOutput(directory: Directory, lsOutput: string[]) {
    for (let line of lsOutput) {
        if (line.startsWith('dir')) {
            let [_dir, name] = line.split(' ');
            let subFolder = new Directory(name, directory);
            directory.subDirectories.set(name, subFolder);
        } else {
            let [sizeStr, name] = line.split(' ');
            let file = new File(Number(sizeStr), name);
            directory.files.set(name, file);
        }
    }
}


// "The outermost directory is called /."
const root = new Directory('/');
let current = root;

/* "Within the terminal output, lines that begin with $ are commands
 * you executed, very much like some modern computers" */
for (let chunk of terminal) {
    applyCommand(chunk);
}

/**
 * Traverses the folder structure from given starting point and returns all directories.
 */
function getAllDirectories(current: Directory): Directory[] {
    let directories = [current];
    for (let subDir of current.subDirectories.values()) {
        directories.push(...getAllDirectories(subDir));
    }
    return directories;
}

let allDirectories = getAllDirectories(root);

/*
 * "To begin, find all of the directories with a total size of at most 100000,
 * then calculate the sum of their total sizes."
 */
let directorySizes = allDirectories.map(dir => dir.getSize());
let smallDirectories = directorySizes.filter(size => size <= 100_000);

console.log('Part 1: the total size of small directories is', sum(smallDirectories)); // 1743217


/*
 * Part 2: "The total disk space available to the filesystem is 70000000. To run the
 * update, you need unused space of at least 30000000. You need to find a directory you
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

console.log('Part 2: the smallest directory to free up enough space has size', sortNumbers(deletionCandidates)[0]); // 8319096
