import { useCallback, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  type Connection,
  type Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflow, useSaveWorkflow } from '../hooks/useApi';
import { Save, Plus } from 'lucide-react';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Início do Fluxo' }, type: 'input' },
];

export default function FlowBuilderPage({ projectId }: { projectId: string }) {
  const { data: savedFlow, isLoading } = useWorkflow(projectId);
  const saveWorkflow = useSaveWorkflow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (savedFlow) {
      setNodes(savedFlow.nodes || initialNodes);
      setEdges(savedFlow.edges || []);
    }
  }, [savedFlow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    saveWorkflow.mutate({
      project_id: projectId,
      flow_json: { nodes, edges },
    });
  };

  const handleAddNode = () => {
    const newNodeId = `node_${Date.now()}`;
    const newNode = {
      id: newNodeId,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { label: 'Nova Etapa' },
      type: 'default',
    };
    setNodes((nds) => [...nds, newNode]);
  };

  if (isLoading) return <div className="p-8 text-gray-500">Carregando fluxo...</div>;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark/50">
        <h3 className="font-bold text-gray-200">Flow Builder</h3>
        <div className="flex gap-4">
          <button 
            onClick={handleAddNode}
            className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nó
          </button>
          <button 
            onClick={handleSave}
            disabled={saveWorkflow.isPending}
            className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saveWorkflow.isPending ? 'Salvando...' : 'Salvar Fluxo'}
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#0b0c10]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#1a1c24" gap={20} />
          <Controls />
          <MiniMap 
            nodeColor={(n: any) => n.type === 'input' ? '#aa3bff' : '#2e303a'}
            maskColor="rgba(0,0,0,0.5)"
            style={{ backgroundColor: '#16171d', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
