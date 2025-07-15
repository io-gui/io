import { IoElement, Register, div, span, h4, p, canvas } from 'io-gui';
import { ioCollapsible } from 'io-navigation';
import { ioIcon } from 'io-icons';

/*
 * IO-GUI MUTATION EVENT PROPAGATION VISUALIZATION
 * 
 * This interactive visualization demonstrates how mutation and change events flow through
 * a hierarchical node tree, simulating the reactive system used in the io-gui framework.
 * 
 * OVERVIEW:
 * - Visualizes a tree structure representing application components (data, view, service, util, config)
 * - Shows two types of event propagation: mutations (bottom-up) and changes (top-down)
 * - Uses force-directed graph simulation for optimal node positioning
 * - Rendered with HTML5 Canvas for performance and simplicity
 * 
 * KEY COMPONENTS:
 * 
 * 1. SIMULATED NODE CLASS:
 *    - Represents individual nodes in the component tree
 *    - Maintains parent-child relationships and properties
 *    - Handles visual representation (color, scale, position)
 *    - Implements mutation/change event propagation logic
 * 
 * 2. EVENT PROPAGATION SYSTEM:
 *    - MUTATIONS (Red, ↑): Flow upward from child to parent when properties change
 *      - Triggered by setProperty() calls on any node
 *      - Propagates through parent chain to root
 *      - Simulates how property changes bubble up in reactive systems
 *    
 *    - CHANGES (Yellow, ↓): Flow downward from parent to children
 *      - Triggered manually after mutations complete
 *      - Cascades from parent to all descendants
 *      - Represents how parent changes affect child components
 * 
 * 3. VISUAL EFFECTS:
 *    - Node animations: Color changes and scaling during events
 *    - Connection animations: Lines change color to show event flow
 *    - Wave effects: Expanding circles emanate from nodes during events
 *    - Root node: 3x larger to show hierarchy importance
 * 
 * 4. FORCE-DIRECTED LAYOUT:
 *    - Physics simulation for automatic node positioning
 *    - Repulsion forces: Nodes push away from each other (prevents overlap)
 *    - Attraction forces: Connected nodes pull toward optimal distance
 *    - Root pinning: Root node stays fixed at center as anchor point
 *    - Cooling system: Forces gradually weaken to reach stable equilibrium
 * 
 * 5. CANVAS RENDERING:
 *    - Pure HTML5 Canvas 2D API (no Three.js dependency)
 *    - Real-time coordinate transformation from world space to screen pixels
 *    - Draws connections first (behind nodes), then nodes with scaling
 *    - Handles window resizing and maintains aspect ratio
 * 
 * INTERACTION:
 * - Automatic random events trigger every 2 seconds
 * - Higher probability for root and upper-level nodes
 * - Toggle simulation button controls physics animation
 * - Events create cascading visual effects through the tree
 * 
 * TECHNICAL DETAILS:
 * - Tree structure: Nested JavaScript objects defining hierarchy
 * - Color interpolation: Custom hex color lerping for smooth transitions
 * - Animation system: RequestAnimationFrame-based with duration/callback support
 * - Force physics: Velocity-based integration with damping and velocity clamping
 * - Temperature cooling: Simulated annealing for convergence to stable layout
 * 
 * This visualization helps developers understand how reactive frameworks like io-gui
 * handle property changes and event propagation in component hierarchies.
 */

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
    this.$.canvas.width = this.clientWidth;
    this.$.canvas.height = this.clientHeight;
    this.canvasCenter.x = this.$.canvas.width / 2;
    this.canvasCenter.y = this.$.canvas.height / 2;
    this.scale = Math.min(this.$.canvas.width, this.$.canvas.height) / 60;
  }
  init() {
    this.canvasCenter = { x: 0, y: 0 };
    this.scale = 20;
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
            this.radius = this.name === 'root' ? 18 : 6; // 3x bigger for root
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

            this.changeQueue.forEach(change => {
                this.animatePropertyChange(change);
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

        createPropagationLine(source) {
            const connection = this.connections.find(conn => conn.nodeB === source);
            if (connection) {
                const originalColor = connection.originalColor;
                const mutationColor = '#FF0000';
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
                
                animateColor(originalColor, mutationColor, 150, () => {
                    animateColor(mutationColor, originalColor, 650);
                });
            } else {
                console.log('No connection found for mutation from', source.name, 'to', this.name);
            }
        }

        createChangePropagationLine(source) {
            // Find the existing connection line between source and this node
            const connection = source.connections.find(conn => conn.nodeB === this);
            if (connection) {
                const originalColor = connection.originalColor;
                const changeColor = '#FFFF00';
                
                // Animate the existing line color
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
                
                animateColor(originalColor, changeColor, 100, () => {
                    animateColor(changeColor, originalColor, 700);
                });
            }
        }

        animatePropertyChange(change) {
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

        dispose() {
            // Canvas cleanup if needed
        }
    }

    const treeStructure = {
        id: 'root',
        children: [
            {
                id: 'view',
                children: [
                    {
                        id: 'router',
                        children: [
                            { id: 'routes', children: [{ id: 'home' }, { id: 'about' }, { id: 'contact' }, { id: 'profile' }] },
                            { id: 'guard', children: [{ id: 'auth', children: [{ id: 'check', children: [] }] }, { id: 'role', children: [] }] },
                            { id: 'middleware', children: [{ id: 'cors', children: [] }, { id: 'helmet', children: [] }] }
                        ]
                    },
                    {
                        id: 'component',
                        children: [
                            { id: 'ui', children: [{ id: 'button', children: [] }, { id: 'input', children: [] }, { id: 'modal', children: [] }] },
                            { id: 'layout', children: [{ id: 'header', children: [] }, { id: 'sidebar', children: [] }, { id: 'footer', children: [] }] }
                        ]
                    }
                ]
            },
            {
                id: 'service',
                children: [
                    {
                        id: 'api',
                        children: [
                            { id: 'rest', children: [{ id: 'endpoint', children: [] }] },
                            { id: 'graphql', children: [{ id: 'resolver', children: [] }] }
                        ]
                    },
                    {
                        id: 'notification',
                        children: [
                            { id: 'email', children: [{ id: 'smtp', children: [] }] },
                            { id: 'push', children: [{ id: 'fcm', children: [] }] }
                        ]
                    }
                ]
            },
            
            {
                id: 'config',
                children: [
                    {
                        id: 'env',
                        children: [
                            { id: 'dev', children: [{ id: 'debug', children: [] }] },
                            { id: 'prod', children: [{ id: 'optimize', children: [] }] }
                        ]
                    },
                    {
                        id: 'database',
                        children: [
                            { id: 'connection', children: [{ id: 'pool', children: [] }] },
                            { id: 'query', children: [{ id: 'builder', children: [] }] }
                        ]
                    }
                ]
            }
        ]
    };

    function calculateRadialPositions(treeData) {
        const positions = {};
        const levelRadius = 4;
        const levelSpacing = 3;
        const minNodeSpacing = 0.8;

        function positionNode(node, level = 0, parentAngle = 0, availableAngle = Math.PI * 2, siblingIndex = 0, siblingCount = 1) {
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
            
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            positions[node.id] = { x, y, z: 0 };
            
            if (node.children && node.children.length > 0) {
                const childRadius = (level + 1) * levelRadius + levelSpacing;
                const minAngleForSpacing = minNodeSpacing / childRadius;
                const minTotalAngle = minAngleForSpacing * node.children.length;
                
                let childAngleSpan;
                if (level === 0) {
                    childAngleSpan = Math.PI * 2;
                } else {
                    const maxAngleFromParent = Math.min(availableAngle * 0.9, Math.PI);
                    childAngleSpan = Math.max(minTotalAngle, Math.min(maxAngleFromParent, Math.PI * 0.6));
                }
                
                node.children.forEach((child, index) => {
                    positionNode(child, level + 1, angle, childAngleSpan, index, node.children.length);
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
            this.damping = 0.95;
            this.repulsionStrength = 1;
            this.attractionStrength = 0.05;
            this.linkLength = 0.1;
            this.maxVelocity = 0.5;
            this.running = false;
            this.coolingRate = 0.999;
            this.temperature = 0.20;
            this.minTemperature = 0.01;
            
            Object.keys(nodes).forEach(id => {
                this.forces[id] = { x: 0, y: 0 };
                this.velocities[id] = { x: 0, y: 0 };
            });
        }

        calculateRepulsionForces() {
            const nodeIds = Object.keys(this.nodes);
            
            nodeIds.forEach(id => {
                this.forces[id].x = 0;
                this.forces[id].y = 0;
            });

            for (let i = 0; i < nodeIds.length; i++) {
                for (let j = i + 1; j < nodeIds.length; j++) {
                    const nodeA = this.nodes[nodeIds[i]];
                    const nodeB = this.nodes[nodeIds[j]];
                    
                    const dx = nodeA.position.x - nodeB.position.x;
                    const dy = nodeA.position.y - nodeB.position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) + 0.01;
                    
                    const force = (this.repulsionStrength * this.temperature) / (distance * distance);
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
                
                const force = this.attractionStrength * this.temperature * (distance - this.linkLength);
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
                
                // Pin root node to center
                if (id === 'root') {
                    node.position.x = 0;
                    node.position.y = 0;
                    this.velocities[id].x = 0;
                    this.velocities[id].y = 0;
                    // Root node position is already set above
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

        updateConnections() {
            // Connections automatically update when nodes move since we reference node positions directly
        }

        step() {
            this.calculateRepulsionForces();
            this.calculateAttractionForces();
            this.updatePositions();
            this.updateConnections();
            
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
            const position = positions[nodeData.id];
            const node = new SimulatedNode(nodeData.id, position);
            nodes[nodeData.id] = node;
            
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
            const parentNode = nodes[nodeData.id];
            if (nodeData.children) {
                nodeData.children.forEach(childData => {
                    const childNode = nodes[childData.id];
                    const connection = parentNode.addChild(childNode);
                    allConnections.push(connection);
                    connect(childData);
                });
            }
        }
        connect(treeData);
        return allConnections;
    }

    const positions = calculateRadialPositions(treeStructure);
    const nodes = createNodesFromTree(treeStructure, positions);
    const connections = connectNodes(treeStructure, nodes);
    
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
    
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    
    animate();

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
}
Register(IoChangeVisualization);

export const ioChangeVisualization = function(arg0) {
  return IoChangeVisualization.vConstructor(arg0);
};
