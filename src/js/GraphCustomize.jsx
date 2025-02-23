import { useState, useEffect } from 'react'
import { Button, Input, Modal, Form, Slider, Radio, Tag } from 'antd'

function GraphCustomize(props) {

    const [randomGraph, setRandonGraph] = useState(false);
    const [showPrim, setShowPrim] = useState(false);
    const [showKruskal, setShowKruskal] = useState(false);
    const [buildGraph, setBuildGraph] = useState(false);
    const [buildGraphModal, setBuildGraphModal] = useState(false);
    const [rangeValues, setRangeValues] = useState([20, 50]);
    const [probabilityRange, setprobabilityRange] = useState(0.5);

    const submitRandomGraph = (values) => {
        values.range = rangeValues
        values.probEdges = probabilityRange
        setRandonGraph(false)
        props.randomGraphCustomize(values)
    }

    const submitEdgesAndWeights = (values) => {
        setBuildGraphModal(false)
        props.insertEdgesWeightsPressed()
        props.buildGraphCustomize(values)
    }

    const submitPrimSelections = (value) => {
        setShowPrim(false)
        props.primStartingPoint(value)
        // props.cleanKruskalStatesAfterTerminate()
    }

    const submitKruskalSelections = (value) => {
        setShowKruskal(false)
        props.kruskalConfigurations(value)
        // props.cleanPrimStatesAfterTerminate()
    }

    const marks = {
        0: '0',
        20: '20',
        50: '50',
        100: '100',
    };


    const generateGraphModal = () => {
        return (
            <Modal 
                title="Customize your graph" 
                open={randomGraph} 
                onCancel={() => setRandonGraph(false)}
                footer={[]}
            >
                <Form 
                    onFinish={submitRandomGraph} 
                    // style={{ marginTop: '20px', flexDirection: 'column', display: 'flex' }}
                >
                    <Form.Item
                        name={"nodes"}
                        rules={[{
                            required: true,
                            message: 'Number of nodes required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Input 
                            addonBefore='Number of nodes'
                            placeholder='10 etc' 
                        />
                    </Form.Item>
                    <Form.Item
                        name={"probEdges"}
                        labelCol={{ span: 6 }}
                    >
                        <div>
                            <p>Probability of edges</p>
                            <Slider
                                marks={{
                                    0: '0',
                                    0.5: '0.5',
                                    1: '1'
                                }}
                                max={1}
                                min={0}
                                step={0.01} 
                                defaultValue={0.5} 
                                onChange={(val) => {
                                    setprobabilityRange(val)
                                }} 
                                // onChangeComplete={onChangeComplete} 
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name={"range"}
                        labelCol={{ span: 6 }}
                    >
                        <div>
                            <p>Range of weights</p>
                            <Slider
                                range
                                step={1}
                                marks={marks}
                                defaultValue={rangeValues}
                                onChange={(val) => {
                                    setRangeValues(val)
                                }}
                                // onChangeComplete={onChangeComplete}
                            />
                        </div>
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="middle"
                    >
                        Submit
                    </Button>
                </Form>
            </Modal>
        )
    }

    const primOnSteroids = () => {
        return (
            <Modal 
                title="Customize Prim algorithm" 
                open={showPrim} 
                onCancel={() => setShowPrim(false)}
                footer={[]}
            >
                <Form 
                    onFinish={submitPrimSelections} 
                >
                    <Form.Item
                        name={"startingNode"}
                        rules={[{
                            required: true,
                            message: 'Starting point required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Input
                            addonBefore='Starting point' 
                            placeholder='a' 
                        />
                    </Form.Item>
                    <Form.Item
                        name={"primCustomize"}
                        rules={[{
                            required: true,
                            message: 'Customization for Prim required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Radio.Group
                            options={[
                                { label: 'Final Graph', value: 'finalGraph' },
                                { label: 'Step by Step', value: 'stepByStep' }
                            ]}
                            // onChange={onChange1}
                            // value={value1}
                        />
                    </Form.Item> 
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="middle"
                    >
                        Submit
                    </Button>
                </Form>
            </Modal>
        )
    }

    const kruskalOnSteroids = () => {
        return (
            <Modal 
                title="Customize Kruskal algorithm" 
                open={showKruskal} 
                onCancel={() => setShowKruskal(false)}
                footer={[]}
            >
                <Form 
                    onFinish={submitKruskalSelections} 
                >
                    <Form.Item
                        name={"kruskalCustomize"}
                        rules={[{
                            required: true,
                            message: 'Customization for Kruskal required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Radio.Group
                            options={[
                                { label: 'Final Graph', value: 'finalGraph' },
                                { label: 'Step by Step', value: 'stepByStep' }
                            ]}
                            // onChange={onChange1}
                            // value={value1}
                        />
                    </Form.Item> 
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="middle"
                    >
                        Submit
                    </Button>
                </Form>
            </Modal>
        )
    }

    const addYourEdgesAndWeights = () => {
        return (
            <Modal 
                title="Add edges and weight on your graph" 
                open={buildGraphModal} 
                onCancel={() => setBuildGraphModal(false)}
                footer={[]}
            >
                <Form 
                    onFinish={submitEdgesAndWeights} 
                >
                    <Form.Item
                        name={"fromNode"}
                        rules={[{
                            required: true,
                            message: 'Starting point of node required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Input 
                            addonBefore='From node'
                            placeholder='a etc' 
                        />
                    </Form.Item>
                    <Form.Item
                        name={"untilNode"}
                        rules={[{
                            required: true,
                            message: 'Finishing point of node required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Input 
                            addonBefore='Until node'
                            placeholder='b etc' 
                        />
                    </Form.Item>
                    <Form.Item
                        name={"weights"}
                        rules={[{
                            required: true,
                            message: 'Number of weight required'
                        }]}
                        labelCol={{ span: 6 }}
                    >
                        <Input 
                            addonBefore='Number of weight'
                            placeholder='10 etc' 
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="middle"
                    >
                        Submit
                    </Button>
                </Form>
            </Modal>
        )
    }

    return (
        <div 
            style={{
                textAlign: "center",
            }}
        >
            <h2>Customize Graph</h2>
            <div 
                style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px' /* Adjust margin as needed */
                }}
            >
                <Button 
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => setBuildGraph(!buildGraph)}
                >
                    Build Graph
                </Button>
                <Button 
                    type="primary"
                    onClick={() => {setRandonGraph(true), setBuildGraph(false)}}
                >
                    Generate Graph
                </Button>
            </div>
            {
                randomGraph && 
                    generateGraphModal()
            }
            {
                buildGraph &&
                    <div>
                        <h3>Build you own graph</h3>
                        <Button 
                            type="primary"
                            style={{ marginRight: '10px' }}
                            onClick={() => props.addNodePressed()}
                        >
                            Insert Node
                        </Button>
                        <Button 
                            type="primary"
                            style={{ marginRight: '10px' }}
                            onClick={() => setBuildGraphModal(true)}
                        >
                            Insert edges and weights
                        </Button>
                    </div>
            }
            {
                buildGraphModal && 
                    addYourEdgesAndWeights()
            }
            <div style={{paddingTop: 10}}>
                <h2>Apply MST Algoriths</h2>
                {/* <p>Kryskal</p> */}
                <Button 
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => setShowKruskal(true)}
                    // disabled={buildGraphModal == false}
                >
                    Kruskal
                </Button>
                <Button 
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => setShowPrim(true)}
                    // disabled={buildGraphModal == false}
                >
                    Prim
                </Button>
            </div>
            {
                showPrim &&
                    primOnSteroids()
            }
            {
                showKruskal &&
                    kruskalOnSteroids()
            }
        </div>
    )
}

export default GraphCustomize