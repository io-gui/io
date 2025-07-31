import { IoElement, Register, div, span, h4, p, canvas, NODES } from 'io-gui';
import { ioCollapsible } from 'io-navigation';
import { ioIcon } from 'io-icons';

const nodeMap = new Map();

const MAX_CHILDREN = 14;

const treeRoot = {
  id: 'treeRoot',
  children: []
};

let counter = -1;
function initNodeInfo(node) {
  if (nodeMap.has(node)) {
    return nodeMap.get(node);
  } else {
    const nodeInfo = {
      id: `node-${counter++}`,
      node: node,
      children: []
    }
    nodeMap.set(node, nodeInfo);
    return nodeInfo;
  }
}

NODES.active.forEach(node => {
  const nodeInfo = initNodeInfo(node);
  if (node._parents.length === 0) {
    treeRoot.children.push(nodeInfo);
  } else {
    node._parents.forEach(parent => {
      const parentInfo = initNodeInfo(parent);
      if (parentInfo.children.length < MAX_CHILDREN) {
        parentInfo.children.push(nodeInfo);
      }
    });
  }
});



export class IoChangeVisualization extends IoElement {
  static get Style() {
    return /* css */`
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

  onResized() {
    const rect = this.getBoundingClientRect();
    this.$.canvas.width = rect.width;
    this.$.canvas.height = rect.height;
    this.canvasCenter.x = this.$.canvas.width / 2;
    this.canvasCenter.y = this.$.canvas.height / 2;
    this.scale = Math.min(this.$.canvas.width, this.$.canvas.height) / 60;
  }
  init() {
    this.canvasCenter = { x: 0, y: 0 };
    this.scale = 20;
    this.isVisible = false;
    this.animationId = null;
  }
  ready() {
    this.render([
      ioCollapsible({
        label: 'Legend',
        elements: [
          h4('Io-GUI Change/Mutation Event Propagation'),
          p('Watch how events flow through the node tree when properties change.'),
          div({class: 'legend-item'}, [
            ioIcon({class: 'legend-color', value: 'io:circle_fill', style: {fill: '#2196F3'}}),
            span('Node'),
          ]),
          div({class: 'legend-item'}, [
            ioIcon({class: 'legend-color', value: 'io:circle_fill', style: {fill: '#FF0000'}}),
            span('Mutation'),
          ]),
          div({class: 'legend-item'}, [
            ioIcon({class: 'legend-color', value: 'io:circle_fill', style: {fill: '#FFFF00'}}),
            span('Change'),
          ]),
        ]
      }),
      canvas({id: 'canvas'}),
    ]);

    const _canvas = this.$.canvas;
    const ctx = _canvas.getContext('2d');
    const self = this;

    function render() {
        ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        
        // Draw connections first (so they appear behind nodes)
        Object.values(nodes).forEach(node => {
            node.connections.forEach(connection => {
                const fromX = self.canvasCenter.x + connection.nodeA.position.x * self.scale;
                const fromY = self.canvasCenter.y + connection.nodeA.position.y * self.scale;
                const toX = self.canvasCenter.x + connection.nodeB.position.x * self.scale;
                const toY = self.canvasCenter.y + connection.nodeB.position.y * self.scale;
                
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
            const x = self.canvasCenter.x + node.position.x * self.scale;
            const y = self.canvasCenter.y + node.position.y * self.scale;
            const radius = node.radius * node.currentScale * self.scale;
            
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    class SimulatedNode {
        constructor(name, position) {
            this.name = name;
            this.position = position;
            this.children = [];
            this.parent = null;
            this.observers = [];
            this.bindings = [];
            this.properties = new Map();
            this.changeQueue = [];
            this.isDispatching = false;
            this.createVisual();
        }

        createVisual() {
            this.radius = 6; // Standard size since treeRoot is not rendered
            this.color = '#2196F3';
            this.originalColor = '#2196F3';
            this.originalScale = 0.1;
            this.currentScale = 0.1;
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

        addChild(child) {
            this.children.push(child);
            child.parent = this;
            return this.createConnection(child);
        }

        createConnection(child) {
            const connection = {
                nodeA: this,
                nodeB: child,
                color: '#666666',
                originalColor: '#666666'
            };
            this.connections.push(connection);
            return connection;
        }


        setProperty(name, value) {
            const oldValue = this.properties.get(name);
            if (oldValue !== value) {
                this.properties.set(name, value);
                this.queueChange(name, value, oldValue);
                this.animateChange();
            }
        }

        queueChange(property, value, oldValue) {
            const existingIndex = this.changeQueue.findIndex(change => change.property === property);
            if (existingIndex !== -1) {
                this.changeQueue[existingIndex].value = value;
            } else {
                this.changeQueue.push({ property, value, oldValue });
            }
            setTimeout(() => this.dispatchChanges(), 50);
        }

        dispatchChanges() {
            if (this.isDispatching || this.changeQueue.length === 0) return;
            this.isDispatching = true;

            this.changeQueue.forEach(() => {
                this.animatePropertyChange();
                setTimeout(() => this.triggerMutationEvent(), 100);
            });

            this.changeQueue = [];
            this.isDispatching = false;
        }

        triggerMutationEvent() {
            if (this.parent) {
                setTimeout(() => {
                    this.parent.onMutationReceived(this);
                }, 100);
            }
        }

        triggerChangeEvent() {
            this.children.forEach(child => {
                setTimeout(() => {
                    child.onChangeReceived(this);
                }, 100);
            });
        }

        onMutationReceived(source) {
            this.createPropagationLine(source);
            this.animateReceiveMutation();
            if (this.parent) {
                setTimeout(() => {
                    this.parent.onMutationReceived(this);
                }, 100);
            }
        }

        onChangeReceived(source) {
            this.createChangePropagationLine(source);
            this.animateReceiveChange();
            this.children.forEach(child => {
                setTimeout(() => {
                    child.onChangeReceived(this);
                }, 100);
            });
        }

        animateConnectionColor(connection, targetColor, flashDuration = 150, fadeDuration = 650) {
            if (!connection) return;
            
            const originalColor = connection.originalColor;
            const animateColor = (from, to, duration, callback) => {
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    connection.color = this.lerpColor(from, to, progress);
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else if (callback) {
                        callback();
                    }
                };
                animate();
            };
            
            animateColor(originalColor, targetColor, flashDuration, () => {
                animateColor(targetColor, originalColor, fadeDuration);
            });
        }

        createPropagationLine(source) {
            const connection = this.connections.find(conn => conn.nodeB === source);
            this.animateConnectionColor(connection, '#FF0000', 150, 650);
        }

        createChangePropagationLine(source) {
            const connection = source.connections.find(conn => conn.nodeB === this);
            this.animateConnectionColor(connection, '#FFFF00', 100, 700);
        }

        animatePropertyChange() {
            const originalColor = this.originalColor;
            const mutationColor = '#FFFFFF';
            this.animateColor(originalColor, mutationColor, 100, () => {
                this.animateColor(mutationColor, originalColor, 5000);
            });

            const originalScale = this.originalScale;
            const targetScale = originalScale * 4;
            this.animateScale(originalScale, targetScale, 100, () => {
                this.animateScale(targetScale, originalScale, 600);
            });
        }

        animateReceiveMutation() {
            const originalColor = this.originalColor;
            const mutationColor = '#FF4444';

            this.animateColor(originalColor, mutationColor, 100, () => {
                this.animateColor(mutationColor, originalColor, 600);
            });

            const originalScale = this.originalScale;
            const targetScale = originalScale * 2;
            this.animateScale(originalScale, targetScale, 100, () => {
                this.animateScale(targetScale, originalScale, 600);
            });
        }

        animateReceiveChange() {
            const originalColor = this.originalColor;
            const changeColor = '#FFFF00';

            this.animateColor(originalColor, changeColor, 100, () => {
                this.animateColor(changeColor, originalColor, 600);
            });

            const originalScale = this.originalScale;
            const targetScale = originalScale * 2;
            this.animateScale(originalScale, targetScale, 100, () => {
                this.animateScale(targetScale, originalScale, 600);
            });
        }

        animateChange() {
            const originalColor = this.originalColor;
            const changeColor = '#FF4444';

            this.animateColor(originalColor, changeColor, 100, () => {
                this.animateColor(changeColor, originalColor, 600);
            });
        }

        animateScale(from, to, duration, callback) {
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                this.currentScale = from + (to - from) * progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };
            animate();
        }

        animateColor(from, to, duration, callback) {
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                this.color = this.lerpColor(from, to, progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };
            animate();
        }

    }

    function calculateRadialPositions(treeData) {
        const positions = {};
        const levelRadius = 4;
        const levelSpacing = 3;
        const minNodeSpacing = 0.8;
        const clusterSeparation = 25; // Distance between cluster centers
        
        // First, position each top-level cluster (treeRoot children) in a circle
        const topLevelClusters = treeData.children || [];
        const clusterCenters = {};
        
        topLevelClusters.forEach((cluster, index) => {
            const angle = (index / topLevelClusters.length) * Math.PI * 2;
            const centerX = Math.cos(angle) * clusterSeparation;
            const centerY = Math.sin(angle) * clusterSeparation;
            clusterCenters[cluster.id] = { x: centerX, y: centerY };
        });

        function positionNode(node, level = 0, parentAngle = 0, availableAngle = Math.PI * 2, siblingIndex = 0, siblingCount = 1, clusterCenter = { x: 0, y: 0 }) {
            // Skip positioning for treeRoot since it won't be rendered
            if (node.id !== 'treeRoot') {
                const radius = level * levelRadius + levelSpacing;

                let angle;
                if (level === 0) {
                    angle = 0;
                } else {
                    if (level === 1) {
                        angle = (siblingIndex / siblingCount) * Math.PI * 2;
                    } else {
                        const angleStep = availableAngle / siblingCount;
                        angle = parentAngle - availableAngle / 2 + angleStep * (siblingIndex + 0.5);
                    }
                }
                
                // Position relative to cluster center
                const localX = radius * Math.cos(angle) * 2;
                const localY = radius * Math.sin(angle) * 2;
                const x = clusterCenter.x + localX;
                const y = clusterCenter.y + localY;
                
                positions[node.id] = { x, y, z: 0 };
            }
            
            if (node.children && node.children.length > 0) {
                // For treeRoot children, treat them as level 0 (root level) with their own cluster center
                const effectiveLevel = node.id === 'treeRoot' ? -1 : level;
                const currentClusterCenter = node.id === 'treeRoot' ? { x: 0, y: 0 } : 
                    (clusterCenters[node.id] || clusterCenter);
                
                const childRadius = (effectiveLevel + 1) * levelRadius + levelSpacing;
                const minAngleForSpacing = minNodeSpacing / childRadius;
                const minTotalAngle = minAngleForSpacing * node.children.length;
                
                let childAngleSpan;
                if (effectiveLevel === -1) { // treeRoot children get full circle
                    childAngleSpan = Math.PI * 2;
                } else {
                    const maxAngleFromParent = Math.min(availableAngle * 0.9, Math.PI);
                    childAngleSpan = Math.max(minTotalAngle, Math.min(maxAngleFromParent, Math.PI * 0.6));
                }
                
                node.children.forEach((child, index) => {
                    const childLevel = node.id === 'treeRoot' ? 0 : level + 1;
                    const childAngle = node.id === 'treeRoot' ? 0 : parentAngle;
                    const childClusterCenter = node.id === 'treeRoot' ? 
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
            this.maxVelocity = 0.4;
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
                    const distanceSquared = dx * dx + dy * dy;
                    const distance = Math.sqrt(distanceSquared) + 0.01;
                    
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
                
                // Skip treeRoot since it's not in the simulation
                if (id === 'treeRoot') {
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
                
                node.position.x += this.velocities[id].x;
                node.position.y += this.velocities[id].y;
            });
        }


        calculateCenterAttractionForces() {
            Object.keys(this.nodes).forEach(id => {
                const node = this.nodes[id];
                
                // Skip treeRoot since it's not in the simulation
                if (id === 'treeRoot') {
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
            if (!this.running) return;
            
            this.step();
            requestAnimationFrame(() => this.simulate());
        }
    }

    function createNodesFromTree(treeData, positions) {
        const nodes = {};
        
        function createNode(nodeData) {
            // Skip treeRoot from visual representation
            if (nodeData.id !== 'treeRoot') {
                const position = positions[nodeData.id];
                const node = new SimulatedNode(nodeData.id, position);
                nodes[nodeData.id] = node;
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
            // Skip treeRoot connections - only connect from its children onwards
            if (nodeData.id !== 'treeRoot') {
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

    const positions = calculateRadialPositions(treeRoot);
    const nodes = createNodesFromTree(treeRoot, positions);
    const connections = connectNodes(treeRoot, nodes);
    
    // Initialize force-directed layout
    const forceLayout = new ForceDirectedLayout(nodes, connections);
    forceLayout.start();

    const allNodes = Object.values(nodes);

    function triggerChange(node) {
        node.setProperty('value', Math.random());
        setTimeout(() => {
            node.triggerChangeEvent();
        }, 200);
    }
    
    this.startAnimation = () => {
      if (this.animationId) return; // Already running
      
      const animate = () => {
        if (!this.isVisible) {
          this.animationId = null;
          return;
        }
        render();
        this.animationId = requestAnimationFrame(animate);
      };
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.stopAnimation = () => {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    };
    
    // Set up Intersection Observer for visibility detection
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.animationId) {
          this.startAnimation();
        } else if (!this.isVisible && this.animationId) {
          this.stopAnimation();
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    this.observer.observe(this);
    
    // Check initial visibility
    const rect = this.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    this.isVisible = rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;
    
    if (this.isVisible) {
      this.startAnimation();
    }

    setInterval(() => {
        if (Math.random() < 0.25) {
          triggerChange(allNodes[0]);
        } else if (Math.random() < 0.5) {
          triggerChange(allNodes[Math.floor(Math.random() * allNodes.length / 2)]);
        } else {
          triggerChange(allNodes[Math.floor(Math.random() * allNodes.length)]);
        }
    }, 2000);
  }
  
  disconnected() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.stopAnimation();
  }
}
Register(IoChangeVisualization);

export const ioChangeVisualization = function(arg0) {
  return IoChangeVisualization.vConstructor(arg0);
};
