import { useState, useEffect } from 'react'
import cytoscape from 'cytoscape';
import { Button, notification, Tag} from 'antd'
import {StepForwardOutlined, DownloadOutlined} from '@ant-design/icons'

function GraphTheory(props) {
    const [cy, setCy] = useState(undefined);
    const [currentLetter, setCurrentLetter] = useState('a');
    const [step, setStep] = useState(0)
    const [saveNodes, setSaveNodes] = useState([{data: {id: 'a'}}])
    const [saveWeights, setSaveWeights] = useState([])
    const [primResults, setPrimResults] = useState([])
    const [kruskalResults, setKruskalResults] = useState([])
    const [totalWeigthsAre, setTotalWeightsAre] = useState(0)

    useEffect(() => {
    // Initialize Cytoscape after component mounts
        const cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
            elements: [ // list of graph elements to start with
                { // node a
                    data: { id: 'a' }
                },
            ],
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                },
                {
                    // selector: 'edge',
                    style: {
                        'width': 1,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                }
            ],
            layout: {
                name: 'random',
                fit: true
            },
            zoom: 10,
            maxZoom: 1,
            minZoom: 0.7
        });
        setCy(cy)
        // Clean up function to remove Cytoscape instance when component unmounts
        return () => {
            cy.destroy();
        };
    }, []);

    useEffect(() => {
        if (props.nodeAdded && cy !== undefined) {
            addNode();
        }
        if (props.buildOwnGraphPressed) {
            addEdge()
        }
    }, [props.nodeAdded, cy, props.buildOwnGraphPressed])

    useEffect(() => {
        console.log('props.primStarting :', props.primStarting)
        if (props.primStarting.startingNode !== undefined && cy !== undefined) {
            console.log('save node is :', saveNodes)
            const found = saveNodes.find(node => node.data.id === props.primStarting.startingNode);
            console.log('found is :', found)
            if (found != undefined) {
                resetColorGraphAfterChangeStartingPoint()
                let prim = primAlgorithm(saveWeights, props.primStarting.startingNode)
                console.log('prim is :', prim)
                console.log('saveWeights is :', saveWeights)
                const elements = prim.map(edge => {
                    //* Map the prim results with the routes we give
                    let reverseExists = false

                    saveWeights.some(ref => {
                        if (ref.data.source === edge.target && ref.data.target === edge.source) {
                            reverseExists = true;
                            // console.log("Reverse route found:", ref)
                            return true; // Stop iteration
                        }
                        return false;
                    });
                    
                    const source = reverseExists ? edge.target : edge.source;
                    const target = reverseExists ? edge.source : edge.target;

                    return {
                        data: {
                            id: `${source}-${target}`, // Unique ID for the edge
                            source: source, // ID of the source node
                            target: target, // ID of the target node
                            weight: edge.weight // Weight of the edge
                        }
                    }
                });
                
                setPrimResults(elements)
                console.log('elements :', elements)
                if (props.primStarting.option === "finalGraph") {
                    let sumWeight = elements.reduce((acc, edge) => acc + edge.data.weight, 0);
                    elements.map((edge) => {
                        cy.$(`#${edge.data.id}`).style({
                            'line-color': 'orange',
                            'label': edge.data.weight,
                        });
                    })

                    setTotalWeightsAre(sumWeight);
                }
                
                //TODO: Works if we want to erase the previous graph
                // cy.elements().remove();
                // cy.add(saveNodes)
                // console.log('ton pairneis 1')
                // cy.add(elements)
                // console.log('ton pairneis 2')
                // cy.layout({ name: 'random' }).run();

                // cy.style()
                // .selector('node')
                // .style({
                //     'label': 'data(id)',
                //     'background-color': '#666',
                //     'color': '#fff',
                //     'text-valign': 'center',
                //     'text-halign': 'center'
                // })
                // .selector('edge')
                // .style({
                //     'label': 'data(weight)',
                //     'text-background-color': 'white',
                //     'text-background-opacity': 1,
                //     'text-background-padding': '3px',
                //     'text-valign': 'center',
                //     'text-halign': 'center'
                // })
                // .update();
                //TODO: Untill here

            } else {
                if (props.primStarting.startingNode == undefined) {
                    setStep(0)
                } else {
                    return (
                        notification.error({
                            message: `Node can't be found`,
                            duration: 0
                          })
                    ) 
                }
            }
        }
    }, [props.primStarting])

    useEffect(() => {
        let kruskalMst = kruskalAlgorithm()

        const kruskalElements = kruskalMst.map(kruskal => {
            return {
                data: {
                    id: `${kruskal.source}-${kruskal.target}`, // Unique ID for the edge
                    source: kruskal.source, // ID of the source node
                    target: kruskal.target, // ID of the target node
                    weight: kruskal.weight // Weight of the edge
                }
            }
        })

        console.log('kruskalElements are :', kruskalElements)
        setKruskalResults(kruskalElements)
        if (props.kruskalConfigurations.option === "finalGraph") {
            let sumWeight = kruskalElements.reduce((acc, edge) => acc + edge.data.weight, 0);
            kruskalElements.map((edge) => {
                cy.$(`#${edge.data.id}`).style({
                    'line-color': 'orange',
                    'label': edge.data.weight,
                });
            })

            setTotalWeightsAre(sumWeight);
        }
    }, [props.kruskalConfigurations])

    useEffect(() => {
        if (props.randomGraph && cy !== undefined) {
            generateRandomGraph(props.randomGraph.numberOfNodes, props.randomGraph.rangeOfWeights, props.randomGraph.numberOfVertices)
        }
    }, [props.randomGraph])

    // * Clearing state of Prim after terminate. 
    // TODO: See first if this is necessary 29/12
    // TODO: Error appear (Edge not found -> have to handle it)
    // useEffect(() => {
    //     if (step >= primResults.length) {
    //         props.cleanPrimStatesAfterTerminate();
    //     }
    // }, [step]);

    const addNode = () => {
        let nodeNames = cy.nodes().map(node => node.id());
        let nodesLen = nodeNames.length;
    
        // Determine the ASCII code and new node ID
        let lastNodeCharCode = nodesLen > 0 ? nodeNames[nodesLen - 1].charCodeAt(0) : currentLetter.charCodeAt(0);
        let nextNodeId = String.fromCharCode(lastNodeCharCode + 1);
    
        // Determine the position of the new node
        let position = nodesLen > 0 
            ? cy.getElementById(String.fromCharCode(lastNodeCharCode)).position() 
            : { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 3) }

        let nextNode = { data: { id: nextNodeId }}

        // Add more space between the position of the nodes
        position = {
            x: position.x + 25,
            y: position.y + 25
        };

        // If do-not remember :( ?? 
        if (saveNodes.length > 1) {
            let lastNodeIs = saveNodes
        }

        cy.add({ 
            group: 'nodes', 
            data: {
                id: nextNodeId
            }, 
            position: position
        });
        setSaveNodes(prevData => [...prevData, nextNode])
        setCurrentLetter(nextNodeId)
        props.addNodePressed();
    }

    const addEdge = () => {
        const fromNode = props.edgesAndWeights.fromNode;
        const toNode = props.edgesAndWeights.untilNode;
        const weight = props.edgesAndWeights.weightsNode;

        const structureWeight = {
            data: {
                id: fromNode + '-' + toNode,
                source: fromNode,
                target: toNode,
                weight: weight
            }
        }
    
        // Check if both nodes exist in the graph
        if (cy.getElementById(fromNode).empty() || cy.getElementById(toNode).empty()) {
            console.error('One or both nodes do not exist in the graph');
            return (
                notification.error({
                    message: `One or both nodes do not exist in the graph`,
                    duration: 0
                  })
            )
        }

        cy.add({
            group: 'edges',
            data: {
                id: fromNode + '-' + toNode, // Unique ID for the edge
                source: fromNode,
                target: toNode,
                weight: weight
            }
        });
        cy.style().selector('edge').style({
            'label': 'data(weight)', // Display weight as edge label
            'text-background-color': 'white',
            'text-background-opacity': 1,
            'text-background-padding': '3px',
            'text-valign': 'center',
            'text-halign': 'center'
        }).update();
        setSaveWeights(prevData => [...prevData,structureWeight])
        props.insertEdgesWeightsPressed()
    }

    const generateRandomGraph = (numNodes, numWeights, numEdges) => {
        // Clear existing nodes and edges
        cy.elements().remove();

        // Add random nodes
        const randomNodes = [];
        for (let i = 0; i < numNodes; i++) {
            const nodeId = String.fromCharCode(97 + i); // Generate node ID ('a', 'b', 'c', ...)
            randomNodes.push({ data: { id: nodeId } });
        }
        cy.add(randomNodes);
        setSaveNodes(randomNodes)

        //TODO: Check the probabiity
        // console.log('check the prob :', numEdges)
        const randomEdges = [];
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) { // Connect each node to all other nodes except itself and previous ones
                let ran = Math.random()
                // console.log('ran is :', ran)
                const sourceNodeId = randomNodes[i].data.id;
                const targetNodeId = randomNodes[j].data.id;
                const weight = Math.floor(Math.random() * (numWeights[1] - numWeights[0])) + numWeights[0]; // Random weight
                //TODO: Erase this and find a way to be fair
                if (ran < numEdges){
                    randomEdges.push({ data: { id: `${sourceNodeId}-${targetNodeId}`, source: sourceNodeId, target: targetNodeId, weight: weight } });
                }
            }
        }
        // console.log('randomEdges :', randomEdges)
        cy.add(randomEdges);
        setSaveWeights(randomEdges)

        // Layout the graph
        cy.layout({ name: 'random' }).run();

        cy.style()
        .selector('node')
        .style({
            'label': 'data(id)',
            'background-color': '#666',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center'
        })
        .selector('edge')
        .style({
            'label': 'data(weight)',
            'line-color': '#ccc',
            'text-background-color': 'white',
            'text-background-opacity': 1,
            'text-background-padding': '3px',
            'text-valign': 'center',
            'text-halign': 'center'
        })
        .update();
    };


    const primAlgorithm = (edges, startNode) => {
        //TODO: Bug on build your own grph ----> SOLVED
        //TODO: Make a rework if the node has not edges
        // Set of nodes already included in MST
        const mstSet = new Set();
        // Array to store the MST edges
        const mstEdges = [];
        // Map to store node connections and weights
        const nodeMap = {};
      
        // Create a node map for easy edge lookup
        edges.forEach(edge => {
          const { source, target, weight } = edge.data;
          if (!nodeMap[source]) nodeMap[source] = [];
          if (!nodeMap[target]) nodeMap[target] = [];
          nodeMap[source].push({ target, weight });
          nodeMap[target].push({ target: source, weight });
        });
        
        // Priority queue to store edges as [weight, source, target]
        let priorityQueue = [];
        // Initialize with the startNode
        mstSet.add(startNode);
        if (nodeMap[startNode]) {
          for (let { target, weight } of nodeMap[startNode]) {
            priorityQueue.push([weight, startNode, target]);
          }
        }
        
        // Convert priority queue to a heap (optional for efficiency)
        priorityQueue.sort((a, b) => a[0] - b[0]);
        while (mstSet.size < Object.keys(nodeMap).length) {
          // Get the edge with the smallest weight
            let [weight, source, target] = priorityQueue.shift();
            
            // If the target node is already in the MST, continue
            if (mstSet.has(target)) continue;
      
            // Add the edge to the MST
            mstEdges.push({ source, target, weight });
            // Add the new node to the MST set
            mstSet.add(target);
      
            // Add all edges from the newly added node to the priority queue
            if (nodeMap[target]) {
                for (let { target: nextTarget, weight: nextWeight } of nodeMap[target]) {
                if (!mstSet.has(nextTarget)) {
                    priorityQueue.push([nextWeight, target, nextTarget]);
                }
                }
            }
        
            // Sort the priority queue by weight (optional if using a real priority queue)
            priorityQueue.sort((a, b) => a[0] - b[0]);
        }

        return mstEdges;
    }

    const find = (parent, node) => {
        if (parent[node] === undefined) {
          parent[node] = node; // Initialize parent
        }
        if (parent[node] !== node) {
          parent[node] = find(parent, parent[node]); // Path compression
        }
        return parent[node];
    };
      
      const union = (parent, node1, node2) => {
        const root1 = find(parent, node1);
        const root2 = find(parent, node2);
        if (root1 !== root2) {
          parent[root2] = root1;
          return true; // Union was successful
        }
        return false; // Already in the same set
    };

    const kruskalAlgorithm = () => {
        setTotalWeightsAre(0);
        let totalGraphPath = []
        let mst = []
        const parent = {};

        totalGraphPath = saveWeights.map(item => item.data);
        totalGraphPath.sort((a, b) => a.weight - b.weight);

        console.log('totalGraphPath :', totalGraphPath)

        for (const edge of totalGraphPath) {
            const { source, target, weight } = edge;

            // By using union and find we use the Disjoint-set data structure

            if (union(parent, source, target)) {
                mst.push({ source, target, weight });
            }
        
            // Stop early if the MST is complete
            if (mst.length === saveWeights.length - 1) {
              break;
            }
        }

        return mst
    }

    const getAlgorithStepByStep = (algorunning) => {
        
        const selectedAlg = algorunning === 'prim' ? primResults : kruskalResults;

        cy.$(`#${selectedAlg[step].data.id}`).style({
            'line-color': 'orange',
            'label': selectedAlg[step].data.weight,
        });
        setStep(step + 1);
        setTotalWeightsAre(prevTotal => prevTotal + selectedAlg[step].data.weight);
    }

    const resetColorGraphAfterChangeStartingPoint = () => {
        saveWeights.forEach(edgeId => {
            cy.$(`#${edgeId.data.id}`).style({
                'line-color': '#ccc',
            });
        });
        setStep(0)
        setTotalWeightsAre(0);
    }

    const triggerClearGraph = () => {
        cy.elements().remove();
        setCurrentLetter('`');
        props.cleanPrimStatesAfterTerminate();
    }

    // TODO: Disable the random graph maybe after the selection of the build graph
    // TODO: After Generate graoh allow user to build a graph without page blank ----> SOLVED
    // TODO: Erase the colors of the graph after the algorithm finish and the build graph occured
    // TODO: Make Kruskal undefined after the Prim alg selected.
    // TODO: Make adjustements after the Kruskal alg proccedd after the prim was executed
    // TODO: Add the sum of the weights
    // TODO: Maybe better structure ??

    return (
        <>
            <div id="cy" style={{ width: 'auto', height: '650px', backgroundColor: 'white' }}>
                {
                    (props.primStarting.option == "stepByStep" || props.primStarting.option == "finalGraph") &&
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', padding: '5px', zIndex: 10 }}>
                        <Tag style={{marginTop: 5}} color="cyan">Prim's Algorithm</Tag>
                        <Tag style={{marginTop: 5}} color="green">Source: {props.primStarting.startingNode}</Tag>
                        <Tag style={{marginTop: 5}} color="red">Weights: {totalWeigthsAre}</Tag>
                    </div>
                }
                {
                    (props.kruskalConfigurations.option == "stepByStep" || props.kruskalConfigurations.option == "finalGraph") &&
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', padding: '5px', zIndex: 10 }}>
                        <Tag style={{marginTop: 5}} color="cyan">Kruskal's Algorithm</Tag>
                        <Tag style={{marginTop: 5}} color="red">Weights: {totalWeigthsAre}</Tag>
                    </div>
                }
            </div>

            <Button
                type="primary"
                onClick={triggerClearGraph}
                disabled={props.primStarting.option === "stepByStep" && step<primResults.length}
                style={{marginTop: 10}}
            >
                Clear Graph
            </Button>
            {
                    ((props.primStarting.option == "stepByStep" && step < primResults.length) || 
                    (props.kruskalConfigurations.option == "stepByStep" && step < kruskalResults.length)) &&
                    <Button
                        type="primary" 
                        shape="circle" 
                        style={{marginLeft: 4}}
                        disabled={step>=primResults.length && step>=kruskalResults.length}
                        onClick={() => 
                            props.kruskalConfigurations.option == "stepByStep" ?

                                getAlgorithStepByStep('kruskal')
                            :
                                props.primStarting.option == "stepByStep" ?
                                    getAlgorithStepByStep('prim')
                                :
                                    undefined
                        }
                    >
                        <StepForwardOutlined/>
                    </Button>
            }
            {
                <Button 
                    type="primary" 
                    shape="circle" 
                    style={{marginLeft: 4}}
                    onClick={() => {
                        const imageData = cy.png({ full: true }); // Export as PNG
                        const link = document.createElement('a');
                        link.href = imageData;
                        link.download = 'graph.png';
                        link.click();
                    }}
                >
                    <DownloadOutlined/>
                </Button>
            }
        </>
    )

}

export default GraphTheory