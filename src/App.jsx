import { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";
import GraphTheory from "./js/GraphTheory";
import GraphCustomize from "./js/GraphCustomize";
import InstructionModal from "./js/HowToUse";
import LanguageSelector from "./js/LanguageSelector";
import { useTranslation } from "react-i18next";

function App() {
  const [addNode, setAddNode] = useState(false);
  const [finishCustomize, setFinishCustomize] = useState(false);
  const [buildOwnGraphPressed, setbuildOwnGraphPressed] = useState(false);
  const [isAlgorithmFinished, setIsAlgorithmFinished] = useState(false);
  const [isGraphDownloaded, setisGraphDownloaded] = useState(false);
  const [runningAlgorithm, setRunningAlgorithm] = useState("");
  const [randomGraph, setRandomGraph] = useState({
    numberOfNodes: undefined,
    numberOfVertices: undefined,
    rangeOfWeights: undefined,
  });
  const [edgesAndWeights, setEdgesAndWeights] = useState({
    fromNode: undefined,
    untilNode: undefined,
    weightsNode: undefined,
  });
  const [starterPrim, setStarterPrim] = useState({
    startingNode: undefined,
    options: undefined,
  });
  const [kruskalAlg, setKruskalAlg] = useState({
    options: undefined,
  });

  const { t } = useTranslation()

  const { Header, Content, Sider } = Layout;

  const addNodePressed = () => {
    setAddNode(!addNode);
  };

  const insertEdgesWeightsPressed = () => {
    setbuildOwnGraphPressed(!buildOwnGraphPressed);
  };

  const randomGraphCustomize = (data) => {
    setFinishCustomize(true);
    setRandomGraph({
      numberOfNodes: data.nodes,
      numberOfVertices: data.probEdges,
      rangeOfWeights: data.range,
    });
  };

  const buildGraphCustomize = (data) => {
    setFinishCustomize(true);
    setEdgesAndWeights({
      fromNode: data.fromNode,
      untilNode: data.untilNode,
      weightsNode: data.weights,
    });
  };

  const primStartingPoint = (data) => {
    setIsAlgorithmFinished(false);
    setRunningAlgorithm("prim");
    setStarterPrim({
      startingNode: data.startingNode,
      option: data.primCustomize,
    });
  };

  const kruskalConfigurations = (data) => {
    setIsAlgorithmFinished(false);
    setRunningAlgorithm("kruskal");
    setKruskalAlg({
      option: data.kruskalCustomize,
    });
  };

  const cleanAlgorithmStatesAfterTerminate = () => {
    setIsAlgorithmFinished(false);
    // setisGraphDownloaded(true);
    setRunningAlgorithm("");
    setStarterPrim({
      startingNode: undefined,
      options: undefined,
    });
    setKruskalAlg({
      options: undefined,
    });
    setFinishCustomize(false);
  };

  const algorithmFinished = () => {
    setIsAlgorithmFinished(true);
  };

  const downloadGraph = () => {
    setisGraphDownloaded(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
        }}
      >
        {/* Left-aligned */}
        <h3 style={{ color: "white", whiteSpace: "nowrap" }}>{t('MstCalculator')}</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            color: "white",
          }}
        >
          <InstructionModal />
          <span style={{ fontWeight: "bold", color: "white" }}>|</span>
          <h3>{t('Training')}</h3>
        </div>
        <span
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LanguageSelector />
        </span>
      </Header>
      <Content style={{ padding: "0 24px", background: "#F5F5F5" }}>
        <Layout style={{ flex: 1 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={6}>
              <Sider
                style={{
                  background: "#F5F5F5",
                  padding: "16px",
                  width: "100%",
                }}
                width={400}
              >
                <GraphCustomize
                  addNodePressed={addNodePressed}
                  finishCustomize={finishCustomize}
                  insertEdgesWeightsPressed={insertEdgesWeightsPressed}
                  randomGraphCustomize={randomGraphCustomize}
                  buildGraphCustomize={buildGraphCustomize}
                  primStartingPoint={primStartingPoint}
                  kruskalConfigurations={kruskalConfigurations}
                  isAlgorithmFinished={isAlgorithmFinished}
                  runningAlgorithm={runningAlgorithm}
                  downloadGraph={downloadGraph}
                />
              </Sider>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
              <Content style={{ padding: "16px" }}>
                <GraphTheory
                  nodeAdded={addNode}
                  addNodePressed={addNodePressed}
                  insertEdgesWeightsPressed={insertEdgesWeightsPressed}
                  buildOwnGraphPressed={buildOwnGraphPressed}
                  randomGraph={randomGraph}
                  edgesAndWeights={edgesAndWeights}
                  primStarting={starterPrim}
                  kruskalConfigurations={kruskalAlg}
                  cleanAlgorithmStatesAfterTerminate={
                    cleanAlgorithmStatesAfterTerminate
                  }
                  isAlgorithmFinished={isAlgorithmFinished}
                  algorithmFinished={algorithmFinished}
                  runningAlgorithm={runningAlgorithm}
                  isGraphDownloaded={isGraphDownloaded}
                />
              </Content>
            </Col>
          </Row>
        </Layout>
      </Content>
    </Layout>
  );
}

export default App;
