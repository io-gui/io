//@ts-nocheck
import { IoElement, Register, div, span, h4, p, NODES } from '@io-gui/core';
import { ioCollapsible } from '@io-gui/navigation';
import { ioIcon } from '@io-gui/icons';
const nodeMap = new Map();
const MAX_CHILDREN = 24;
const roots = {
    id: 'roots',
    children: []
};
let counter = 0;
function initNodeInfo(node) {
    if (nodeMap.has(node)) {
        return nodeMap.get(node);
    }
    else {
        const nodeInfo = {
            id: `node-${counter++}`,
            node: node,
            children: []
        };
        nodeMap.set(node, nodeInfo);
        return nodeInfo;
    }
}
NODES.active.forEach(node => {
    const nodeInfo = initNodeInfo(node);
    if (node._parents.length === 0) {
        if (roots.children.length < MAX_CHILDREN) {
            roots.children.push(nodeInfo);
        }
    }
    else {
        node._parents.forEach(parent => {
            const parentInfo = initNodeInfo(parent);
            if (parentInfo.children.length < MAX_CHILDREN) {
                parentInfo.children.push(nodeInfo);
            }
        });
    }
});
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
canvas.style.position = 'absolute';
canvas.style.bottom = '0';
canvas.style.right = '0';
canvas.style.zIndex = '1000';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);
const canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 };
const scale = Math.min(canvas.width, canvas.height) / 60;
const ctx = canvas.getContext('2d');
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const nodeCount = Object.keys(nodes).length;
    if (nodeCount === 0) {
        // Draw debug text if no nodes
        ctx.fillStyle = 'red';
        ctx.font = '12px Arial';
        ctx.fillText('No nodes to render', 10, 20);
        return;
    }
    // Draw connections first (so they appear behind nodes)
    Object.values(nodes).forEach(node => {
        node.connections.forEach(connection => {
            const fromX = canvasCenter.x + connection.nodeA.position.x * scale;
            const fromY = canvasCenter.y + connection.nodeA.position.y * scale;
            const toX = canvasCenter.x + connection.nodeB.position.x * scale;
            const toY = canvasCenter.y + connection.nodeB.position.y * scale;
            ctx.strokeStyle = connection.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
        });
    });
    // Draw nodes
    Object.values(nodes).forEach(node => {
        const x = canvasCenter.x + node.position.x * scale;
        const y = canvasCenter.y + node.position.y * scale;
        const radius = node.radius * scale;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
}
class SimulatedNode {
    constructor(name, position, node) {
        this.name = name;
        this.position = position;
        this.children = [];
        this.parent = null;
        this.node = node; // Reference to the actual io-core node
        this.createVisual();
        this.setupEventListeners();
    }
    createVisual() {
        this.radius = 0.5; // Increased from 0.5 to make nodes more visible
        this.color = '#2196F3';
        this.originalColor = '#2196F3';
        this.connections = [];
    }
    // Helper method to interpolate between hex colors
    lerpColor(color1, color2, progress) {
        const hex1 = parseInt(color1.replace('#', ''), 16);
        const hex2 = parseInt(color2.replace('#', ''), 16);
        const r1 = (hex1 >> 16) & 255;
        const g1 = (hex1 >> 8) & 255;
        const b1 = hex1 & 255;
        const r2 = (hex2 >> 16) & 255;
        const g2 = (hex2 >> 8) & 255;
        const b2 = hex2 & 255;
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    setupEventListeners() {
        if (this.node) {
            this.node.addEventListener('io-object-mutation', () => {
                this.animateMutation();
            });
        }
    }
    animateMutation() {
        const originalColor = this.originalColor;
        const mutationColor = '#FFFF00'; // Yellow
        this.animateColor(originalColor, mutationColor, 150, () => {
            this.animateColor(mutationColor, originalColor, 800);
        });
    }
    animateColor(from, to, duration, callback) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.color = this.lerpColor(from, to, progress);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else if (callback) {
                callback();
            }
        };
        animate();
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
        return this.createConnection(child);
    }
    createConnection(child) {
        const connection = {
            nodeA: this,
            nodeB: child,
            color: '#666666'
        };
        this.connections.push(connection);
        return connection;
    }
}
function calculateRadialPositions(treeData) {
    const positions = {};
    const levelRadius = 4;
    const levelSpacing = 3;
    const minNodeSpacing = 0.8;
    const clusterSeparation = 25; // Distance between cluster centers
    // First, position each top-level cluster (roots children) in a circle
    const topLevelClusters = treeData.children || [];
    const clusterCenters = {};
    topLevelClusters.forEach((cluster, index) => {
        const angle = (index / topLevelClusters.length) * Math.PI * 2;
        const centerX = Math.cos(angle) * clusterSeparation;
        const centerY = Math.sin(angle) * clusterSeparation;
        clusterCenters[cluster.id] = { x: centerX, y: centerY };
    });
    function positionNode(node, level = 0, parentAngle = 0, availableAngle = Math.PI * 2, siblingIndex = 0, siblingCount = 1, clusterCenter = { x: 0, y: 0 }) {
        // Skip positioning for roots since it won't be rendered
        if (node.id !== 'roots') {
            const radius = level * levelRadius + levelSpacing;
            let angle;
            if (level === 0) {
                angle = 0;
            }
            else {
                if (level === 1) {
                    angle = (siblingIndex / siblingCount) * Math.PI * 2;
                }
                else {
                    const angleStep = availableAngle / siblingCount;
                    angle = parentAngle - availableAngle / 2 + angleStep * (siblingIndex + 0.5);
                }
            }
            // Position relative to cluster center - step by step debugging
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            const localX = radius * cosAngle * 2;
            const localY = radius * sinAngle * 2;
            const x = clusterCenter.x + localX;
            const y = clusterCenter.y + localY;
            positions[node.id] = { x, y, z: 0 };
        }
        if (node.children && node.children.length > 0) {
            // For roots children, treat them as level 0 (root level) with their own cluster center
            const effectiveLevel = node.id === 'roots' ? -1 : level;
            const currentClusterCenter = node.id === 'roots' ? { x: 0, y: 0 } :
                (clusterCenters[node.id] || clusterCenter);
            const childRadius = (effectiveLevel + 1) * levelRadius + levelSpacing;
            const minAngleForSpacing = minNodeSpacing / childRadius;
            const minTotalAngle = minAngleForSpacing * node.children.length;
            let childAngleSpan;
            if (effectiveLevel === -1) { // roots children get full circle
                childAngleSpan = Math.PI * 2;
            }
            else {
                const maxAngleFromParent = Math.min(availableAngle * 0.9, Math.PI);
                childAngleSpan = Math.max(minTotalAngle, Math.min(maxAngleFromParent, Math.PI * 0.6));
            }
            node.children.forEach((child, index) => {
                const childLevel = node.id === 'roots' ? 0 : level + 1;
                const childAngle = node.id === 'roots' ? 0 : parentAngle;
                const childClusterCenter = node.id === 'roots' ?
                    (clusterCenters[child.id] || { x: 0, y: 0 }) : currentClusterCenter;
                positionNode(child, childLevel, childAngle, childAngleSpan, index, node.children.length, childClusterCenter);
            });
        }
    }
    positionNode(treeData);
    return positions;
}
class ForceDirectedLayout {
    constructor(nodes, connections) {
        this.nodes = nodes;
        this.connections = connections;
        this.forces = {};
        this.velocities = {};
        this.damping = 0.7;
        this.repulsionStrength = 4;
        this.attractionStrength = 0.05;
        this.centerAttractionStrength = 0.01;
        this.linkLength = 2;
        this.maxVelocity = 1;
        this.running = false;
        this.coolingRate = 0.99;
        this.temperature = 0.1;
        this.minTemperature = 0.1;
        Object.keys(nodes).forEach(id => {
            this.forces[id] = { x: 0, y: 0 };
            this.velocities[id] = { x: 0, y: 0 };
        });
    }
    calculateRepulsionForces() {
        const nodeIds = Object.keys(this.nodes);
        // Reset forces
        nodeIds.forEach(id => {
            this.forces[id].x = 0;
            this.forces[id].y = 0;
        });
        // Calculate repulsion between all node pairs
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                const nodeA = this.nodes[nodeIds[i]];
                const nodeB = this.nodes[nodeIds[j]];
                const dx = nodeA.position.x - nodeB.position.x;
                const dy = nodeA.position.y - nodeB.position.y;
                const distanceSquared = dx * dx + dy * dy + 0.01;
                const distance = Math.sqrt(distanceSquared);
                const force = (this.repulsionStrength * this.temperature) / (distanceSquared * distance);
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;
                this.forces[nodeIds[i]].x += fx;
                this.forces[nodeIds[i]].y += fy;
                this.forces[nodeIds[j]].x -= fx;
                this.forces[nodeIds[j]].y -= fy;
            }
        }
    }
    calculateAttractionForces() {
        this.connections.forEach(connection => {
            const nodeA = connection.nodeA;
            const nodeB = connection.nodeB;
            const dx = nodeB.position.x - nodeA.position.x;
            const dy = nodeB.position.y - nodeA.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Adjust link length based on node connectivity
            let linkLength = this.linkLength;
            const nodeAChildren = nodeA.children.length;
            const nodeBChildren = nodeB.children.length;
            if (nodeAChildren > 0) {
                linkLength *= 1 + nodeAChildren ** 0.25;
            }
            if (nodeBChildren > 0) {
                linkLength *= 1 + nodeBChildren ** 0.25;
            }
            const force = this.attractionStrength * this.temperature * (distance ** 2 - linkLength);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            this.forces[nodeA.name].x += fx;
            this.forces[nodeA.name].y += fy;
            this.forces[nodeB.name].x -= fx;
            this.forces[nodeB.name].y -= fy;
        });
    }
    updatePositions() {
        Object.keys(this.nodes).forEach(id => {
            const node = this.nodes[id];
            // Skip roots since it's not in the simulation
            if (id === 'roots') {
                return;
            }
            this.velocities[id].x += this.forces[id].x;
            this.velocities[id].y += this.forces[id].y;
            // Clamp velocity to maximum
            const velocity = Math.sqrt(this.velocities[id].x ** 2 + this.velocities[id].y ** 2);
            if (velocity > this.maxVelocity) {
                this.velocities[id].x = (this.velocities[id].x / velocity) * this.maxVelocity;
                this.velocities[id].y = (this.velocities[id].y / velocity) * this.maxVelocity;
            }
            this.velocities[id].x *= this.damping;
            this.velocities[id].y *= this.damping;
            const newX = node.position.x + this.velocities[id].x;
            const newY = node.position.y + this.velocities[id].y;
            node.position.x = newX;
            node.position.y = newY;
        });
    }
    calculateCenterAttractionForces() {
        Object.keys(this.nodes).forEach(id => {
            const node = this.nodes[id];
            // Skip roots since it's not in the simulation
            if (id === 'roots') {
                return;
            }
            // Calculate distance from center (0, 0)
            const dx = -node.position.x;
            const dy = -node.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy) + 0.01;
            // Apply gentle attraction towards center
            const force = this.centerAttractionStrength * this.temperature * distance;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            this.forces[id].x += fx;
            this.forces[id].y += fy;
        });
    }
    step() {
        this.calculateRepulsionForces();
        this.calculateAttractionForces();
        this.calculateCenterAttractionForces();
        this.updatePositions();
        // Cool down the system
        if (this.temperature > this.minTemperature) {
            this.temperature *= this.coolingRate;
        }
    }
    start() {
        this.running = true;
        this.temperature = 1.0; // Reset temperature when starting
        this.simulate();
    }
    stop() {
        this.running = false;
    }
    reset() {
        this.temperature = 1.0;
        Object.keys(this.nodes).forEach(id => {
            this.forces[id] = { x: 0, y: 0 };
            this.velocities[id] = { x: 0, y: 0 };
        });
    }
    simulate() {
        if (!this.running)
            return;
        this.step();
        requestAnimationFrame(() => this.simulate());
    }
}
function createNodesFromTree(treeData, positions) {
    const nodes = {};
    function createNode(nodeData) {
        // Skip roots from visual representation
        if (nodeData.id !== 'roots') {
            const position = positions[nodeData.id];
            const actualNode = nodeData.node; // Get the actual io-core node reference
            const simulatedNode = new SimulatedNode(nodeData.id, position, actualNode);
            nodes[nodeData.id] = simulatedNode;
        }
        if (nodeData.children) {
            nodeData.children.forEach(child => createNode(child));
        }
    }
    createNode(treeData);
    return nodes;
}
function connectNodes(treeData, nodes) {
    const allConnections = [];
    function connect(nodeData) {
        // Skip roots connections - only connect from its children onwards
        if (nodeData.id !== 'roots') {
            const parentNode = nodes[nodeData.id];
            if (nodeData.children && parentNode) {
                nodeData.children.forEach(childData => {
                    const childNode = nodes[childData.id];
                    if (childNode) {
                        const connection = parentNode.addChild(childNode);
                        allConnections.push(connection);
                    }
                });
            }
        }
        if (nodeData.children) {
            nodeData.children.forEach(childData => {
                connect(childData);
            });
        }
    }
    connect(treeData);
    return allConnections;
}
const positions = calculateRadialPositions(roots);
const nodes = createNodesFromTree(roots, positions);
const connections = connectNodes(roots, nodes);
const forceLayout = new ForceDirectedLayout(nodes, connections);
forceLayout.start();
const animate = () => {
    render();
    requestAnimationFrame(animate);
};
requestAnimationFrame(animate);
export class IoChangeVisualization extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      flex: 1 1 auto;
      overflow: hidden;
    }
    :host > io-collapsible {
      position: absolute;
      display: inline-block;
      max-width: 250px;
      margin: var(--io_spacing2);
    }
    :host h4 {
      font-size: calc(var(--io_fontSize) * 1.1);
      margin: var(--io_spacing) 0;
      padding: 0 var(--io_spacing);
    }
    :host p {
      font-size: calc(var(--io_fontSize) * 1);
      margin: var(--io_spacing2) 0;
      padding: var(--io_spacing);
    }
    :host span {
      font-size: calc(var(--io_fontSize) * 1.2);
      height: var(--io_lineHeight);
      margin-left: var(--io_spacing2);
      vertical-align: top;
    }
    `;
    }
    ready() {
        this.render([
            ioCollapsible({
                label: 'Legend',
                elements: [
                    h4('Io-GUI Node Network Visualization'),
                    p('Interactive visualization of the node relationship network using force-directed layout.'),
                    div({ class: 'legend-item' }, [
                        ioIcon({ class: 'legend-color', value: 'io:circle_fill', style: { fill: '#2196F3' } }),
                        span('Node'),
                    ]),
                ]
            }),
        ]);
    }
}
Register(IoChangeVisualization);
export const ioChangeVisualization = function (arg0) {
    return IoChangeVisualization.vConstructor(arg0);
};
//# sourceMappingURL=IoChangeVisualization.js.map