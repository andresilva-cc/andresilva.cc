// ===== DIFFICULTY PRESETS =====
const DIFFICULTY_PRESETS = {
    easy: {
        initialEnergy: 80,
        moveEnergyCost: 0.3,
        reproductionCost: 30,
        reproductionThreshold: 100,
        foodEnergyGain: 40,
        maxEnergy: 150,
        foodSpawnRate: 0.25,
        initialFood: 60,
        maxFood: 100,
        mutationRate: 0.3,
        mutationAmount: 0.6
    },
    normal: {
        initialEnergy: 60,
        moveEnergyCost: 0.6,
        reproductionCost: 35,
        reproductionThreshold: 90,
        foodEnergyGain: 30,
        maxEnergy: 130,
        foodSpawnRate: 0.18,
        initialFood: 45,
        maxFood: 90,
        mutationRate: 0.2,
        mutationAmount: 0.4
    },
    hard: {
        initialEnergy: 40,
        moveEnergyCost: 1.2,
        reproductionCost: 50,
        reproductionThreshold: 110,
        foodEnergyGain: 20,
        maxEnergy: 110,
        foodSpawnRate: 0.1,
        initialFood: 30,
        maxFood: 70,
        mutationRate: 0.15,
        mutationAmount: 0.3
    }
};

// ===== CONFIGURATION =====
const CONFIG = {
    gridWidth: 60,
    gridHeight: 35,
    cellSize: 16,
    initialCreatures: 15,

    // These will be set by difficulty
    initialFood: 45,
    foodSpawnRate: 0.18,
    maxFood: 90,
    initialEnergy: 60,
    moveEnergyCost: 0.6,
    reproductionCost: 35,
    reproductionThreshold: 90,
    foodEnergyGain: 30,
    maxEnergy: 130,

    // Evolution settings (will be set by difficulty)
    mutationRate: 0.2,
    mutationAmount: 0.4,

    // Logging
    maxLogEntries: 100,

    // Current difficulty
    difficulty: 'normal'
};

function applyDifficulty(difficulty) {
    const preset = DIFFICULTY_PRESETS[difficulty];
    if (!preset) return;

    CONFIG.difficulty = difficulty;
    CONFIG.initialEnergy = preset.initialEnergy;
    CONFIG.moveEnergyCost = preset.moveEnergyCost;
    CONFIG.reproductionCost = preset.reproductionCost;
    CONFIG.reproductionThreshold = preset.reproductionThreshold;
    CONFIG.foodEnergyGain = preset.foodEnergyGain;
    CONFIG.maxEnergy = preset.maxEnergy;
    CONFIG.foodSpawnRate = preset.foodSpawnRate;
    CONFIG.initialFood = preset.initialFood;
    CONFIG.maxFood = preset.maxFood;
    CONFIG.mutationRate = preset.mutationRate;
    CONFIG.mutationAmount = preset.mutationAmount;
}

// ===== EVENT LOGGER =====
class EventLogger {
    constructor() {
        this.logElement = null;
        this.logCount = 0;
    }

    setElement(element) {
        this.logElement = element;
    }

    log(message, type = 'info') {
        if (!this.logElement) return;

        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = message;

        this.logElement.appendChild(entry);
        this.logCount++;

        // Limit log entries
        if (this.logCount > CONFIG.maxLogEntries) {
            this.logElement.removeChild(this.logElement.firstChild);
            this.logCount--;
        }

        // Auto-scroll to bottom
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }

    clear() {
        if (this.logElement) {
            this.logElement.innerHTML = '<div class="log-entry log-info">Log cleared...</div>';
            this.logCount = 1;
        }
    }

    birth(creature, parentId) {
        if (parentId) {
            this.log(`● Creature #${creature.id} born (Gen ${creature.generation}, Parent #${parentId})`, 'birth');
        } else {
            this.log(`● Creature #${creature.id} spawned (Gen ${creature.generation})`, 'birth');
        }
    }

    death(creature) {
        this.log(`✝ Creature #${creature.id} died (Gen ${creature.generation}, Age ${creature.age})`, 'death');
    }

    ate(creature) {
        this.log(`* Creature #${creature.id} ate food (Energy: ${Math.floor(creature.energy)})`, 'food');
    }

    milestone(generation) {
        this.log(`🏆 Generation ${generation} reached!`, 'milestone');
    }

    extinction(finalGen, ticks) {
        this.log(`💀 EXTINCTION! Final Gen: ${finalGen}, Ticks: ${ticks}`, 'death');
    }

    reset() {
        this.log(`🔄 Simulation reset`, 'info');
    }
}

const logger = new EventLogger();

// ===== NOTIFICATION MANAGER =====
class NotificationManager {
    constructor() {
        this.container = null;
        this.toastIdCounter = 0;
    }

    setContainer(container) {
        this.container = container;
    }

    show(message, type = 'milestone', icon = '🔔', duration = 5000) {
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = `toast-${++this.toastIdCounter}`;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.textContent = icon;

        const messageSpan = document.createElement('span');
        messageSpan.className = 'toast-message';
        messageSpan.textContent = message;

        toast.appendChild(iconSpan);
        toast.appendChild(messageSpan);
        this.container.appendChild(toast);

        // Auto-dismiss after duration
        setTimeout(() => {
            this.dismiss(toast);
        }, duration);
    }

    dismiss(toast) {
        if (!toast) return;

        toast.classList.add('toast-fade-out');

        // Remove from DOM after animation completes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400); // Match animation duration
    }

    showExtinction(message, icon = '💀') {
        this.show(message, 'extinction', icon, 6000);
    }

    showMilestone(message, icon = '🏆') {
        this.show(message, 'milestone', icon, 4000);
    }

    showWarning(message, icon = '⚠️') {
        this.show(message, 'warning', icon, 5000);
    }
}

const notificationManager = new NotificationManager();

// ===== POPULATION GRAPH =====
class PopulationGraph {
    constructor(canvas, maxDataPoints = 300) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.maxDataPoints = maxDataPoints;
        this.history = {
            prey: [],
            predators: [],
            food: []
        };

        // Set canvas resolution
        this.resize();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    addDataPoint(prey, predators, food) {
        this.history.prey.push(prey);
        this.history.predators.push(predators);
        this.history.food.push(food);

        // Keep only the last maxDataPoints
        if (this.history.prey.length > this.maxDataPoints) {
            this.history.prey.shift();
            this.history.predators.shift();
            this.history.food.shift();
        }
    }

    clear() {
        this.history.prey = [];
        this.history.predators = [];
        this.history.food = [];
    }

    render() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#0a0';
        ctx.lineWidth = 0.5;

        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical grid lines (every 50 ticks)
        const dataLength = this.history.prey.length;
        if (dataLength > 0) {
            const pointsPerGrid = 50;
            const gridCount = Math.floor(dataLength / pointsPerGrid);
            for (let i = 0; i <= gridCount; i++) {
                const x = (width / dataLength) * (i * pointsPerGrid);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }

        if (this.history.prey.length < 2) return;

        // Find max value for scaling
        const allValues = [
            ...this.history.prey,
            ...this.history.predators,
            ...this.history.food
        ];
        const maxValue = Math.max(...allValues, 1);

        // Helper function to draw a line
        const drawLine = (data, color, lineWidth = 2) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();

            const xStep = width / (this.maxDataPoints - 1);
            const startIndex = Math.max(0, this.maxDataPoints - data.length);

            for (let i = 0; i < data.length; i++) {
                const x = (startIndex + i) * xStep;
                const y = height - (data[i] / maxValue) * height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
        };

        // Draw lines (draw food first so it's in the background)
        drawLine(this.history.food, '#666600', 1);
        drawLine(this.history.prey, '#00ffff', 2);
        drawLine(this.history.predators, '#ff0000', 2);

        // Draw legend
        ctx.font = '12px "Courier New", monospace';
        ctx.fillStyle = '#00ffff';
        ctx.fillText('● Prey', 10, 20);

        ctx.fillStyle = '#ff0000';
        ctx.fillText('▲ Predators', 80, 20);

        ctx.fillStyle = '#666600';
        ctx.fillText('* Food', 200, 20);

        // Draw max value label
        ctx.fillStyle = '#0a0';
        ctx.font = '10px "Courier New", monospace';
        ctx.fillText(`Max: ${Math.floor(maxValue)}`, width - 60, 15);
    }
}

// ===== NEURAL NETWORK =====
class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
        this.weightsIH = this.randomMatrix(inputSize, hiddenSize);
        this.weightsHO = this.randomMatrix(hiddenSize, outputSize);
        this.biasH = this.randomArray(hiddenSize);
        this.biasO = this.randomArray(outputSize);
    }

    randomMatrix(rows, cols) {
        return Array(rows).fill().map(() =>
            Array(cols).fill().map(() => Math.random() * 2 - 1)
        );
    }

    randomArray(size) {
        return Array(size).fill().map(() => Math.random() * 2 - 1);
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    forward(inputs) {
        // Input to hidden
        const hidden = this.biasH.map((bias, i) => {
            let sum = bias;
            for (let j = 0; j < inputs.length; j++) {
                sum += inputs[j] * this.weightsIH[j][i];
            }
            return this.sigmoid(sum);
        });

        // Hidden to output
        const outputs = this.biasO.map((bias, i) => {
            let sum = bias;
            for (let j = 0; j < hidden.length; j++) {
                sum += hidden[j] * this.weightsHO[j][i];
            }
            return this.sigmoid(sum);
        });

        return outputs;
    }

    mutate(rate, amount) {
        const mutateValue = (val) => {
            if (Math.random() < rate) {
                return val + (Math.random() * 2 - 1) * amount;
            }
            return val;
        };

        this.weightsIH = this.weightsIH.map(row => row.map(mutateValue));
        this.weightsHO = this.weightsHO.map(row => row.map(mutateValue));
        this.biasH = this.biasH.map(mutateValue);
        this.biasO = this.biasO.map(mutateValue);
    }

    copy() {
        const nn = new NeuralNetwork(0, 0, 0);
        nn.weightsIH = this.weightsIH.map(row => [...row]);
        nn.weightsHO = this.weightsHO.map(row => [...row]);
        nn.biasH = [...this.biasH];
        nn.biasO = [...this.biasO];
        return nn;
    }
}

// ===== CREATURE =====
let creatureIdCounter = 0;

class Creature {
    constructor(x, y, brain = null, generation = 0, parentId = null) {
        this.id = ++creatureIdCounter;
        this.x = x;
        this.y = y;
        this.energy = CONFIG.initialEnergy;
        this.generation = generation;
        this.brain = brain || new NeuralNetwork(9, 10, 4); // 9 inputs (food+predator), 10 hidden, 4 outputs
        this.age = 0;
        this.color = this.randomColor();
        this.parentId = parentId;
        this.foodEaten = 0;
    }

    randomColor() {
        const colors = ['#00ffff', '#00ff00', '#ffff00', '#ff00ff', '#00aaff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    sense(world) {
        // Find nearest food
        let nearestFood = null;
        let minFoodDist = Infinity;

        for (const food of world.food) {
            const dist = Math.sqrt(
                Math.pow(this.x - food.x, 2) +
                Math.pow(this.y - food.y, 2)
            );
            if (dist < minFoodDist) {
                minFoodDist = dist;
                nearestFood = food;
            }
        }

        // Find nearest predator
        let nearestPredator = null;
        let minPredatorDist = Infinity;

        for (const predator of world.predators) {
            const dist = Math.sqrt(
                Math.pow(this.x - predator.x, 2) +
                Math.pow(this.y - predator.y, 2)
            );
            if (dist < minPredatorDist) {
                minPredatorDist = dist;
                nearestPredator = predator;
            }
        }

        // Calculate food inputs
        let foodDirX = 0, foodDirY = 0, foodDist = 1;
        if (nearestFood) {
            foodDirX = (nearestFood.x - this.x) / CONFIG.gridWidth;
            foodDirY = (nearestFood.y - this.y) / CONFIG.gridHeight;
            foodDist = minFoodDist / Math.sqrt(CONFIG.gridWidth ** 2 + CONFIG.gridHeight ** 2);
        }

        // Calculate predator inputs
        let predatorDirX = 0, predatorDirY = 0, predatorDist = 1;
        if (nearestPredator) {
            predatorDirX = (nearestPredator.x - this.x) / CONFIG.gridWidth;
            predatorDirY = (nearestPredator.y - this.y) / CONFIG.gridHeight;
            predatorDist = minPredatorDist / Math.sqrt(CONFIG.gridWidth ** 2 + CONFIG.gridHeight ** 2);
        }

        return [
            foodDirX,           // Direction to food (x)
            foodDirY,           // Direction to food (y)
            foodDist,           // Distance to food (normalized)
            predatorDirX,       // Direction to predator (x)
            predatorDirY,       // Direction to predator (y)
            predatorDist,       // Distance to predator (normalized)
            this.energy / CONFIG.maxEnergy,  // Current energy (normalized)
            this.x / CONFIG.gridWidth,       // Current x position (normalized)
            this.y / CONFIG.gridHeight       // Current y position (normalized)
        ];
    }

    decide(inputs) {
        const outputs = this.brain.forward(inputs);

        // Extract inputs
        const [foodDirX, foodDirY, foodDist, predatorDirX, predatorDirY, predatorDist] = inputs;

        // Food-seeking instinct
        const foodBiases = [
            -foodDirY,  // up (negative Y)
            foodDirX,   // right (positive X)
            foodDirY,   // down (positive Y)
            -foodDirX   // left (negative X)
        ];

        // Predator evasion instinct (flee AWAY from predator)
        const evasionBiases = [
            predatorDirY,   // up (opposite of predator Y)
            -predatorDirX,  // right (opposite of predator X)
            -predatorDirY,  // down (opposite of predator Y)
            predatorDirX    // left (opposite of predator X)
        ];

        // Danger factor: stronger evasion when predator is close
        const dangerFactor = predatorDist < 0.5 ? (1 - predatorDist) * 2 : 0;

        // Combine neural network with instincts
        // Neural network can learn to balance food vs safety
        const combinedOutputs = outputs.map((output, i) =>
            output +
            foodBiases[i] * 0.4 +  // Food attraction (reduced)
            evasionBiases[i] * 0.7 * dangerFactor  // Evasion (strong when in danger)
        );

        // Find direction with highest combined activation
        const maxIdx = combinedOutputs.indexOf(Math.max(...combinedOutputs));
        return maxIdx; // 0: up, 1: right, 2: down, 3: left
    }

    move(direction) {
        const moves = [
            [0, -1],  // up
            [1, 0],   // right
            [0, 1],   // down
            [-1, 0]   // left
        ];

        this.x += moves[direction][0];
        this.y += moves[direction][1];

        // Wrap around edges
        this.x = (this.x + CONFIG.gridWidth) % CONFIG.gridWidth;
        this.y = (this.y + CONFIG.gridHeight) % CONFIG.gridHeight;

        this.energy -= CONFIG.moveEnergyCost;
        this.age++;
    }

    canReproduce() {
        return this.energy >= CONFIG.reproductionThreshold;
    }

    reproduce() {
        this.energy -= CONFIG.reproductionCost;
        const childBrain = this.brain.copy();
        childBrain.mutate(CONFIG.mutationRate, CONFIG.mutationAmount);

        // Spawn child nearby
        const offsetX = Math.floor(Math.random() * 3 - 1);
        const offsetY = Math.floor(Math.random() * 3 - 1);
        const childX = (this.x + offsetX + CONFIG.gridWidth) % CONFIG.gridWidth;
        const childY = (this.y + offsetY + CONFIG.gridHeight) % CONFIG.gridHeight;

        return new Creature(childX, childY, childBrain, this.generation + 1, this.id);
    }
}

// ===== PREDATOR =====
let predatorIdCounter = 0;

class Predator {
    constructor(x, y, brain = null, generation = 0, parentId = null) {
        this.id = ++predatorIdCounter;
        this.x = x;
        this.y = y;
        this.energy = CONFIG.initialEnergy * 1.5; // Predators start with more energy
        this.generation = generation;
        this.brain = brain || new NeuralNetwork(6, 8, 4); // Same structure as prey
        this.age = 0;
        this.kills = 0;
        this.parentId = parentId;
    }

    sense(world) {
        // Find nearest prey
        let nearestPrey = null;
        let minDist = Infinity;

        for (const prey of world.creatures) {
            const dist = Math.sqrt(
                Math.pow(this.x - prey.x, 2) +
                Math.pow(this.y - prey.y, 2)
            );
            if (dist < minDist) {
                minDist = dist;
                nearestPrey = prey;
            }
        }

        // Calculate inputs
        let preyDirX = 0, preyDirY = 0, preyDist = 1;
        if (nearestPrey) {
            preyDirX = (nearestPrey.x - this.x) / CONFIG.gridWidth;
            preyDirY = (nearestPrey.y - this.y) / CONFIG.gridHeight;
            preyDist = minDist / Math.sqrt(CONFIG.gridWidth ** 2 + CONFIG.gridHeight ** 2);
        }

        return [
            preyDirX,           // Direction to prey (x)
            preyDirY,           // Direction to prey (y)
            preyDist,           // Distance to prey (normalized)
            this.energy / (CONFIG.maxEnergy * 1.5),  // Current energy (normalized)
            this.x / CONFIG.gridWidth,       // Current x position (normalized)
            this.y / CONFIG.gridHeight       // Current y position (normalized)
        ];
    }

    decide(inputs) {
        const outputs = this.brain.forward(inputs);

        // Add prey-seeking instinct
        const [preyDirX, preyDirY] = inputs;

        const huntingBiases = [
            -preyDirY,  // up (negative Y)
            preyDirX,   // right (positive X)
            preyDirY,   // down (positive Y)
            -preyDirX   // left (negative X)
        ];

        // Combine neural network output with hunting instinct
        const combinedOutputs = outputs.map((output, i) =>
            output + huntingBiases[i] * 0.6  // Slightly stronger hunting instinct
        );

        const maxIdx = combinedOutputs.indexOf(Math.max(...combinedOutputs));
        return maxIdx;
    }

    move(direction) {
        const moves = [
            [0, -1],  // up
            [1, 0],   // right
            [0, 1],   // down
            [-1, 0]   // left
        ];

        this.x += moves[direction][0];
        this.y += moves[direction][1];

        // Wrap around edges
        this.x = (this.x + CONFIG.gridWidth) % CONFIG.gridWidth;
        this.y = (this.y + CONFIG.gridHeight) % CONFIG.gridHeight;

        this.energy -= CONFIG.moveEnergyCost * 1.2; // Predators cost more energy to move
        this.age++;
    }

    canReproduce() {
        return this.energy >= CONFIG.reproductionThreshold * 1.5;
    }

    reproduce() {
        this.energy -= CONFIG.reproductionCost * 1.5;
        const childBrain = this.brain.copy();
        childBrain.mutate(CONFIG.mutationRate, CONFIG.mutationAmount);

        // Spawn child nearby
        const offsetX = Math.floor(Math.random() * 3 - 1);
        const offsetY = Math.floor(Math.random() * 3 - 1);
        const childX = (this.x + offsetX + CONFIG.gridWidth) % CONFIG.gridWidth;
        const childY = (this.y + offsetY + CONFIG.gridHeight) % CONFIG.gridHeight;

        return new Predator(childX, childY, childBrain, this.generation + 1, this.id);
    }
}

// ===== FOOD =====
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// ===== WORLD =====
class World {
    constructor() {
        this.creatures = [];
        this.predators = [];
        this.food = [];
        this.tick = 0;
        this.maxGeneration = 0;
        this.maxPredatorGeneration = 0;
        this.peakPreyGeneration = 0;
        this.peakPredatorGeneration = 0;
        this.isPaused = true; // Start paused
        this.isExtinct = false;
        this.predatorsExtinct = false;
        this.preyExtinct = false;
        this.speed = 1;
        this.preyLowPopWarned = false;
        this.predatorLowPopWarned = false;

        this.initialize();
    }

    initialize() {
        this.creatures = [];
        this.predators = [];
        this.food = [];
        this.tick = 0;
        this.maxGeneration = 0;
        this.maxPredatorGeneration = 0;
        this.isExtinct = false;
        this.predatorsExtinct = false;
        this.preyExtinct = false;
        this.preyLowPopWarned = false;
        this.predatorLowPopWarned = false;
        this.lastLoggedGeneration = -1;

        // Spawn initial creatures (prey)
        for (let i = 0; i < CONFIG.initialCreatures; i++) {
            const x = Math.floor(Math.random() * CONFIG.gridWidth);
            const y = Math.floor(Math.random() * CONFIG.gridHeight);
            const creature = new Creature(x, y);
            this.creatures.push(creature);
            logger.birth(creature, null);
        }

        // Spawn initial predators (fewer than prey)
        const initialPredators = Math.max(2, Math.floor(CONFIG.initialCreatures / 5));
        for (let i = 0; i < initialPredators; i++) {
            const x = Math.floor(Math.random() * CONFIG.gridWidth);
            const y = Math.floor(Math.random() * CONFIG.gridHeight);
            const predator = new Predator(x, y);
            this.predators.push(predator);
            logger.log(`🔴 Predator #${predator.id} spawned`, 'predator');
        }

        // Spawn initial food
        for (let i = 0; i < CONFIG.initialFood; i++) {
            this.spawnFood();
        }

        logger.reset();
    }

    spawnFood() {
        if (this.food.length < CONFIG.maxFood) {
            const x = Math.floor(Math.random() * CONFIG.gridWidth);
            const y = Math.floor(Math.random() * CONFIG.gridHeight);
            this.food.push(new Food(x, y));
        }
    }

    update() {
        if (this.isPaused) return;

        this.tick++;

        // Record population data every 5 ticks
        if (this.tick % 5 === 0) {
            graph.addDataPoint(this.creatures.length, this.predators.length, this.food.length);
        }

        // Spawn food randomly
        if (Math.random() < CONFIG.foodSpawnRate) {
            this.spawnFood();
        }

        // Update creatures
        const survivingCreatures = [];
        const newCreatures = [];

        for (const creature of this.creatures) {
            // Sense and decide
            const inputs = creature.sense(this);
            const direction = creature.decide(inputs);
            creature.move(direction);

            // Check if eating food
            const foodIdx = this.food.findIndex(
                f => f.x === creature.x && f.y === creature.y
            );
            if (foodIdx !== -1) {
                this.food.splice(foodIdx, 1);
                creature.energy = Math.min(creature.energy + CONFIG.foodEnergyGain, CONFIG.maxEnergy);
                creature.foodEaten++;
                logger.ate(creature);
            }

            // Check if can reproduce
            if (creature.canReproduce()) {
                const child = creature.reproduce();
                newCreatures.push(child);
                const oldMaxGen = this.maxGeneration;
                this.maxGeneration = Math.max(this.maxGeneration, child.generation);

                // Log milestone for new generation
                if (this.maxGeneration > oldMaxGen && this.maxGeneration > this.lastLoggedGeneration) {
                    logger.milestone(this.maxGeneration);
                    this.lastLoggedGeneration = this.maxGeneration;

                    // Show notification for every 10th generation milestone
                    if (this.maxGeneration % 10 === 0) {
                        notificationManager.showMilestone(`Prey reached Generation ${this.maxGeneration}!`, '🏆');
                    }
                }

                logger.birth(child, creature.id);
            }

            // Keep creature if still alive
            if (creature.energy > 0) {
                survivingCreatures.push(creature);
            } else {
                logger.death(creature);
            }
        }

        // Replace with surviving and new creatures
        this.creatures = survivingCreatures.concat(newCreatures);

        // Update predators
        const survivingPredators = [];
        const newPredators = [];

        for (const predator of this.predators) {
            // Sense and decide
            const inputs = predator.sense(this);
            const direction = predator.decide(inputs);
            predator.move(direction);

            // Check if caught prey
            const preyIdx = this.creatures.findIndex(
                prey => prey.x === predator.x && prey.y === predator.y
            );
            if (preyIdx !== -1) {
                const prey = this.creatures[preyIdx];
                this.creatures.splice(preyIdx, 1);
                predator.energy = Math.min(predator.energy + CONFIG.foodEnergyGain * 2, CONFIG.maxEnergy * 1.5);
                predator.kills++;
                logger.log(`🔴 Predator #${predator.id} hunted Creature #${prey.id}`, 'predator');
            }

            // Check if can reproduce
            if (predator.canReproduce()) {
                const child = predator.reproduce();
                newPredators.push(child);
                const oldMaxGen = this.maxPredatorGeneration;
                this.maxPredatorGeneration = Math.max(this.maxPredatorGeneration, child.generation);

                if (this.maxPredatorGeneration > oldMaxGen) {
                    logger.log(`🏆 Predator Generation ${this.maxPredatorGeneration} reached!`, 'milestone');

                    // Show notification for every 10th generation milestone
                    if (this.maxPredatorGeneration % 10 === 0) {
                        notificationManager.showMilestone(`Predators reached Generation ${this.maxPredatorGeneration}!`, '🔴');
                    }
                }

                logger.log(`🔴 Predator #${child.id} born (Gen ${child.generation}, Parent #${predator.id})`, 'predator');
            }

            // Keep predator if still alive
            if (predator.energy > 0) {
                survivingPredators.push(predator);
            } else {
                logger.log(`✝ Predator #${predator.id} died (Gen ${predator.generation}, Kills: ${predator.kills})`, 'death');
            }
        }

        // Replace with surviving and new predators
        this.predators = survivingPredators.concat(newPredators);

        // Track peak generations
        this.peakPreyGeneration = Math.max(this.peakPreyGeneration, this.maxGeneration);
        this.peakPredatorGeneration = Math.max(this.peakPredatorGeneration, this.maxPredatorGeneration);

        // Check for low population warnings
        if (this.creatures.length > 0 && this.creatures.length <= 5 && !this.preyLowPopWarned && !this.preyExtinct) {
            this.preyLowPopWarned = true;
            notificationManager.showWarning(`Prey population critically low! Only ${this.creatures.length} remaining.`, '⚠️');
        }
        // Reset warning flag if population recovers
        if (this.creatures.length > 10 && this.preyLowPopWarned) {
            this.preyLowPopWarned = false;
        }

        if (this.predators.length > 0 && this.predators.length <= 3 && !this.predatorLowPopWarned && !this.predatorsExtinct) {
            this.predatorLowPopWarned = true;
            notificationManager.showWarning(`Predator population critically low! Only ${this.predators.length} remaining.`, '⚠️');
        }
        // Reset warning flag if population recovers
        if (this.predators.length > 6 && this.predatorLowPopWarned) {
            this.predatorLowPopWarned = false;
        }

        // Check for predator extinction
        if (this.predators.length === 0 && !this.predatorsExtinct) {
            this.predatorsExtinct = true;
            this.maxPredatorGeneration = 0; // Reset current gen
            logger.log(`🎉 PREDATORS EXTINCT! Prey can thrive freely now. (Peak Gen: ${this.peakPredatorGeneration})`, 'milestone');
            notificationManager.showMilestone(`Predators Extinct! Prey can thrive freely.`, '🎉');
        }

        // Check for prey extinction
        if (this.creatures.length === 0 && !this.preyExtinct) {
            this.preyExtinct = true;
            this.maxGeneration = 0; // Reset current gen
            logger.log(`💀 PREY EXTINCT! Predators will starve soon. (Peak Gen: ${this.peakPreyGeneration})`, 'death');
            notificationManager.showExtinction(`Prey Extinct! Predators will starve.`, '💀');
        }

        // Check for total extinction (both species dead)
        if (this.creatures.length === 0 && this.predators.length === 0 && !this.isExtinct) {
            this.isExtinct = true;
            this.isPaused = true;
            logger.extinction(this.maxGeneration, this.tick);
            notificationManager.showExtinction(`Total Extinction! All life has perished.`, '💀');
        }
    }

    getStats() {
        return {
            population: this.creatures.length,
            generation: this.maxGeneration,
            peakPreyGeneration: this.peakPreyGeneration,
            predators: this.predators.length,
            predatorGeneration: this.maxPredatorGeneration,
            peakPredatorGeneration: this.peakPredatorGeneration,
            food: this.food.length,
            tick: this.tick
        };
    }

    save() {
        return JSON.stringify({
            creatures: this.creatures.map(c => ({
                x: c.x,
                y: c.y,
                energy: c.energy,
                generation: c.generation,
                age: c.age,
                color: c.color,
                brain: {
                    weightsIH: c.brain.weightsIH,
                    weightsHO: c.brain.weightsHO,
                    biasH: c.brain.biasH,
                    biasO: c.brain.biasO
                }
            })),
            food: this.food,
            tick: this.tick,
            maxGeneration: this.maxGeneration
        });
    }

    load(data) {
        const state = JSON.parse(data);
        this.creatures = state.creatures.map(c => {
            const creature = new Creature(c.x, c.y, null, c.generation);
            creature.energy = c.energy;
            creature.age = c.age;
            creature.color = c.color;
            creature.brain.weightsIH = c.brain.weightsIH;
            creature.brain.weightsHO = c.brain.weightsHO;
            creature.brain.biasH = c.brain.biasH;
            creature.brain.biasO = c.brain.biasO;
            return creature;
        });
        this.food = state.food.map(f => new Food(f.x, f.y));
        this.tick = state.tick;
        this.maxGeneration = state.maxGeneration;
    }
}

// ===== RENDERER =====
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CONFIG.gridWidth * CONFIG.cellSize;
        this.canvas.height = CONFIG.gridHeight * CONFIG.cellSize;
        this.fontSize = CONFIG.cellSize;
        this.ctx.font = `${this.fontSize}px "Courier New", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw static ground pattern (no random to prevent flicker)
        this.ctx.fillStyle = '#0a0';
        for (let y = 0; y < CONFIG.gridHeight; y++) {
            for (let x = 0; x < CONFIG.gridWidth; x++) {
                if ((x + y) % 7 === 0 || ((x * 3 + y * 5) % 13 === 0)) {
                    this.drawChar(x, y, '.', '#0a0');
                }
            }
        }
    }

    drawChar(x, y, char, color) {
        this.ctx.fillStyle = color;
        const px = x * CONFIG.cellSize + CONFIG.cellSize / 2;
        const py = y * CONFIG.cellSize + CONFIG.cellSize / 2;
        this.ctx.fillText(char, px, py);
    }

    render(world) {
        this.clear();

        // Draw food
        for (const food of world.food) {
            this.drawChar(food.x, food.y, '*', '#ffff00');
        }

        // Draw creatures (prey)
        for (const creature of world.creatures) {
            const color = creature.color;
            this.drawChar(creature.x, creature.y, '●', color);
        }

        // Draw predators
        for (const predator of world.predators) {
            this.drawChar(predator.x, predator.y, '▲', '#ff0000');
        }
    }
}

// ===== UI =====
class UI {
    constructor(world, renderer) {
        this.world = world;
        this.renderer = renderer;
        this.extinctionModalShown = false;
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.elements = {
            population: document.getElementById('population'),
            generation: document.getElementById('generation'),
            peakPreyGeneration: document.getElementById('peakPreyGeneration'),
            predators: document.getElementById('predators'),
            predatorGeneration: document.getElementById('predatorGeneration'),
            peakPredatorGeneration: document.getElementById('peakPredatorGeneration'),
            food: document.getElementById('food'),
            tick: document.getElementById('tick'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            spawnFoodBtn: document.getElementById('spawnFoodBtn'),
            spawnPredatorsBtn: document.getElementById('spawnPredatorsBtn'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue'),
            saveBtn: document.getElementById('saveBtn'),
            loadBtn: document.getElementById('loadBtn'),
            extinctionModal: document.getElementById('extinctionModal'),
            finalGeneration: document.getElementById('finalGeneration'),
            finalTicks: document.getElementById('finalTicks'),
            resetFromExtinction: document.getElementById('resetFromExtinction'),
            closeExtinctionModal: document.getElementById('closeExtinctionModal'),
            eventLog: document.getElementById('eventLog'),
            clearLogBtn: document.getElementById('clearLogBtn'),
            difficultySelect: document.getElementById('difficultySelect'),
            inspectorPanel: document.getElementById('inspectorPanel'),
            inspectorContent: document.getElementById('inspectorContent'),
            closeInspector: document.getElementById('closeInspector')
        };

        // Connect logger to the log element
        logger.setElement(this.elements.eventLog);

        // Connect notification manager to toast container
        const toastContainer = document.getElementById('toastContainer');
        notificationManager.setContainer(toastContainer);

        // Set initial speed display
        const initialSliderValue = parseInt(this.elements.speedSlider.value);
        const speedMap = [0.1, 0.5, 1, 2, 5, 10, 20];
        this.world.speed = speedMap[initialSliderValue];
        this.elements.speedValue.textContent = `${this.world.speed}x`;

        // Set initial play/pause button text
        this.elements.playPauseBtn.textContent = this.world.isPaused ? '▶ Play' : '⏸ Pause';

        // Set difficulty dropdown to current config
        this.elements.difficultySelect.value = CONFIG.difficulty;
    }

    setupEventListeners() {
        this.elements.playPauseBtn.addEventListener('click', () => {
            this.world.isPaused = !this.world.isPaused;
            this.elements.playPauseBtn.textContent =
                this.world.isPaused ? '▶ Play' : '⏸ Pause';
        });

        this.elements.resetBtn.addEventListener('click', () => {
            this.world.initialize();
            this.hideExtinctionModal();
            this.extinctionModalShown = false;
            graph.clear();
        });

        this.elements.resetFromExtinction.addEventListener('click', () => {
            this.world.initialize();
            this.world.isPaused = false;
            this.hideExtinctionModal();
            this.extinctionModalShown = false;
            graph.clear();
        });

        this.elements.spawnFoodBtn.addEventListener('click', () => {
            for (let i = 0; i < 10; i++) {
                this.world.spawnFood();
            }
        });

        this.elements.spawnPredatorsBtn.addEventListener('click', () => {
            const spawnCount = 3;
            for (let i = 0; i < spawnCount; i++) {
                const x = Math.floor(Math.random() * CONFIG.gridWidth);
                const y = Math.floor(Math.random() * CONFIG.gridHeight);
                const predator = new Predator(x, y);
                this.world.predators.push(predator);
            }
            this.world.predatorsExtinct = false; // Reset extinction flag
            logger.log(`🔴 ${spawnCount} predators spawned manually!`, 'predator');
        });

        this.elements.speedSlider.addEventListener('input', (e) => {
            const sliderValue = parseInt(e.target.value);
            // Map slider positions to speed multipliers
            const speedMap = [0.1, 0.5, 1, 2, 5, 10, 20];
            this.world.speed = speedMap[sliderValue];
            this.elements.speedValue.textContent = `${this.world.speed}x`;
        });

        this.elements.saveBtn.addEventListener('click', () => {
            const data = this.world.save();
            localStorage.setItem('terminalCreatures', data);
            alert('World saved!');
        });

        this.elements.loadBtn.addEventListener('click', () => {
            const data = localStorage.getItem('terminalCreatures');
            if (data) {
                this.world.load(data);
                alert('World loaded!');
            } else {
                alert('No saved world found!');
            }
        });

        this.elements.clearLogBtn.addEventListener('click', () => {
            logger.clear();
        });

        this.elements.closeExtinctionModal.addEventListener('click', () => {
            this.hideExtinctionModal();
        });

        this.elements.difficultySelect.addEventListener('change', (e) => {
            applyDifficulty(e.target.value);
            logger.log(`Difficulty changed to ${e.target.value.toUpperCase()}. Reset to apply.`, 'info');
        });

        // Inspector panel event listeners
        this.elements.closeInspector.addEventListener('click', () => {
            this.hideInspector();
        });

        // Canvas mousemove handler for hover detection
        this.renderer.canvas.addEventListener('mousemove', (e) => {
            const rect = this.renderer.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / CONFIG.cellSize);
            const y = Math.floor((e.clientY - rect.top) / CONFIG.cellSize);

            // Check if hovering over a creature or predator
            const hasCreature = this.world.creatures.some(c => c.x === x && c.y === y);
            const hasPredator = this.world.predators.some(p => p.x === x && p.y === y);

            if (hasCreature || hasPredator) {
                this.renderer.canvas.classList.add('hovering-creature');
            } else {
                this.renderer.canvas.classList.remove('hovering-creature');
            }
        });

        // Canvas click handler for creature inspection
        this.renderer.canvas.addEventListener('click', (e) => {
            const rect = this.renderer.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / CONFIG.cellSize);
            const y = Math.floor((e.clientY - rect.top) / CONFIG.cellSize);

            // Check if clicked on a creature
            const creature = this.world.creatures.find(c => c.x === x && c.y === y);
            if (creature) {
                this.inspectCreature(creature, 'prey');
                return;
            }

            // Check if clicked on a predator
            const predator = this.world.predators.find(p => p.x === x && p.y === y);
            if (predator) {
                this.inspectCreature(predator, 'predator');
                return;
            }

            // Otherwise, hide inspector
            this.hideInspector();
        });
    }

    update() {
        const stats = this.world.getStats();
        this.elements.population.textContent = stats.population;
        this.elements.generation.textContent = stats.generation;
        this.elements.peakPreyGeneration.textContent = stats.peakPreyGeneration;
        this.elements.predators.textContent = stats.predators;
        this.elements.predatorGeneration.textContent = stats.predatorGeneration;
        this.elements.peakPredatorGeneration.textContent = stats.peakPredatorGeneration;
        this.elements.food.textContent = stats.food;
        this.elements.tick.textContent = stats.tick;

        // Check for extinction and show modal (only once)
        if (this.world.isExtinct && this.elements.extinctionModal.classList.contains('hidden') && !this.extinctionModalShown) {
            this.showExtinctionModal();
            this.extinctionModalShown = true;
        }

        // Update play/pause button to reflect paused state
        this.elements.playPauseBtn.textContent = this.world.isPaused ? '▶ Play' : '⏸ Pause';
    }

    showExtinctionModal() {
        this.elements.finalGeneration.textContent = this.world.maxGeneration;
        this.elements.finalTicks.textContent = this.world.tick;
        this.elements.extinctionModal.classList.remove('hidden');
    }

    hideExtinctionModal() {
        this.elements.extinctionModal.classList.add('hidden');
    }

    inspectCreature(creature, type) {
        const content = this.elements.inspectorContent;
        const isPrey = type === 'prey';

        // Count total neural network weights
        const totalWeights = creature.brain.weightsIH.flat().length +
                            creature.brain.weightsHO.flat().length +
                            creature.brain.biasH.length +
                            creature.brain.biasO.length;

        let html = `
            <div class="inspector-info">
                <div class="inspector-row">
                    <span class="inspector-label">Type:</span>
                    <span class="inspector-value">${isPrey ? '● Prey' : '▲ Predator'}</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">ID:</span>
                    <span class="inspector-value">#${creature.id}</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">Generation:</span>
                    <span class="inspector-value">${creature.generation}</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">Parent:</span>
                    <span class="inspector-value">${creature.parentId ? '#' + creature.parentId : 'None'}</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">Age:</span>
                    <span class="inspector-value">${creature.age} ticks</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">Energy:</span>
                    <span class="inspector-value">${Math.floor(creature.energy)} / ${isPrey ? CONFIG.maxEnergy : CONFIG.maxEnergy * 1.5}</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">Position:</span>
                    <span class="inspector-value">(${creature.x}, ${creature.y})</span>
                </div>
        `;

        if (isPrey) {
            html += `
                <div class="inspector-row">
                    <span class="inspector-label">Food Eaten:</span>
                    <span class="inspector-value">${creature.foodEaten}</span>
                </div>
                <div class="inspector-row">
                    <span class="inspector-label">Color:</span>
                    <span class="inspector-value" style="color: ${creature.color}">●</span>
                </div>
            `;
        } else {
            html += `
                <div class="inspector-row">
                    <span class="inspector-label">Kills:</span>
                    <span class="inspector-value">${creature.kills}</span>
                </div>
            `;
        }

        html += `
                <div class="inspector-section">
                    <h3>Neural Network</h3>
                    <div class="inspector-row">
                        <span class="inspector-label">Architecture:</span>
                        <span class="inspector-value">${isPrey ? '9-10-4' : '6-8-4'}</span>
                    </div>
                    <div class="inspector-row">
                        <span class="inspector-label">Total Weights:</span>
                        <span class="inspector-value">${totalWeights}</span>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
        this.elements.inspectorPanel.classList.remove('hidden');
    }

    hideInspector() {
        this.elements.inspectorPanel.classList.add('hidden');
    }
}

// ===== MAIN =====
const canvas = document.getElementById('worldCanvas');
const graphCanvas = document.getElementById('populationGraph');
const world = new World();
const renderer = new Renderer(canvas);
const graph = new PopulationGraph(graphCanvas);
const ui = new UI(world, renderer);

let lastTime = 0;
const frameInterval = 1000 / 30; // 30 FPS
let updateAccumulator = 0;

function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);

    const deltaTime = currentTime - lastTime;
    if (deltaTime < frameInterval) return;
    lastTime = currentTime;

    // Handle fractional and integer speeds
    updateAccumulator += world.speed;

    const updatesToRun = Math.floor(updateAccumulator);
    updateAccumulator -= updatesToRun;

    for (let i = 0; i < updatesToRun; i++) {
        world.update();
    }

    renderer.render(world);
    graph.render();
    ui.update();
}

// Start the simulation
requestAnimationFrame(gameLoop);
