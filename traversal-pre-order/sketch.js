const HEIGHT = 400;
const WIDTH = 800;
const padding = 20;
const radius = 15;
const verticalSpace = 30;

class Node {
  left = null;
  right = null;
  visited = false;
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  background(240);
  frameRate(10);
  textFont('Roboto');
  textSize(24);
  textAlign(LEFT, TOP);
  text('Pre-order (head, left, right)', 20, 20);
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
  drawNode(treeHead, 0, 0);
}

function drawNode(node, y, x, parentCoords) {
  const width = WIDTH - padding * 2;
  const top = Math.sqrt(30 * y) * verticalSpace + padding;
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
  if (node.visited) {
    fill('black');
    strokeWeight(2);
  }

  if (parentCoords) {
    line(left, top, parentCoords.x, parentCoords.y);
  }
  ellipse(left, top, radius, radius);
}

queue = [treeHead];
let stack = [treeHead];
function traversePreorder() {
  const node = stack.pop();
  node.visited = true;
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
