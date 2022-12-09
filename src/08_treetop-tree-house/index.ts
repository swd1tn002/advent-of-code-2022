import { readFileSync } from 'fs';
import { splitNumberMatrix } from '../utils/strings';
import { max, transpose } from '../utils/arrays';

class Tree {
    height = 0;
    visible = false;

    constructor(height: number) {
        this.height = height;
    }
}


function updateTreeVisibilities(forest: Tree[][]): void {
    // rotate the trees in all orientations to check if the trees are visible from any direction
    let leftToRight = forest;
    let rightToLeft = forest.map(row => [...row].reverse());
    let topToBottom = transpose(forest);
    let bottomToTop = topToBottom.map(row => [...row].reverse());

    [leftToRight, rightToLeft, topToBottom, bottomToTop].forEach(markTreesVisibleFromLeft);
}

function markTreesVisibleFromLeft(treeGrid: Tree[][]) {
    treeGrid.forEach(row => {
        let maxHeight = -1;
        row.forEach(tree => {
            if (tree.height > maxHeight) {
                tree.visible = true;
                maxHeight = tree.height;
            }
        })
    })
}

function countVisibleTrees(trees: Tree[][]): number {
    let count = 0;
    trees.forEach(row => {
        count += row.filter(t => t.visible).length
    })
    return count;
}

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
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
    let left = countVisibleTreesInLineOfSight(tree, horizontal.slice(0, x).reverse());
    let right = countVisibleTreesInLineOfSight(tree, horizontal.slice(x + 1));

    // Get the list of trees on the same vertical column both to up and down
    let up = countVisibleTreesInLineOfSight(tree, vertical.slice(0, y).reverse());
    let down = countVisibleTreesInLineOfSight(tree, vertical.slice(y + 1));

    // "A tree's scenic score is found by multiplying together its viewing
    // distance in each of the four directions."
    return left * right * up * down;
}

/**
 * "Stop if you reach an edge or at the first tree that is the same height or taller
 * than the tree under consideration"
 */
function countVisibleTreesInLineOfSight(from: Tree, lineOfSight: Tree[]) {
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
            let score = calculateScenicScore(grid, y, x);
            scores.push(score);
        }
    }
    return max(scores);
}

console.log('Part 2: highest scenic score possible is', getMaxScenicScore(trees)); // 230112