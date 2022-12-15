import { readFileSync } from 'fs';
import { splitNumberMatrix } from '../utils/strings';
import { max, reverseRows, transpose } from '../utils/arrays';
import path from 'path';

class Tree {
    constructor(public readonly height: number, public visible = false) { }
}

/**
 * "A tree is visible if all of the other trees between it and an edge of the grid are
 * shorter than it. Only consider trees in the same row or column; that is, only look up,
 * down, left, or right from any given tree."
 */
function updateTreeVisibilities(grid: Tree[][]): void {
    // rotate the trees in all orientations to check if the trees are visible from any direction
    let leftToRight = grid;
    let rightToLeft = reverseRows(grid);

    let topToBottom = transpose(grid);
    let bottomToTop = reverseRows(topToBottom);

    [leftToRight, rightToLeft, topToBottom, bottomToTop].forEach(markVisibleTrees);
}

/**
 * Observes each row of trees from the left and marks trees that are visible.
 */
function markVisibleTrees(grid: Tree[][]) {
    grid.forEach(row => {
        let maxHeight = -1;
        row.forEach(tree => {
            if (tree.height > maxHeight) {
                tree.visible = true;
                maxHeight = tree.height;
            }
        });
    });
}

/**
 * Returns the total number of visible trees in the grid.
 */
function countVisibleTrees(grid: Tree[][]): number {
    return grid.flat().filter(tree => tree.visible).length;
}

/**
 * "To measure the viewing distance from a given tree, look up, down, left, and right
 * from that tree; stop if you reach an edge or at the first tree that is the same
 * height or taller than the tree under consideration. (If a tree is right on the edge,
 * at least one of its viewing distances will be zero.)"
 */
function calculateScenicScore(grid: Tree[][], y: number, x: number): number {
    let tree = grid[y][x];

    let horizontal = grid[y];
    let vertical = grid.map(row => row[x]);

    // Get the list of trees on the same horizontal row both to left and right
    let left = countVisibleTreesInSight(tree, horizontal.slice(0, x).reverse());
    let right = countVisibleTreesInSight(tree, horizontal.slice(x + 1));

    // Get the list of trees on the same vertical column both to up and down
    let up = countVisibleTreesInSight(tree, vertical.slice(0, y).reverse());
    let down = countVisibleTreesInSight(tree, vertical.slice(y + 1));

    // "A tree's scenic score is found by multiplying together its viewing
    // distance in each of the four directions."
    return left * right * up * down;
}

/**
 * "Stop if you reach an edge or at the first tree that is the same height or taller
 * than the tree under consideration"
 */
function countVisibleTreesInSight(from: Tree, lineOfSight: Tree[]) {
    let count = 0;
    for (let tree of lineOfSight) {
        count++;
        if (tree.height >= from.height) {
            break;
        }
    }
    return count;
}

/*
 * Part 2: "Content with the amount of tree cover available, the Elves just need to know the best
 * spot to build their tree house: they would like to be able to see a lot of trees."
 */
function getMaxScenicScore(grid: Tree[][]): number {
    let scores = new Array<number>();
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            scores.push(calculateScenicScore(grid, y, x));
        }
    }
    return max(scores);
}

function main() {
    const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
    const heights: number[][] = splitNumberMatrix(puzzleInput, '\n', '');

    /**
     * "Each tree is represented as a single digit whose value is its height, where 0
     * is the shortest and 9 is the tallest. A tree is visible if all of the other
     * trees between it and an edge of the grid are shorter than it.
     */
    const trees = heights.map(row => row.map(num => new Tree(num)));
    updateTreeVisibilities(trees);

    /*
     * "First, determine whether there is enough tree cover here to keep a tree house hidden.
     * To do this, you need to count the number of trees that are visible from outside the
     * grid when looking directly along a row or column."
     */
    console.log('Part 1: the number of visible trees is', countVisibleTrees(trees)); // 1845


    console.log('Part 2: highest scenic score possible is', getMaxScenicScore(trees)); // 230112
}

main();