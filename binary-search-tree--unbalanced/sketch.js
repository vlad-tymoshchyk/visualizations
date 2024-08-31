const HEIGHT = 900;
const WIDTH = 1200;
const padding = 20;
const radius = 15;
const verticalSpace = 20;

class Node {
  left = null;
  right = null;
  value = undefined;

  constructor(value) {
    this.value = value;
  }

  leftHeight() {
    if (!this.left) {
      return 0;
    }

    return Math.max(this.left.leftHeight(), this.left.rightHeight()) + 1;
  }

  rightHeight() {
    if (!this.right) {
      return 0;
    }

    return Math.max(this.right.leftHeight(), this.right.rightHeight()) + 1;
  }

  dump() {
    return [
      ...(this.left ? this.left.dump() : []),
      this.value,
      ...(this.right ? this.right.dump() : []),
    ];
  }
}

class Tree {
  head = null;
  add(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
    } else {
      this.addToNode(this.head, node);
    }
  }

  addToNode(parentNode, nodeToAdd) {
    if (nodeToAdd.value <= parentNode.value) {
      if (parentNode.left) {
        this.addToNode(parentNode.left, nodeToAdd);
      } else {
        parentNode.left = nodeToAdd;
      }
    } else {
      if (parentNode.right) {
        this.addToNode(parentNode.right, nodeToAdd);
      } else {
        parentNode.right = nodeToAdd;
      }
    }
  }
}

const tree = new Tree();
let nodesCount = 0;

async function fillInTree() {
  for (let i = 0; i < 1000; i++) {
    await wait(10);
    tree.add(Math.floor(Math.random() * 100));
    nodesCount++;
  }
}

// --------
async function setup() {
  fillInTree();
  createCanvas(WIDTH, HEIGHT);
  background(240);
  frameRate(10);
}

async function wait(time) {
  return new Promise((r) => setTimeout(r, time));
}

function createTreeOfHeight(height) {
  const treeHead = new Node();
  let queue = [treeHead];
  for (let i = 0; i < height; i++) {
    const prevLevelSize = queue.length;
    // fill level
    for (let j = 0; j < prevLevelSize; j++) {
      console.log('i, j', i, j);
      const cur = queue.shift();
      cur.left = new Node();
      cur.right = new Node();
      queue.push(cur.left);
      queue.push(cur.right);
    }
  }
  return treeHead;
}
let treeHead = createTreeOfHeight(5);

function draw() {
  clear();
  drawNode(tree.head, 0, 0);

  textFont('Roboto');
  textSize(24);
  textAlign(LEFT, TOP);
  text('AVL', 20, 20);
  text('nodes: ' + nodesCount, WIDTH - 120, 20);
}

function drawNode(node, y, x, parentCoords) {
  const width = WIDTH - padding * 2;
  const top = y * verticalSpace + padding;
  const rowSize = 2 ** y;
  const space = width / rowSize;
  const paddingLeft = (width - (rowSize - 1) * space) / 2;
  const left = x * space + padding + paddingLeft;

  if (node.left) {
    drawNode(node.left, y + 1, x * 2, { x: left, y: top });
  }
  if (node.right) {
    drawNode(node.right, y + 1, x * 2 + 1, { x: left, y: top });
  }

  fill('white');
  stroke('black');
  strokeWeight(1);

  if (parentCoords) {
    line(left, top, parentCoords.x, parentCoords.y);
  }
  ellipse(left, top, radius, radius);

  textAlign(CENTER, CENTER);
  textSize(8);

  strokeWeight(0.1);
  fill('black');
  text(node.value, left, top);
}

queue = [treeHead];
let stack = [treeHead];
function traversePreorder() {
  const node = stack.pop();
  if (node.right) {
    stack.push(node.right);
  }
  if (node.left) {
    stack.push(node.left);
  }
}

const timeout = 0.1 * 1000;

function onTimeout() {
  traversePreorder();
  if (!stack.length) {
    treeHead = createTreeOfHeight(5);
    stack = [treeHead];
  }
  setTimeout(onTimeout, timeout);
}
setTimeout(onTimeout, timeout);
